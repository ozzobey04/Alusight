"""
Borsa Duyarlılık ve Trend Analiz Uygulaması
Ana Streamlit Dashboard
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import time
from datetime import datetime, timedelta
import random

# Çevre değişkenlerini yükle
try:
    from dotenv import load_dotenv
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        load_dotenv(env_path)
    else:
        os.environ.setdefault("DEMO_MODE", "True")
except ImportError:
    os.environ.setdefault("DEMO_MODE", "True")

from data_ingestion import fetch_reddit_posts, fetch_twitter_posts, fetch_price_data
from sentiment_engine import SentimentEngine
from signals import DecisionEngine, batch_evaluate

# ── Sayfa Yapılandırması ─────────────────────────────────────────────────────
st.set_page_config(
    page_title="SentimentPro — Borsa Duyarlılık Analizi",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Özel CSS ────────────────────────────────────────────────────────────────
st.markdown("""
<style>
/* Ana arka plan */
.stApp { background: #0d1117; color: #e6edf3; }

/* Sidebar */
section[data-testid="stSidebar"] {
    background: #161b22;
    border-right: 1px solid #30363d;
}

/* Metrikler */
div[data-testid="metric-container"] {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px;
    padding: 12px;
}

/* Başlıklar */
h1, h2, h3 { color: #e6edf3 !important; }

/* Bull/Bear badge */
.bull-badge {
    background: linear-gradient(135deg, #00ff88, #00cc6a);
    color: #000;
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.85rem;
}
.bear-badge {
    background: linear-gradient(135deg, #ff4444, #cc0000);
    color: #fff;
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.85rem;
}
.neutral-badge {
    background: linear-gradient(135deg, #888, #555);
    color: #fff;
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.85rem;
}

/* Hype anomaly */
.hype-alert {
    background: linear-gradient(135deg, #ff8c00, #ff4500);
    color: #fff;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    animation: pulse 1.5s infinite;
}

/* Kart stili */
.signal-card {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 12px;
    padding: 16px;
    margin: 8px 0;
}

/* Alpha badge */
.alpha-badge {
    background: linear-gradient(135deg, #7928ca, #ff0080);
    color: #fff;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 700;
}

/* Divider */
hr { border-color: #30363d !important; }

/* Tab styling */
.stTabs [data-baseweb="tab-list"] {
    background: #161b22;
    border-radius: 8px;
    padding: 4px;
}
.stTabs [data-baseweb="tab"] {
    color: #8b949e;
}
.stTabs [data-baseweb="tab"][aria-selected="true"] {
    color: #e6edf3;
    background: #21262d;
    border-radius: 6px;
}

/* Progress bar rengi */
.stProgress .st-bo { background: #238636; }
</style>
""", unsafe_allow_html=True)

# ── Yardımcı Fonksiyonlar ────────────────────────────────────────────────────

@st.cache_resource
def get_engines(model_type="vader"):
    sent_engine = SentimentEngine(model_type=model_type)
    dec_engine = DecisionEngine()
    return sent_engine, dec_engine


def signal_badge(signal: str) -> str:
    icons = {"BULL": "🟢 BOĞA", "BEAR": "🔴 AYI", "NEUTRAL": "⚪ NÖTR", "ERROR": "⚠️ HATA"}
    css = {"BULL": "bull-badge", "BEAR": "bear-badge", "NEUTRAL": "neutral-badge"}
    text = icons.get(signal, signal)
    cls = css.get(signal, "neutral-badge")
    return f'<span class="{cls}">{text}</span>'


def score_color(score: float) -> str:
    if score > 20:
        return "#00ff88"
    elif score > 0:
        return "#66ff99"
    elif score > -20:
        return "#ff9966"
    else:
        return "#ff4444"


def format_price(p: float) -> str:
    if p >= 1000:
        return f"${p:,.2f}"
    elif p >= 1:
        return f"${p:.2f}"
    else:
        return f"${p:.4f}"


# ── Grafik Fonksiyonları ─────────────────────────────────────────────────────

def create_heatmap(results: list[dict]) -> go.Figure:
    """Hisse bazlı hibrit skor ısı haritası."""
    if not results:
        return go.Figure()

    tickers = [r["ticker"] for r in results if "error" not in r]
    scores = [r.get("hybrid_score", 0) for r in results if "error" not in r]

    if not tickers:
        return go.Figure()

    # Grid düzeni
    n = len(tickers)
    cols = min(4, n)
    rows = (n + cols - 1) // cols

    score_matrix = np.zeros((rows, cols))
    text_matrix = [["" for _ in range(cols)] for _ in range(rows)]
    hover_matrix = [["" for _ in range(cols)] for _ in range(rows)]

    for i, (t, s) in enumerate(zip(tickers, scores)):
        r, c = divmod(i, cols)
        score_matrix[r][c] = s
        signal = [res for res in results if res.get("ticker") == t]
        sig_text = signal[0].get("signal", "N") if signal else "N"
        sig_icon = {"BULL": "🟢", "BEAR": "🔴", "NEUTRAL": "⚪"}.get(sig_text, "⚪")
        text_matrix[r][c] = f"{t}<br>{sig_icon}<br>{s:+.1f}"
        price_chg = signal[0].get("price_change_pct", 0) if signal else 0
        hover_matrix[r][c] = (
            f"<b>{t}</b><br>Hibrit Skor: {s:+.1f}<br>"
            f"Sinyal: {sig_text}<br>5G Değişim: {price_chg:+.2f}%"
        )

    fig = go.Figure(go.Heatmap(
        z=score_matrix,
        text=text_matrix,
        customdata=hover_matrix,
        hovertemplate="%{customdata}<extra></extra>",
        texttemplate="%{text}",
        colorscale=[
            [0.0, "#ff0000"],
            [0.35, "#cc4400"],
            [0.5, "#333333"],
            [0.65, "#00aa44"],
            [1.0, "#00ff88"],
        ],
        zmid=0,
        zmin=-100,
        zmax=100,
        showscale=True,
        colorbar=dict(
            title=dict(text="Hibrit Skor", font=dict(color="#e6edf3")),
            tickfont=dict(color="#e6edf3"),
        ),
        textfont=dict(color="white", size=12),
    ))

    fig.update_layout(
        title=dict(text="Hisse Duyarlılık Isı Haritası", font=dict(color="#e6edf3", size=16)),
        paper_bgcolor="#0d1117",
        plot_bgcolor="#0d1117",
        height=max(200, rows * 120),
        margin=dict(l=10, r=10, t=50, b=10),
        xaxis=dict(visible=False),
        yaxis=dict(visible=False),
    )
    return fig


def create_price_sentiment_chart(ticker: str, price_df: pd.DataFrame,
                                  sent_df: pd.DataFrame, indicators: dict) -> go.Figure:
    """Fiyat + RSI + MACD + Duyarlılık çok katmanlı grafik."""
    fig = make_subplots(
        rows=4, cols=1,
        shared_xaxes=True,
        row_heights=[0.45, 0.2, 0.2, 0.15],
        vertical_spacing=0.03,
        subplot_titles=("Fiyat + Bollinger Bantları", "RSI", "MACD", "Duyarlılık"),
    )

    if not price_df.empty and "close" in price_df.columns:
        dates = price_df["date"] if "date" in price_df.columns else pd.RangeIndex(len(price_df))

        # Fiyat mumu (basit çizgi)
        fig.add_trace(go.Scatter(
            x=dates, y=price_df["close"],
            line=dict(color="#58a6ff", width=2),
            name="Fiyat", showlegend=True,
        ), row=1, col=1)

        # Bollinger bantları
        close = price_df["close"]
        sma20 = close.rolling(20).mean()
        std20 = close.rolling(20).std()
        fig.add_trace(go.Scatter(
            x=dates, y=sma20 + 2 * std20,
            line=dict(color="#444", width=1, dash="dot"),
            name="BB Üst", showlegend=False,
        ), row=1, col=1)
        fig.add_trace(go.Scatter(
            x=dates, y=sma20 - 2 * std20,
            line=dict(color="#444", width=1, dash="dot"),
            name="BB Alt", fill="tonexty",
            fillcolor="rgba(88,166,255,0.05)",
            showlegend=False,
        ), row=1, col=1)

        # RSI
        rsi_series = indicators.get("rsi_series", [])
        if rsi_series:
            rsi_dates = dates.iloc[-len(rsi_series):] if len(rsi_series) <= len(dates) else dates
            fig.add_trace(go.Scatter(
                x=rsi_dates, y=rsi_series[-len(rsi_dates):],
                line=dict(color="#f78166", width=1.5),
                name="RSI",
            ), row=2, col=1)
            fig.add_hline(y=70, line_dash="dot", line_color="#ff4444", row=2, col=1)
            fig.add_hline(y=30, line_dash="dot", line_color="#00ff88", row=2, col=1)
            fig.add_hline(y=50, line_dash="dot", line_color="#555", row=2, col=1)

        # MACD
        macd_s = indicators.get("macd_series", [])
        signal_s = indicators.get("signal_series", [])
        hist_s = indicators.get("histogram_series", [])
        if macd_s:
            macd_dates = dates.iloc[-len(macd_s):] if len(macd_s) <= len(dates) else dates
            fig.add_trace(go.Scatter(
                x=macd_dates, y=macd_s[-len(macd_dates):],
                line=dict(color="#58a6ff", width=1.5), name="MACD",
            ), row=3, col=1)
            if signal_s:
                fig.add_trace(go.Scatter(
                    x=macd_dates, y=signal_s[-len(macd_dates):],
                    line=dict(color="#f78166", width=1.5), name="Sinyal",
                ), row=3, col=1)
            if hist_s:
                colors = ["#00ff88" if v >= 0 else "#ff4444" for v in hist_s[-len(macd_dates):]]
                fig.add_trace(go.Bar(
                    x=macd_dates, y=hist_s[-len(macd_dates):],
                    marker_color=colors, name="Histogram", opacity=0.7,
                ), row=3, col=1)

    # Duyarlılık zaman serisi
    if sent_df is not None and not sent_df.empty and "sentiment" in sent_df.columns:
        sent_colors = ["#00ff88" if v >= 0 else "#ff4444" for v in sent_df["sentiment"]]
        fig.add_trace(go.Bar(
            x=sent_df["timestamp"], y=sent_df["sentiment"],
            marker_color=sent_colors, name="Duyarlılık", opacity=0.8,
        ), row=4, col=1)
        fig.add_hline(y=0, line_color="#555", row=4, col=1)

    # Layout
    fig.update_layout(
        title=dict(text=f"{ticker} — Teknik + Duyarlılık Analizi",
                   font=dict(color="#e6edf3", size=14)),
        paper_bgcolor="#0d1117",
        plot_bgcolor="#161b22",
        font=dict(color="#8b949e"),
        height=600,
        showlegend=True,
        legend=dict(bgcolor="#161b22", bordercolor="#30363d"),
        margin=dict(l=10, r=10, t=50, b=10),
        hovermode="x unified",
    )
    fig.update_xaxes(gridcolor="#21262d", showgrid=True)
    fig.update_yaxes(gridcolor="#21262d", showgrid=True)
    return fig


def create_lag_chart(lag_result: dict, ticker: str) -> go.Figure:
    """Lag korelasyon grafiği."""
    if not lag_result:
        return go.Figure()

    lags = lag_result.get("lag_range", [])
    corrs = lag_result.get("all_correlations", [])
    best_lag = lag_result.get("best_lag_hours", 0)
    best_corr = lag_result.get("best_correlation", 0)

    if not lags or not corrs:
        return go.Figure()

    colors = ["#00ff88" if c >= 0 else "#ff4444" for c in corrs]

    fig = go.Figure()
    fig.add_trace(go.Bar(
        x=lags, y=corrs,
        marker_color=colors,
        name="Korelasyon",
        hovertemplate="Lag: %{x}s<br>Korelasyon: %{y:.3f}<extra></extra>",
    ))

    # En iyi lag işareti
    fig.add_vline(
        x=best_lag,
        line_dash="dash",
        line_color="#f0b429",
        annotation_text=f"En İyi Lag: {best_lag:+d}s",
        annotation_font_color="#f0b429",
    )
    fig.add_hline(y=0, line_color="#555")

    # Açıklama bölgesi
    fig.add_vrect(x0=1, x1=max(lags) if lags else 48,
                  fillcolor="rgba(0,255,136,0.05)",
                  annotation_text="Duyarlılık Öncü →", annotation_position="top left",
                  line_width=0)
    fig.add_vrect(x0=min(lags) if lags else -48, x1=-1,
                  fillcolor="rgba(255,68,68,0.05)",
                  annotation_text="← Fiyat Öncü", annotation_position="top right",
                  line_width=0)

    fig.update_layout(
        title=dict(text=f"{ticker} — Duyarlılık–Fiyat Zaman Kayması (Lag) Korelasyonu",
                   font=dict(color="#e6edf3", size=14)),
        xaxis_title="Lag (Saat)",
        yaxis_title="Pearson Korelasyon",
        paper_bgcolor="#0d1117",
        plot_bgcolor="#161b22",
        font=dict(color="#8b949e"),
        height=350,
        margin=dict(l=10, r=10, t=50, b=40),
    )
    fig.update_xaxes(gridcolor="#21262d")
    fig.update_yaxes(gridcolor="#21262d", range=[-1, 1])
    return fig


def create_sentiment_distribution(stats: dict, ticker: str) -> go.Figure:
    """Duyarlılık dağılımı donut chart."""
    labels = ["Boğa", "Nötr", "Ayı"]
    values = [
        stats.get("bullish_pct", 33),
        stats.get("neutral_pct", 34),
        stats.get("bearish_pct", 33),
    ]
    colors = ["#00ff88", "#8b949e", "#ff4444"]

    fig = go.Figure(go.Pie(
        labels=labels, values=values,
        hole=0.6,
        marker=dict(colors=colors),
        textinfo="label+percent",
        textfont=dict(color="#e6edf3"),
        hovertemplate="%{label}: %{value:.1f}%<extra></extra>",
    ))

    agg = stats.get("aggregate_score", 0)
    fig.add_annotation(
        text=f"<b>{agg:+.2f}</b><br>Skor",
        x=0.5, y=0.5,
        font=dict(size=18, color=score_color(agg * 100)),
        showarrow=False,
    )

    fig.update_layout(
        title=dict(text=f"{ticker} Duyarlılık Dağılımı", font=dict(color="#e6edf3", size=13)),
        paper_bgcolor="#0d1117",
        font=dict(color="#8b949e"),
        height=280,
        margin=dict(l=10, r=10, t=40, b=10),
        showlegend=False,
    )
    return fig


def create_hype_gauge(hype_score: float, ticker: str) -> go.Figure:
    """Hype metre gauge."""
    val = min(hype_score, 5.0)
    color = "#00ff88" if val < 1.5 else "#f0b429" if val < 2.5 else "#ff4444"

    fig = go.Figure(go.Indicator(
        mode="gauge+number+delta",
        value=val,
        delta={"reference": 1.0, "valueformat": ".2f"},
        title={"text": f"{ticker}<br>Hype Metre", "font": {"color": "#e6edf3", "size": 13}},
        number={"suffix": "x", "font": {"color": color, "size": 28}},
        gauge={
            "axis": {"range": [0, 5], "tickwidth": 1, "tickcolor": "#555",
                     "tickfont": {"color": "#8b949e"}},
            "bar": {"color": color, "thickness": 0.3},
            "bgcolor": "#161b22",
            "borderwidth": 1,
            "bordercolor": "#30363d",
            "steps": [
                {"range": [0, 1.5], "color": "#0d2818"},
                {"range": [1.5, 2.5], "color": "#2d1b00"},
                {"range": [2.5, 5], "color": "#2d0000"},
            ],
            "threshold": {
                "line": {"color": "#ff4444", "width": 3},
                "thickness": 0.75,
                "value": 2.5,
            },
        },
    ))
    fig.update_layout(
        paper_bgcolor="#0d1117",
        height=230,
        margin=dict(l=20, r=20, t=20, b=10),
    )
    return fig


def create_multi_ticker_trend(all_results: list[dict]) -> go.Figure:
    """Tüm hisselerin hibrit skor karşılaştırma çubuğu."""
    valid = [r for r in all_results if "error" not in r]
    if not valid:
        return go.Figure()

    valid.sort(key=lambda r: r.get("hybrid_score", 0), reverse=True)
    tickers = [r["ticker"] for r in valid]
    scores = [r.get("hybrid_score", 0) for r in valid]
    colors = [score_color(s) for s in scores]

    fig = go.Figure(go.Bar(
        x=tickers,
        y=scores,
        marker_color=colors,
        text=[f"{s:+.1f}" for s in scores],
        textposition="outside",
        textfont=dict(color="#e6edf3"),
        hovertemplate="<b>%{x}</b><br>Hibrit Skor: %{y:+.1f}<extra></extra>",
    ))
    fig.add_hline(y=25, line_dash="dot", line_color="#00ff88",
                  annotation_text="Boğa Eşiği", annotation_font_color="#00ff88")
    fig.add_hline(y=-25, line_dash="dot", line_color="#ff4444",
                  annotation_text="Ayı Eşiği", annotation_font_color="#ff4444")
    fig.add_hline(y=0, line_color="#555")

    fig.update_layout(
        title=dict(text="Hibrit Trend Skoru Karşılaştırması", font=dict(color="#e6edf3", size=14)),
        paper_bgcolor="#0d1117",
        plot_bgcolor="#161b22",
        font=dict(color="#8b949e"),
        height=350,
        margin=dict(l=10, r=10, t=50, b=10),
        yaxis=dict(range=[-100, 120], gridcolor="#21262d"),
        xaxis=dict(gridcolor="#21262d"),
    )
    return fig


# ── SIDEBAR ──────────────────────────────────────────────────────────────────

with st.sidebar:
    st.markdown("""
    <div style='text-align:center; padding: 12px 0;'>
        <div style='font-size:2rem;'>📈</div>
        <div style='font-size:1.2rem; font-weight:700; color:#e6edf3;'>SentimentPro</div>
        <div style='font-size:0.75rem; color:#8b949e;'>Borsa Duyarlılık Analizi</div>
    </div>
    """, unsafe_allow_html=True)

    st.divider()

    # Piyasa seçimi
    st.markdown("**Piyasa**")
    market = st.radio("", ["🌍 Global", "🇹🇷 BIST", "🔀 Karma", "🎰 Tümü"],
                      index=3, horizontal=True, label_visibility="collapsed")

    import importlib, data_ingestion as _di
    importlib.reload(_di)
    ALL_TICKERS = list(_di.TICKER_DEMO_PROFILE.keys())
    _profile = _di.TICKER_DEMO_PROFILE
    GLOBAL_TICKERS = [t for t in ALL_TICKERS if _profile[t].get("sector","") not in
                      ["BIST-Banka","BIST-Holding","BIST-Savunma","BIST-Havacılık","BIST-Petrol",
                       "BIST-Demir","BIST-Cam","BIST-Otomotiv","BIST-Perakende","BIST-Telekom",
                       "BIST-Teknoloji","BIST-Yazılım","BIST-GYO","BIST-Çimento","BIST-İnşaat",
                       "BIST-Maden","BIST-Gıda","BIST-Kimya","BIST-Tekstil","BIST-Dayanıklı",
                       "BIST-Petrokimya","BIST-Havalimanı"]]
    BIST_TICKERS   = [t for t in ALL_TICKERS if _profile[t].get("sector","").startswith("BIST")]
    MIXED_TICKERS  = ["TSLA","NVDA","THYAO","ASELS","BTC-USD","EREGL","AAPL","GARAN",
                      "AMD","TUPRS","ETH-USD","FROTO","COIN","LOGO","GME","SOL-USD"]

    if market == "🌍 Global":
        default_tickers = GLOBAL_TICKERS[:20]
    elif market == "🇹🇷 BIST":
        default_tickers = BIST_TICKERS[:20]
    elif market == "🔀 Karma":
        default_tickers = MIXED_TICKERS
    else:  # Tümü
        default_tickers = ALL_TICKERS

    st.markdown("**Hisse Seçimi**")
    selected_tickers = st.multiselect(
        "",
        options=ALL_TICKERS,
        default=default_tickers[:30],
        label_visibility="collapsed",
    )
    if not selected_tickers:
        selected_tickers = default_tickers[:10]

    st.caption(f"Seçili: {len(selected_tickers)} / {len(ALL_TICKERS)} hisse")
    st.divider()

    # NLP Model
    st.markdown("**NLP Modeli**")
    model_type = st.radio("", ["VADER (Hızlı)", "FinBERT (Derin)"],
                          label_visibility="collapsed")
    model_key = "vader" if "VADER" in model_type else "finbert"

    st.divider()

    # Otomatik yenileme
    st.markdown("**Otomatik Yenileme**")
    auto_refresh = st.checkbox("Aktif", value=False)
    refresh_interval = st.slider("Saniye", 30, 300, 60, disabled=not auto_refresh)

    st.divider()

    # Demo modu bilgisi
    demo_mode = os.getenv("DEMO_MODE", "True").lower() == "true"
    if demo_mode:
        st.info("🎮 **Demo Modu Aktif**\nGerçek API bağlantısı yok.\n`.env.example` dosyasını `.env` olarak kopyalayıp API anahtarlarınızı ekleyin.")
    else:
        st.success("🔗 **API Bağlı**")

    st.divider()
    st.caption(f"Son güncelleme: {datetime.now().strftime('%H:%M:%S')}")


# ── ANA İÇERİK ───────────────────────────────────────────────────────────────

# Başlık
st.markdown("""
<div style='padding: 16px 0 8px 0;'>
    <h1 style='margin:0; font-size:1.8rem;'>
        📈 SentimentPro — Borsa Duyarlılık & Trend Analizi
    </h1>
    <p style='color:#8b949e; margin:4px 0 0 0; font-size:0.9rem;'>
        Sosyal medya duyarlılığı + teknik göstergeler → Boğa/Ayı sinyali
    </p>
</div>
""", unsafe_allow_html=True)

st.divider()

# ── Analiz Başlat ────────────────────────────────────────────────────────────
if "results" not in st.session_state:
    st.session_state.results = None
    st.session_state.last_update = None
if "run_analysis" not in st.session_state:
    st.session_state.run_analysis = True  # ilk açılışta otomatik çalış

col_btn1, col_btn2, col_btn3 = st.columns([2, 1, 4])
with col_btn1:
    analyze_btn = st.button("🔍 Analizi Başlat", type="primary", use_container_width=True)
with col_btn2:
    refresh_btn = st.button("🔄 Yenile", use_container_width=True)

if analyze_btn or refresh_btn:
    st.session_state.run_analysis = True
    st.session_state.results = None

if st.session_state.run_analysis or (st.session_state.results is None):
    import importlib, data_ingestion as _di2
    importlib.reload(_di2)
    _profile_data = _di2.TICKER_DEMO_PROFILE
    dec_engine = DecisionEngine()

    with st.spinner(f"🔄 {len(selected_tickers)} hisse analiz ediliyor..."):
        progress_bar = st.progress(0)
        results = []

        for i, ticker in enumerate(selected_tickers):
            progress_bar.progress((i + 1) / len(selected_tickers),
                                   text=f"Analiz ediliyor: {ticker}")
            try:
                # Profil verisini al
                p = _profile_data.get(ticker.upper().replace(".IS",""), {})
                bias        = float(p.get("bias",  0.0))
                rsi         = float(p.get("rsi",   50.0))
                macd_dir    = p.get("macd_dir",    "up" if bias > 0 else "down")
                vol         = float(p.get("vol",   1.0))
                price       = float(p.get("price", 100.0))
                chg         = float(p.get("chg",   0.0))
                hype        = float(p.get("hype",  1.0))
                sector      = p.get("sector", "Other")

                # Duyarlılık yüzdeleri (bias'tan türet)
                bull_pct = max(5,  min(95, 50 + bias * 45))
                bear_pct = max(5,  min(95, 50 - bias * 45))
                neut_pct = max(0,  100 - bull_pct - bear_pct)

                # Gönderi sayısı
                import random as _rand
                rng2 = _rand.Random(hash(ticker))
                base_posts = int(30 * hype)
                post_count = base_posts + rng2.randint(-5, 10)

                # Örnek son gönderiler
                from data_ingestion import _generate_demo_posts
                sample_posts = _generate_demo_posts(ticker, 8)
                recent_comments = [p2["text"] for p2 in sample_posts[:5]]

                # İndikatörler
                import numpy as _np
                rng3 = _np.random.default_rng(hash(ticker) % (2**31))
                macd_val = abs(float(rng3.normal(1.1, 0.3))) * (1 if macd_dir=="up" else -1)
                sig_val  = macd_val - abs(float(rng3.normal(0.25,0.08))) * (1 if macd_dir=="up" else -1)
                hist_val = macd_val - sig_val

                indicators = {
                    "rsi": rsi, "macd": macd_val, "macd_signal": sig_val,
                    "macd_histogram": hist_val, "macd_direction": macd_dir,
                    "macd_crossover": macd_dir=="up" and hist_val > 0.1,
                    "macd_crossunder": macd_dir=="down" and hist_val < -0.1,
                    "bb_upper": price*1.08, "bb_lower": price*0.92, "bb_middle": price,
                    "current_price": price*(1+chg/100), "volume_ratio": vol,
                    "price_change_pct": chg,
                    "rsi_series":   [float(_np.clip(rsi + rng3.normal(0,3), 15, 85)) for _ in range(90)],
                    "macd_series":  [float(macd_val*(0.4+j/150)+rng3.normal(0,0.15)) for j in range(90)],
                    "signal_series":[float(sig_val*(0.4+j/150)+rng3.normal(0,0.12)) for j in range(90)],
                    "histogram_series": [float((macd_val-sig_val)*(0.4+j/150)+rng3.normal(0,0.08)) for j in range(90)],
                }

                # Fiyat verisi
                from data_ingestion import _generate_demo_price_data
                price_df = _generate_demo_price_data(ticker)

                # Duyarlılık zaman serisi (basit)
                import pandas as _pd
                from datetime import datetime as _dt, timedelta as _td
                ts_rows = []
                for h in range(72, 0, -3):
                    sent_val = bias + float(rng3.normal(0, 0.15))
                    ts_rows.append({"timestamp": _dt.now()-_td(hours=h),
                                    "sentiment": float(_np.clip(sent_val,-1,1)),
                                    "post_count": max(1, int(post_count/24))})
                sent_ts = _pd.DataFrame(ts_rows)

                # Sinyal kararı
                signal_result = dec_engine.evaluate(
                    ticker=ticker, sentiment_score=bias,
                    indicators=indicators, post_count=post_count,
                )

                stats = {
                    "bullish_pct": bull_pct, "bearish_pct": bear_pct,
                    "neutral_pct": neut_pct, "aggregate_score": bias,
                    "count": post_count,
                    "reddit_count": int(post_count * 0.6),
                    "twitter_count": int(post_count * 0.4),
                }

                results.append({
                    "ticker": ticker,
                    "sector": sector,
                    "signal": signal_result.signal,
                    "hybrid_score": signal_result.hybrid_score,
                    "sentiment_score": bias,
                    "rsi": rsi,
                    "macd_direction": macd_dir,
                    "current_price": indicators["current_price"],
                    "price_change_pct": chg,
                    "volume_ratio": vol,
                    "hype_score": signal_result.hype_score,
                    "hype_anomaly": signal_result.hype_anomaly,
                    "signal_strength": signal_result.signal_strength,
                    "post_count": post_count,
                    "bull_pct": bull_pct,
                    "bear_pct": bear_pct,
                    "bull_conditions": signal_result.bull_conditions,
                    "bear_conditions": signal_result.bear_conditions,
                    "warnings": signal_result.warnings,
                    "lag_result": signal_result.lag_result,
                    "indicators": indicators,
                    "price_df": price_df,
                    "sent_ts": sent_ts,
                    "stats": stats,
                    "recent_comments": recent_comments,
                })
            except Exception as e:
                results.append({"ticker": ticker, "signal": "ERROR",
                                 "hybrid_score": 0, "error": str(e)})

        progress_bar.empty()
        st.session_state.results = results
        st.session_state.last_update = datetime.now()
        st.session_state.run_analysis = False

results = st.session_state.results or []
valid_results = [r for r in results if "error" not in r]

if not results:
    st.info("⏳ Analiz yükleniyor veya hisse seçin, ardından 'Analizi Başlat'a tıklayın.")
    st.stop()

# Hata olan hisseleri göster
error_results = [r for r in results if "error" in r]
if error_results:
    with st.expander(f"⚠️ {len(error_results)} hisse yüklenemedi", expanded=False):
        for r in error_results:
            st.caption(f"❌ {r['ticker']}: {r.get('error', 'Bilinmeyen hata')}")

# ── Özet Metrikler ───────────────────────────────────────────────────────────
st.markdown("### Genel Bakış")

bull_count = sum(1 for r in valid_results if r.get("signal") == "BULL")
bear_count = sum(1 for r in valid_results if r.get("signal") == "BEAR")
neutral_count = sum(1 for r in valid_results if r.get("signal") == "NEUTRAL")
hype_count = sum(1 for r in valid_results if r.get("hype_anomaly"))
avg_hybrid = np.mean([r.get("hybrid_score", 0) for r in valid_results]) if valid_results else 0
total_posts = sum(r.get("post_count", 0) for r in valid_results)

mc1, mc2, mc3, mc4, mc5, mc6 = st.columns(6)
mc1.metric("🟢 Boğa Sinyali", f"{bull_count}", f"/{len(valid_results)} hisse")
mc2.metric("🔴 Ayı Sinyali", f"{bear_count}", f"/{len(valid_results)} hisse")
mc3.metric("⚪ Nötr", f"{neutral_count}", f"/{len(valid_results)} hisse")
mc4.metric("🌡️ Ort. Hibrit Skor", f"{avg_hybrid:+.1f}", "(-100..+100)")
mc5.metric("🔥 Hype Anomalisi", f"{hype_count}", "hisse")
mc6.metric("💬 Toplam Gönderi", f"{total_posts:,}", "Reddit + X")

st.divider()

# ── Piyasa Durumu Banner ─────────────────────────────────────────────────────
if avg_hybrid > 20:
    st.markdown(
        '<div style="background:linear-gradient(135deg,#003d1a,#006633);'
        'border:1px solid #00ff88;border-radius:10px;padding:12px 20px;margin-bottom:16px;">'
        '<span style="font-size:1.1rem;font-weight:700;color:#00ff88;">🚀 GENEL PIYASA DURUMU: BOĞA</span>'
        f'<span style="color:#8b949e;margin-left:16px;">Ortalama Hibrit Skor: {avg_hybrid:+.1f}</span>'
        '</div>', unsafe_allow_html=True
    )
elif avg_hybrid < -20:
    st.markdown(
        '<div style="background:linear-gradient(135deg,#3d0000,#660000);'
        'border:1px solid #ff4444;border-radius:10px;padding:12px 20px;margin-bottom:16px;">'
        '<span style="font-size:1.1rem;font-weight:700;color:#ff4444;">🐻 GENEL PIYASA DURUMU: AYI</span>'
        f'<span style="color:#8b949e;margin-left:16px;">Ortalama Hibrit Skor: {avg_hybrid:+.1f}</span>'
        '</div>', unsafe_allow_html=True
    )
else:
    st.markdown(
        '<div style="background:linear-gradient(135deg,#1a1a1a,#2d2d2d);'
        'border:1px solid #555;border-radius:10px;padding:12px 20px;margin-bottom:16px;">'
        '<span style="font-size:1.1rem;font-weight:700;color:#aaa;">⚖️ GENEL PIYASA DURUMU: NÖTR</span>'
        f'<span style="color:#8b949e;margin-left:16px;">Ortalama Hibrit Skor: {avg_hybrid:+.1f}</span>'
        '</div>', unsafe_allow_html=True
    )

# ── Sekmeler ─────────────────────────────────────────────────────────────────
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "🗺️ Isı Haritası",
    "📊 Hibrit Skor",
    "🔍 Hisse Detay",
    "⏱️ Lag Analizi",
    "📋 Boğa/Ayı Listesi",
])

# ── Tab 1: Isı Haritası ───────────────────────────────────────────────────────
with tab1:
    st.markdown("#### Duyarlılık Isı Haritası — Tüm Hisseler")
    st.plotly_chart(create_heatmap(valid_results), use_container_width=True, key="heatmap_main")

    # Mini metrik grid
    st.markdown("#### Hisse Özet Tablosu")
    summary_data = []
    for r in valid_results:
        sig = r.get("signal", "-")
        sig_icon = {"BULL": "🟢 BOĞA", "BEAR": "🔴 AYI", "NEUTRAL": "⚪ NÖTR"}.get(sig, sig)
        summary_data.append({
            "Hisse": r["ticker"],
            "Sinyal": sig_icon,
            "Hibrit Skor": round(r.get("hybrid_score", 0), 1),
            "Duyarlılık": round(r.get("sentiment_score", 0), 3),
            "RSI": round(r.get("rsi", 0), 1),
            "MACD": r.get("macd_direction", "-").upper(),
            "Hacim": round(r.get("volume_ratio", 1), 2),
            "5G Değ. %": round(r.get("price_change_pct", 0), 2),
            "Boğa %": round(r.get("bull_pct", 0), 1),
            "Nötr %": round(r.get("stats", {}).get("neutral_pct", 0), 1),
            "Ayı %": round(r.get("bear_pct", 0), 1),
            "Gönderi": r.get("post_count", 0),
            "Hype": round(r.get("hype_score", 1), 2),
        })
    df_summary = pd.DataFrame(summary_data)
    st.dataframe(
        df_summary,
        use_container_width=True,
        height=min(500, 60 + len(summary_data) * 38),
        column_config={
            "Sinyal": st.column_config.TextColumn("Sinyal", width="medium"),
            "Hibrit Skor": st.column_config.NumberColumn("Hibrit Skor", format="%+.1f", min_value=-100, max_value=100),
            "Duyarlılık": st.column_config.NumberColumn("Duyarlılık", format="%.3f"),
            "RSI": st.column_config.ProgressColumn("RSI", min_value=0, max_value=100, format="%.1f"),
            "Boğa %": st.column_config.ProgressColumn("Boğa %", min_value=0, max_value=100, format="%.1f%%"),
            "Ayı %": st.column_config.ProgressColumn("Ayı %", min_value=0, max_value=100, format="%.1f%%"),
            "Hype": st.column_config.NumberColumn("Hype 🌡️", format="%.2fx"),
            "5G Değ. %": st.column_config.NumberColumn("5G Değ. %", format="%+.2f%%"),
        },
    )


# ── Tab 2: Hibrit Skor Karşılaştırması ───────────────────────────────────────
with tab2:
    st.markdown("#### Hibrit Trend Skoru — Tüm Hisseler Karşılaştırması")
    st.plotly_chart(create_multi_ticker_trend(valid_results), use_container_width=True, key="trend_bar")

    # Hype metre grid
    st.markdown("#### 🌡️ Hype Metre — Anomalik Hacim Göstergesi")
    hype_cols = st.columns(max(1, min(6, len(valid_results))))
    for i, r in enumerate(valid_results[:6]):
        with hype_cols[i % 6]:
            st.plotly_chart(
                create_hype_gauge(r.get("hype_score", 1), r["ticker"]),
                use_container_width=True,
                key=f"hype_gauge_{r['ticker']}",
            )


# ── Tab 3: Hisse Detay ────────────────────────────────────────────────────────
with tab3:
    selected_detail = st.selectbox(
        "Detaylı analiz için hisse seçin:",
        options=[r["ticker"] for r in valid_results],
    )

    detail = next((r for r in valid_results if r["ticker"] == selected_detail), None)
    if detail:
        # Üst bilgiler
        d_col1, d_col2, d_col3, d_col4 = st.columns(4)
        with d_col1:
            st.markdown(f"**Sinyal:** {signal_badge(detail.get('signal', 'NEUTRAL'))}",
                        unsafe_allow_html=True)
            st.metric("Hibrit Skor", f"{detail.get('hybrid_score', 0):+.1f}")
        with d_col2:
            st.metric("Duyarlılık Skoru", f"{detail.get('sentiment_score', 0):+.3f}")
            st.metric("Gönderi Sayısı", detail.get("post_count", 0))
        with d_col3:
            st.metric("RSI", f"{detail.get('rsi', 0):.1f}")
            st.metric("MACD Yönü", detail.get("macd_direction", "-").upper())
        with d_col4:
            st.metric("Fiyat Değişimi", f"{detail.get('price_change_pct', 0):+.2f}%")
            st.metric("Hacim Oranı", f"{detail.get('volume_ratio', 1):.2f}x")

        # Uyarılar
        warnings = detail.get("warnings", [])
        if warnings:
            for w in warnings:
                st.warning(f"⚠️ {w}")

        # Hype anomali
        if detail.get("hype_anomaly"):
            st.markdown(
                f'<div class="hype-alert">🔥 HYPE ANOMALİSİ! '
                f'Konuşma hacmi normalin {detail.get("hype_score", 1):.1f}x üstünde!</div>',
                unsafe_allow_html=True
            )

        st.divider()

        # Ana grafik
        st.plotly_chart(
            create_price_sentiment_chart(
                selected_detail,
                detail.get("price_df", pd.DataFrame()),
                detail.get("sent_ts", pd.DataFrame()),
                detail.get("indicators", {}),
            ),
            use_container_width=True,
            key=f"detail_chart_{selected_detail}",
        )

        # Duyarlılık dağılımı + sinyal detayları
        sc1, sc2 = st.columns(2)
        with sc1:
            st.plotly_chart(
                create_sentiment_distribution(detail.get("stats", {}), selected_detail),
                use_container_width=True,
                key=f"sent_dist_{selected_detail}",
            )
        with sc2:
            st.markdown("**Sinyal Koşulları**")
            bull_cond = detail.get("bull_conditions", [])
            bear_cond = detail.get("bear_conditions", [])
            if bull_cond:
                st.markdown("🟢 **Boğa Göstergeleri:**")
                for c in bull_cond:
                    st.markdown(f"  ✅ {c}")
            if bear_cond:
                st.markdown("🔴 **Ayı Göstergeleri:**")
                for c in bear_cond:
                    st.markdown(f"  ❌ {c}")
            if not bull_cond and not bear_cond:
                st.markdown("⚪ Belirgin sinyal yok.")

            # Sinyal güven çubuğu
            strength = detail.get("signal_strength", 0)
            st.markdown(f"**Sinyal Güveni:** {strength * 100:.0f}%")
            st.progress(strength)


# ── Tab 4: Lag Analizi ────────────────────────────────────────────────────────
with tab4:
    st.markdown("### ⏱️ Zaman Kayması (Lag) Analizi")
    st.markdown(
        "_Duyarlılık mı fiyatı önceden tahmin ediyor? "
        "Yoksa fiyat hareketi mi duyarlılığı tetikliyor?_"
    )

    lag_ticker = st.selectbox(
        "Lag analizi için hisse:",
        options=[r["ticker"] for r in valid_results],
        key="lag_select",
    )
    lag_detail = next((r for r in valid_results if r["ticker"] == lag_ticker), None)

    if lag_detail and lag_detail.get("lag_result"):
        lr = lag_detail["lag_result"]

        lag_m1, lag_m2, lag_m3 = st.columns(3)
        best_lag = lr.get("best_lag_hours", 0)
        best_corr = lr.get("best_correlation", 0)
        is_alpha = lr.get("alpha_opportunity", False)

        lag_m1.metric(
            "En İyi Lag",
            f"{best_lag:+d} saat",
            "Duyarlılık Öncü" if best_lag > 0 else "Fiyat Öncü",
        )
        lag_m2.metric("Korelasyon", f"{best_corr:.3f}")
        lag_m3.markdown("**Alpha Fırsatı:**")
        if is_alpha:
            lag_m3.markdown(
                '<span class="alpha-badge">✨ ALPHA FIRSATI</span>',
                unsafe_allow_html=True,
            )
        else:
            lag_m3.markdown("Güçlü sinyal yok")

        # Yorum
        st.info(f"📊 **Yorum:** {lr.get('interpretation', '-')}")

        if best_lag > 3 and abs(best_corr) > 0.4:
            st.success(
                f"💡 **Strateji:** {lag_ticker} için duyarlılık verisi "
                f"{best_lag} saat önceden fiyat yönünü tahmin ediyor. "
                f"Bu pencerede pozisyon almak alpha üretebilir!"
            )

        st.plotly_chart(create_lag_chart(lr, lag_ticker), use_container_width=True, key=f"lag_chart_{lag_ticker}")

        # Tüm hisselerin lag özeti
        st.markdown("#### Tüm Hisselerin Lag Özeti")
        lag_summary = []
        for r in valid_results:
            if r.get("lag_result"):
                lr2 = r["lag_result"]
                lag_summary.append({
                    "Hisse": r["ticker"],
                    "En İyi Lag (saat)": lr2.get("best_lag_hours", 0),
                    "Korelasyon": f"{lr2.get('best_correlation', 0):.3f}",
                    "Yön": "Duyarlılık Öncü 🎯" if lr2.get("best_lag_hours", 0) > 2
                           else "Fiyat Öncü 📉" if lr2.get("best_lag_hours", 0) < -2
                           else "Eş Zamanlı",
                    "Alpha?": "✨ Evet" if lr2.get("alpha_opportunity") else "Hayır",
                })
        if lag_summary:
            st.dataframe(pd.DataFrame(lag_summary), use_container_width=True)
    else:
        st.info("Lag verisi yükleniyor... Lütfen analizi başlatın.")


# ── Tab 5: Boğa/Ayı Listesi ──────────────────────────────────────────────────
with tab5:
    bull_results = sorted(
        [r for r in valid_results if r.get("signal") == "BULL"],
        key=lambda x: x.get("hybrid_score", 0), reverse=True
    )
    bear_results = sorted(
        [r for r in valid_results if r.get("signal") == "BEAR"],
        key=lambda x: x.get("hybrid_score", 0)
    )
    neutral_results = [r for r in valid_results if r.get("signal") == "NEUTRAL"]

    bl1, bl2 = st.columns(2)

    with bl1:
        st.markdown(f"### 🟢 Boğa Listesi ({len(bull_results)} hisse)")
        if bull_results:
            for r in bull_results:
                with st.container():
                    bc1, bc2, bc3 = st.columns([2, 2, 2])
                    bc1.markdown(f"**{r['ticker']}**")
                    bc2.markdown(f"Skor: `{r.get('hybrid_score', 0):+.1f}`")
                    bc3.markdown(f"RSI: `{r.get('rsi', 0):.1f}`")

                    conditions = r.get("bull_conditions", [])
                    if conditions:
                        st.caption(" • ".join(conditions[:3]))
                    st.divider()
        else:
            st.markdown("_Boğa sinyali veren hisse yok._")

    with bl2:
        st.markdown(f"### 🔴 Ayı Listesi ({len(bear_results)} hisse)")
        if bear_results:
            for r in bear_results:
                with st.container():
                    bc1, bc2, bc3 = st.columns([2, 2, 2])
                    bc1.markdown(f"**{r['ticker']}**")
                    bc2.markdown(f"Skor: `{r.get('hybrid_score', 0):+.1f}`")
                    bc3.markdown(f"RSI: `{r.get('rsi', 0):.1f}`")

                    conditions = r.get("bear_conditions", [])
                    if conditions:
                        st.caption(" • ".join(conditions[:3]))
                    st.divider()
        else:
            st.markdown("_Ayı sinyali veren hisse yok._")

    # Nötr ve hype
    if neutral_results:
        st.markdown(f"### ⚪ Nötr Hisseler ({len(neutral_results)} hisse)")
        neu_cols = st.columns(min(4, len(neutral_results)))
        for i, r in enumerate(neutral_results):
            with neu_cols[i % 4]:
                st.metric(r["ticker"], f"{r.get('hybrid_score', 0):+.1f}",
                          f"RSI {r.get('rsi', 0):.1f}")

    # Hype anomalileri
    hype_list = [r for r in valid_results if r.get("hype_anomaly")]
    if hype_list:
        st.divider()
        st.markdown("### 🔥 Hype Anomalisi Tespit Edilenler")
        for r in hype_list:
            st.markdown(
                f'<div class="hype-alert">🔥 <b>{r["ticker"]}</b> — '
                f'Konuşma hacmi normalin {r.get("hype_score", 1):.1f}x üstünde! '
                f'Sinyal: {r.get("signal")}</div>',
                unsafe_allow_html=True,
            )

# ── Otomatik yenileme ────────────────────────────────────────────────────────
if auto_refresh:
    time.sleep(refresh_interval)
    st.rerun()

# Alt bilgi
st.divider()
st.caption(
    "⚠️ Bu uygulama yatırım tavsiyesi değildir. Tüm sinyaller bilgi amaçlıdır. "
    "Demo modunda veriler simüle edilmektedir. | SentimentPro v1.0"
)
