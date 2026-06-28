"""
Duyarlılık Motoru — Sadece Demo
Karmaşık NLP yerine hisse profiline göre tutarlı skorlar üretir.
"""

import numpy as np
import pandas as pd
import random
from dataclasses import dataclass


@dataclass
class PostScore:
    text: str
    raw_score: float
    weighted_score: float
    weight: float
    source: str
    timestamp: object
    engagement: int


class SentimentEngine:
    def __init__(self, model_type: str = "vader"):
        self.model_type = model_type

    def analyze_posts(self, posts: list[dict]) -> tuple[float, list, dict]:
        if not posts:
            return 0.0, [], {}

        scored = []
        for post in posts:
            # Kelime bazlı basit skor
            text = post.get("text", "").lower()
            pos_words = {"bull","bullish","moon","rocket","buy","breakout","strong",
                         "boğa","al","yüksel","artış","güçlü","fırsat","alım","rally","pump"}
            neg_words = {"bear","bearish","crash","sell","dump","short","weak",
                         "ayı","sat","düş","düşüş","zayıf","kötü","tehlike","drop"}
            words = set(text.split())
            pos = len(words & pos_words)
            neg = len(words & neg_words)
            if pos + neg == 0:
                raw = 0.0
            else:
                raw = (pos - neg) / (pos + neg)

            engagement = post.get("engagement", 1)
            age = post.get("account_age_days", 365)
            w = min(1.0, (np.log1p(engagement) / np.log1p(1000)) * (min(age, 365) / 365))
            w = max(0.05, w)

            scored.append(PostScore(
                text=post.get("text", ""),
                raw_score=raw,
                weighted_score=raw * w,
                weight=w,
                source=post.get("source", "reddit"),
                timestamp=post.get("timestamp"),
                engagement=int(engagement),
            ))

        total_w = sum(s.weight for s in scored) or 1
        aggregate = sum(s.weighted_score for s in scored) / total_w
        raw_scores = [s.raw_score for s in scored]

        stats = {
            "count": len(scored),
            "mean_raw": float(np.mean(raw_scores)),
            "std_raw": float(np.std(raw_scores)),
            "bullish_pct": sum(1 for s in raw_scores if s > 0.05) / len(raw_scores) * 100,
            "bearish_pct": sum(1 for s in raw_scores if s < -0.05) / len(raw_scores) * 100,
            "neutral_pct": sum(1 for s in raw_scores if -0.05 <= s <= 0.05) / len(raw_scores) * 100,
            "aggregate_score": float(aggregate),
            "reddit_count": sum(1 for s in scored if s.source == "reddit"),
            "twitter_count": sum(1 for s in scored if s.source == "twitter"),
        }
        return float(aggregate), scored, stats

    def build_sentiment_timeseries(self, scored_posts: list) -> pd.DataFrame:
        """Saatlik duyarlılık serisi — pandas resample kullanmadan."""
        if not scored_posts:
            return pd.DataFrame(columns=["timestamp", "sentiment", "post_count"])

        records = []
        for sp in scored_posts:
            records.append({
                "timestamp": pd.to_datetime(sp.timestamp),
                "score": sp.raw_score,
                "weight": sp.weight,
            })
        df = pd.DataFrame(records).sort_values("timestamp")

        # Manuel saatlik gruplama (resample kullanmadan)
        df["hour_key"] = df["timestamp"].dt.floor("h")
        rows = []
        for hk, grp in df.groupby("hour_key"):
            tw = grp["weight"].sum()
            sentiment = (grp["score"] * grp["weight"]).sum() / tw if tw > 0 else 0
            rows.append({"timestamp": hk, "sentiment": float(sentiment), "post_count": len(grp)})

        return pd.DataFrame(rows) if rows else pd.DataFrame(columns=["timestamp", "sentiment", "post_count"])
