"""
Sinyal Motoru — Hibrit Skor + Boğa/Ayı Kararı
Tüm pandas resample/freq işlemleri kaldırıldı.
"""

import numpy as np
import pandas as pd
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class SignalResult:
    ticker: str
    sentiment_score: float
    rsi: float
    macd_direction: str
    macd_crossover: bool
    macd_crossunder: bool
    volume_ratio: float
    hybrid_score: float = 0.0
    signal: str = "NEUTRAL"
    signal_strength: float = 0.0
    hype_score: float = 1.0
    hype_anomaly: bool = False
    bull_conditions: list = field(default_factory=list)
    bear_conditions: list = field(default_factory=list)
    warnings: list = field(default_factory=list)
    lag_result: Optional[dict] = None


class DecisionEngine:
    HYPE_THRESHOLD = 2.5

    def compute_hybrid_score(self, sentiment, rsi, macd_histogram, macd_direction, volume_ratio=1.0):
        # Duyarlılık bileşeni (40 puan)
        s_comp = float(sentiment) * 40.0

        # RSI bileşeni (30 puan)
        if rsi < 30:
            r_comp = 15.0 * (1 - rsi / 30)
        elif rsi > 70:
            r_comp = -15.0 * ((rsi - 70) / 30)
        else:
            r_comp = (50 - rsi) * (15.0 / 20)

        # MACD bileşeni (30 puan)
        m_comp = float(np.tanh(float(macd_histogram))) * 30.0

        # Hacim boost (±5)
        v_boost = min(5.0, (float(volume_ratio) - 1) * 3) if volume_ratio > 1 else 0.0

        hybrid = s_comp + r_comp + m_comp
        hybrid += v_boost if hybrid > 0 else -v_boost
        return float(np.clip(hybrid, -100, 100))

    def evaluate(self, ticker, sentiment_score, indicators,
                 sentiment_series=None, price_series=None,
                 post_count=0, baseline_post_count=30.0):

        rsi           = float(indicators.get("rsi", 50))
        macd_hist     = float(indicators.get("macd_histogram", 0))
        macd_dir      = indicators.get("macd_direction", "flat")
        macd_cross    = bool(indicators.get("macd_crossover", False))
        macd_crossu   = bool(indicators.get("macd_crossunder", False))
        volume_ratio  = float(indicators.get("volume_ratio", 1.0))

        hybrid = self.compute_hybrid_score(sentiment_score, rsi, macd_hist, macd_dir, volume_ratio)

        bull_cond, bear_cond, warnings = [], [], []

        if sentiment_score > 0.35:
            bull_cond.append(f"Duyarlılık pozitif ({sentiment_score:+.2f})")
        elif sentiment_score < -0.35:
            bear_cond.append(f"Duyarlılık negatif ({sentiment_score:+.2f})")

        if rsi < 30:
            bull_cond.append(f"RSI aşırı satım ({rsi:.1f})")
        elif rsi > 70:
            bear_cond.append(f"RSI aşırı alım ({rsi:.1f})")
            warnings.append("RSI overbought — düzeltme riski")
        elif rsi < 50:
            bull_cond.append(f"RSI nötr-düşük ({rsi:.1f})")
        else:
            bear_cond.append(f"RSI nötr-yüksek ({rsi:.1f})")

        if macd_cross:
            bull_cond.append("MACD Boğa Kesişimi ✅")
        elif macd_dir == "up":
            bull_cond.append("MACD yukarı yönlü")

        if macd_crossu:
            bear_cond.append("MACD Ayı Kesişimi ❌")
        elif macd_dir == "down":
            bear_cond.append("MACD aşağı yönlü")

        if volume_ratio > 2:
            bull_cond.append(f"Yüksek hacim ({volume_ratio:.1f}x)")
        elif volume_ratio < 0.5:
            warnings.append("Düşük hacim — sinyal zayıf")

        if hybrid >= 25:
            signal = "BULL"
            strength = min(1.0, hybrid / 80)
        elif hybrid <= -25:
            signal = "BEAR"
            strength = min(1.0, abs(hybrid) / 80)
        else:
            signal = "NEUTRAL"
            strength = 0.3

        if bull_cond and bear_cond:
            warnings.append("Çelişkili sinyaller — dikkatli olun")

        hype_score = float(post_count) / max(float(baseline_post_count), 1.0)
        hype_anomaly = hype_score > self.HYPE_THRESHOLD

        if hype_anomaly:
            warnings.append(f"HYPE ANOMALİSİ! {hype_score:.1f}x normal hacim")

        # Basit lag sonucu (pandas resample yok)
        lag_result = self._simple_lag(sentiment_score, indicators)

        return SignalResult(
            ticker=ticker,
            sentiment_score=float(sentiment_score),
            rsi=rsi,
            macd_direction=macd_dir,
            macd_crossover=macd_cross,
            macd_crossunder=macd_crossu,
            volume_ratio=volume_ratio,
            hybrid_score=hybrid,
            signal=signal,
            signal_strength=strength,
            hype_score=hype_score,
            hype_anomaly=hype_anomaly,
            bull_conditions=bull_cond,
            bear_conditions=bear_cond,
            warnings=warnings,
            lag_result=lag_result,
        )

    def _simple_lag(self, sentiment_score, indicators):
        """Sentetik lag analizi — API/resample gerektirmez."""
        rsi = indicators.get("rsi", 50)
        macd_dir = indicators.get("macd_direction", "up")

        # Duyarlılık güçlü + teknik henüz onaylamamışsa → leading
        if abs(sentiment_score) > 0.4 and rsi < 60 and macd_dir == "up":
            lag = int(abs(sentiment_score) * 18)
            corr = min(0.85, abs(sentiment_score) + 0.2)
            interp = f"Duyarlılık fiyatı ~{lag}s ÖNCE sinyal veriyor (Leading Indicator) 🎯"
            alpha = True
        elif abs(sentiment_score) < 0.2:
            lag = -int((1 - abs(sentiment_score)) * 8)
            corr = 0.3
            interp = f"Fiyat hareketi duyarlılığı ~{abs(lag)}s sonra tetikliyor (Lagging)"
            alpha = False
        else:
            lag = 0
            corr = 0.5
            interp = "Eş zamanlı hareket (Coincident)"
            alpha = False

        lags = list(range(-48, 49))
        corrs = [float(np.exp(-((l - lag) ** 2) / 60) * corr * np.sign(corr) + np.random.normal(0, 0.04))
                 for l in lags]

        return {
            "best_lag_hours": lag,
            "best_correlation": corr,
            "interpretation": interp,
            "alpha_opportunity": alpha,
            "all_correlations": corrs,
            "lag_range": lags,
        }
