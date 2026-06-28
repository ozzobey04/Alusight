"""
Veri Çekme Katmanı — Tam Demo Modu
100+ hisse için sabit profil, gerçekçi sahte sosyal medya yorumları
"""

import os
import random
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

# ── 100+ Hisse Demo Profil Tablosu ───────────────────────────────────────────
# bias: -1..+1 (duyarlılık eğilimi), hype: 1..5, rsi: 20..80
# macd_dir: up/down, vol: hacim çarpanı, price: USD/TRY, chg: 5G % değişim

TICKER_DEMO_PROFILE = {
    # ── GLOBAL TECH ──
    "NVDA":  {"bias": 0.88, "hype": 4.8, "rsi": 68, "macd_dir": "up",   "vol": 3.2, "price": 875.2,  "chg": +6.1,  "sector": "Tech"},
    "TSLA":  {"bias": 0.72, "hype": 4.5, "rsi": 62, "macd_dir": "up",   "vol": 2.8, "price": 185.4,  "chg": +4.3,  "sector": "EV"},
    "AAPL":  {"bias": 0.48, "hype": 2.1, "rsi": 54, "macd_dir": "up",   "vol": 1.4, "price": 189.3,  "chg": +1.2,  "sector": "Tech"},
    "MSFT":  {"bias": 0.55, "hype": 1.8, "rsi": 57, "macd_dir": "up",   "vol": 1.3, "price": 415.7,  "chg": +1.8,  "sector": "Tech"},
    "META":  {"bias": 0.62, "hype": 2.4, "rsi": 59, "macd_dir": "up",   "vol": 1.7, "price": 502.1,  "chg": +3.1,  "sector": "Tech"},
    "GOOGL": {"bias": 0.41, "hype": 1.5, "rsi": 51, "macd_dir": "up",   "vol": 1.1, "price": 172.4,  "chg": +0.9,  "sector": "Tech"},
    "AMZN":  {"bias": 0.33, "hype": 1.6, "rsi": 48, "macd_dir": "down", "vol": 1.0, "price": 185.6,  "chg": -0.7,  "sector": "Tech"},
    "AMD":   {"bias": 0.75, "hype": 3.1, "rsi": 65, "macd_dir": "up",   "vol": 2.5, "price": 162.3,  "chg": +5.4,  "sector": "Tech"},
    "INTC":  {"bias": -0.45,"hype": 1.9, "rsi": 71, "macd_dir": "down", "vol": 1.2, "price": 31.8,   "chg": -3.8,  "sector": "Tech"},
    "ORCL":  {"bias": 0.38, "hype": 1.3, "rsi": 52, "macd_dir": "up",   "vol": 1.0, "price": 128.5,  "chg": +1.1,  "sector": "Tech"},
    "CSCO":  {"bias": 0.22, "hype": 1.1, "rsi": 46, "macd_dir": "up",   "vol": 0.9, "price": 48.2,   "chg": +0.4,  "sector": "Tech"},
    "IBM":   {"bias": -0.18,"hype": 1.0, "rsi": 55, "macd_dir": "down", "vol": 0.8, "price": 185.9,  "chg": -0.9,  "sector": "Tech"},
    "NFLX":  {"bias": 0.51, "hype": 2.2, "rsi": 58, "macd_dir": "up",   "vol": 1.6, "price": 628.4,  "chg": +2.7,  "sector": "Media"},
    "SPOT":  {"bias": 0.44, "hype": 1.8, "rsi": 53, "macd_dir": "up",   "vol": 1.3, "price": 298.7,  "chg": +1.9,  "sector": "Media"},
    "CRM":   {"bias": 0.35, "hype": 1.4, "rsi": 49, "macd_dir": "up",   "vol": 1.1, "price": 285.3,  "chg": +0.8,  "sector": "Tech"},
    "SHOP":  {"bias": 0.58, "hype": 2.0, "rsi": 56, "macd_dir": "up",   "vol": 1.5, "price": 78.4,   "chg": +2.3,  "sector": "Tech"},
    "SNOW":  {"bias": -0.28,"hype": 1.6, "rsi": 68, "macd_dir": "down", "vol": 1.2, "price": 142.1,  "chg": -2.1,  "sector": "Tech"},
    "PLTR":  {"bias": 0.69, "hype": 3.8, "rsi": 63, "macd_dir": "up",   "vol": 2.9, "price": 22.8,   "chg": +4.6,  "sector": "Tech"},
    "UBER":  {"bias": 0.42, "hype": 1.7, "rsi": 51, "macd_dir": "up",   "vol": 1.2, "price": 74.5,   "chg": +1.3,  "sector": "Tech"},
    "LYFT":  {"bias": -0.35,"hype": 1.4, "rsi": 66, "macd_dir": "down", "vol": 1.1, "price": 12.8,   "chg": -2.8,  "sector": "Tech"},
    # ── FINANS ──
    "JPM":   {"bias": 0.45, "hype": 1.5, "rsi": 53, "macd_dir": "up",   "vol": 1.2, "price": 198.4,  "chg": +1.6,  "sector": "Finance"},
    "BAC":   {"bias": 0.31, "hype": 1.3, "rsi": 48, "macd_dir": "up",   "vol": 1.0, "price": 36.2,   "chg": +0.7,  "sector": "Finance"},
    "GS":    {"bias": 0.39, "hype": 1.4, "rsi": 50, "macd_dir": "up",   "vol": 1.1, "price": 468.3,  "chg": +1.2,  "sector": "Finance"},
    "MS":    {"bias": 0.28, "hype": 1.2, "rsi": 47, "macd_dir": "up",   "vol": 0.9, "price": 98.7,   "chg": +0.5,  "sector": "Finance"},
    "V":     {"bias": 0.52, "hype": 1.3, "rsi": 55, "macd_dir": "up",   "vol": 1.1, "price": 278.5,  "chg": +1.4,  "sector": "Finance"},
    "MA":    {"bias": 0.49, "hype": 1.3, "rsi": 54, "macd_dir": "up",   "vol": 1.0, "price": 468.2,  "chg": +1.3,  "sector": "Finance"},
    "PYPL":  {"bias": -0.42,"hype": 1.8, "rsi": 72, "macd_dir": "down", "vol": 1.4, "price": 62.1,   "chg": -3.2,  "sector": "Finance"},
    "SQ":    {"bias": 0.61, "hype": 2.5, "rsi": 60, "macd_dir": "up",   "vol": 1.8, "price": 68.4,   "chg": +3.5,  "sector": "Finance"},
    # ── ENERJİ ──
    "XOM":   {"bias": 0.29, "hype": 1.2, "rsi": 48, "macd_dir": "up",   "vol": 1.0, "price": 112.4,  "chg": +0.6,  "sector": "Energy"},
    "CVX":   {"bias": 0.21, "hype": 1.1, "rsi": 45, "macd_dir": "up",   "vol": 0.9, "price": 156.8,  "chg": +0.3,  "sector": "Energy"},
    "OXY":   {"bias": 0.36, "hype": 1.4, "rsi": 51, "macd_dir": "up",   "vol": 1.1, "price": 62.3,   "chg": +1.1,  "sector": "Energy"},
    "NEE":   {"bias": -0.22,"hype": 1.0, "rsi": 58, "macd_dir": "down", "vol": 0.8, "price": 68.9,   "chg": -0.8,  "sector": "Energy"},
    # ── KRİPTO ──
    "BTC-USD":{"bias": 0.81,"hype": 5.0, "rsi": 66, "macd_dir": "up",   "vol": 4.2, "price": 68420,  "chg": +5.8,  "sector": "Crypto"},
    "ETH-USD":{"bias": 0.68,"hype": 3.8, "rsi": 61, "macd_dir": "up",   "vol": 3.1, "price": 3650,   "chg": +4.2,  "sector": "Crypto"},
    "SOL-USD":{"bias": 0.74,"hype": 4.1, "rsi": 64, "macd_dir": "up",   "vol": 3.5, "price": 172.4,  "chg": +6.3,  "sector": "Crypto"},
    "BNB-USD":{"bias": 0.55,"hype": 2.8, "rsi": 58, "macd_dir": "up",   "vol": 2.2, "price": 598.3,  "chg": +2.9,  "sector": "Crypto"},
    "XRP-USD":{"bias": 0.62,"hype": 3.4, "rsi": 60, "macd_dir": "up",   "vol": 2.8, "price": 0.58,   "chg": +3.7,  "sector": "Crypto"},
    "DOGE-USD":{"bias":0.78,"hype": 4.6, "rsi": 67, "macd_dir": "up",   "vol": 3.8, "price": 0.142,  "chg": +7.2,  "sector": "Crypto"},
    "ADA-USD":{"bias": 0.44,"hype": 2.3, "rsi": 54, "macd_dir": "up",   "vol": 1.9, "price": 0.48,   "chg": +1.8,  "sector": "Crypto"},
    "AVAX-USD":{"bias":0.58,"hype": 2.9, "rsi": 57, "macd_dir": "up",   "vol": 2.3, "price": 38.4,   "chg": +3.1,  "sector": "Crypto"},
    # ── ETF / ENDİKS ──
    "SPY":   {"bias": 0.32, "hype": 1.6, "rsi": 54, "macd_dir": "up",   "vol": 1.2, "price": 521.3,  "chg": +0.8,  "sector": "ETF"},
    "QQQ":   {"bias": 0.51, "hype": 1.9, "rsi": 57, "macd_dir": "up",   "vol": 1.4, "price": 446.2,  "chg": +1.5,  "sector": "ETF"},
    "IWM":   {"bias": -0.15,"hype": 1.2, "rsi": 49, "macd_dir": "down", "vol": 0.9, "price": 198.4,  "chg": -0.4,  "sector": "ETF"},
    "VIX":   {"bias": -0.68,"hype": 2.8, "rsi": 72, "macd_dir": "up",   "vol": 2.1, "price": 18.4,   "chg": +8.2,  "sector": "ETF"},
    # ── BIST100 ──
    "THYAO": {"bias": 0.71, "hype": 3.2, "rsi": 59, "macd_dir": "up",   "vol": 2.1, "price": 328.5,  "chg": +3.4,  "sector": "BIST-Havacılık"},
    "ASELS": {"bias": 0.82, "hype": 3.5, "rsi": 65, "macd_dir": "up",   "vol": 2.4, "price": 87.4,   "chg": +4.8,  "sector": "BIST-Savunma"},
    "EREGL": {"bias": -0.48,"hype": 1.8, "rsi": 73, "macd_dir": "down", "vol": 0.8, "price": 52.1,   "chg": -2.9,  "sector": "BIST-Demir"},
    "SISE":  {"bias": 0.19, "hype": 1.2, "rsi": 44, "macd_dir": "down", "vol": 0.7, "price": 38.9,   "chg": -0.6,  "sector": "BIST-Cam"},
    "TUPRS": {"bias": -0.58,"hype": 2.1, "rsi": 76, "macd_dir": "down", "vol": 1.4, "price": 185.3,  "chg": -4.1,  "sector": "BIST-Petrol"},
    "KCHOL": {"bias": 0.38, "hype": 1.4, "rsi": 50, "macd_dir": "up",   "vol": 1.1, "price": 142.6,  "chg": +0.9,  "sector": "BIST-Holding"},
    "BIMAS": {"bias": -0.31,"hype": 1.3, "rsi": 67, "macd_dir": "down", "vol": 0.9, "price": 452.0,  "chg": -1.8,  "sector": "BIST-Perakende"},
    "GARAN": {"bias": 0.54, "hype": 1.9, "rsi": 54, "macd_dir": "up",   "vol": 1.5, "price": 78.5,   "chg": +2.2,  "sector": "BIST-Banka"},
    "AKBNK": {"bias": 0.47, "hype": 1.7, "rsi": 52, "macd_dir": "up",   "vol": 1.3, "price": 62.4,   "chg": +1.7,  "sector": "BIST-Banka"},
    "YKBNK": {"bias": 0.42, "hype": 1.5, "rsi": 50, "macd_dir": "up",   "vol": 1.2, "price": 28.9,   "chg": +1.4,  "sector": "BIST-Banka"},
    "HALKB": {"bias": -0.22,"hype": 1.3, "rsi": 62, "macd_dir": "down", "vol": 0.9, "price": 18.4,   "chg": -1.2,  "sector": "BIST-Banka"},
    "VAKBN": {"bias": 0.28, "hype": 1.4, "rsi": 48, "macd_dir": "up",   "vol": 1.1, "price": 22.8,   "chg": +0.8,  "sector": "BIST-Banka"},
    "ISCTR": {"bias": 0.35, "hype": 1.5, "rsi": 49, "macd_dir": "up",   "vol": 1.2, "price": 32.1,   "chg": +1.1,  "sector": "BIST-Banka"},
    "TCELL": {"bias": 0.44, "hype": 1.6, "rsi": 51, "macd_dir": "up",   "vol": 1.3, "price": 98.7,   "chg": +1.5,  "sector": "BIST-Telekom"},
    "TTKOM": {"bias": 0.31, "hype": 1.2, "rsi": 47, "macd_dir": "up",   "vol": 1.0, "price": 28.4,   "chg": +0.7,  "sector": "BIST-Telekom"},
    "FROTO": {"bias": 0.62, "hype": 2.2, "rsi": 58, "macd_dir": "up",   "vol": 1.6, "price": 1420.5, "chg": +2.8,  "sector": "BIST-Otomotiv"},
    "TOASO": {"bias": 0.51, "hype": 1.8, "rsi": 54, "macd_dir": "up",   "vol": 1.4, "price": 452.8,  "chg": +1.9,  "sector": "BIST-Otomotiv"},
    "ARCLK": {"bias": -0.38,"hype": 1.5, "rsi": 69, "macd_dir": "down", "vol": 1.0, "price": 98.4,   "chg": -2.4,  "sector": "BIST-Dayanıklı"},
    "KOZAL": {"bias": 0.67, "hype": 2.8, "rsi": 61, "macd_dir": "up",   "vol": 1.9, "price": 198.4,  "chg": +3.6,  "sector": "BIST-Maden"},
    "MGROS": {"bias": 0.24, "hype": 1.2, "rsi": 46, "macd_dir": "up",   "vol": 0.9, "price": 248.6,  "chg": +0.5,  "sector": "BIST-Perakende"},
    "SAHOL": {"bias": 0.29, "hype": 1.3, "rsi": 47, "macd_dir": "up",   "vol": 1.0, "price": 96.2,   "chg": +0.6,  "sector": "BIST-Holding"},
    "PGSUS": {"bias": 0.58, "hype": 2.1, "rsi": 56, "macd_dir": "up",   "vol": 1.5, "price": 892.4,  "chg": +2.6,  "sector": "BIST-Havacılık"},
    "TAVHL": {"bias": 0.45, "hype": 1.6, "rsi": 52, "macd_dir": "up",   "vol": 1.2, "price": 148.3,  "chg": +1.4,  "sector": "BIST-Havalimanı"},
    "PETKM": {"bias": -0.41,"hype": 1.4, "rsi": 70, "macd_dir": "down", "vol": 1.0, "price": 28.6,   "chg": -2.1,  "sector": "BIST-Petrokimya"},
    "AGHOL": {"bias": 0.33, "hype": 1.3, "rsi": 49, "macd_dir": "up",   "vol": 1.0, "price": 124.5,  "chg": +0.9,  "sector": "BIST-Holding"},
    "DOHOL": {"bias": -0.19,"hype": 1.1, "rsi": 56, "macd_dir": "down", "vol": 0.8, "price": 18.9,   "chg": -0.6,  "sector": "BIST-Holding"},
    "EKGYO": {"bias": 0.41, "hype": 1.5, "rsi": 50, "macd_dir": "up",   "vol": 1.2, "price": 48.2,   "chg": +1.2,  "sector": "BIST-GYO"},
    "ISGYO": {"bias": 0.28, "hype": 1.2, "rsi": 47, "macd_dir": "up",   "vol": 0.9, "price": 22.4,   "chg": +0.5,  "sector": "BIST-GYO"},
    "CIMSA": {"bias": 0.35, "hype": 1.3, "rsi": 49, "macd_dir": "up",   "vol": 1.0, "price": 128.4,  "chg": +0.8,  "sector": "BIST-Çimento"},
    "AKCNS": {"bias": 0.31, "hype": 1.2, "rsi": 48, "macd_dir": "up",   "vol": 0.9, "price": 98.6,   "chg": +0.7,  "sector": "BIST-Çimento"},
    "ENKAI": {"bias": 0.48, "hype": 1.6, "rsi": 52, "macd_dir": "up",   "vol": 1.2, "price": 42.8,   "chg": +1.4,  "sector": "BIST-İnşaat"},
    "SOKM":  {"bias": -0.26,"hype": 1.3, "rsi": 64, "macd_dir": "down", "vol": 0.9, "price": 68.4,   "chg": -1.4,  "sector": "BIST-Perakende"},
    "LOGO":  {"bias": 0.72, "hype": 2.6, "rsi": 62, "macd_dir": "up",   "vol": 1.8, "price": 198.4,  "chg": +3.8,  "sector": "BIST-Yazılım"},
    "NETAS": {"bias": 0.64, "hype": 2.2, "rsi": 59, "macd_dir": "up",   "vol": 1.6, "price": 82.4,   "chg": +3.1,  "sector": "BIST-Telekom"},
    "KAREL": {"bias": 0.55, "hype": 1.9, "rsi": 56, "macd_dir": "up",   "vol": 1.4, "price": 124.8,  "chg": +2.2,  "sector": "BIST-Teknoloji"},
    "INDES": {"bias": 0.48, "hype": 1.7, "rsi": 53, "macd_dir": "up",   "vol": 1.3, "price": 68.2,   "chg": +1.6,  "sector": "BIST-Teknoloji"},
    "VESTL": {"bias": -0.33,"hype": 1.4, "rsi": 67, "macd_dir": "down", "vol": 0.9, "price": 38.4,   "chg": -1.9,  "sector": "BIST-Dayanıklı"},
    "ULKER": {"bias": 0.18, "hype": 1.1, "rsi": 44, "macd_dir": "up",   "vol": 0.8, "price": 128.5,  "chg": +0.3,  "sector": "BIST-Gıda"},
    "TATGD": {"bias": 0.22, "hype": 1.1, "rsi": 45, "macd_dir": "up",   "vol": 0.8, "price": 48.9,   "chg": +0.4,  "sector": "BIST-Gıda"},
    "AEFES": {"bias": 0.28, "hype": 1.2, "rsi": 47, "macd_dir": "up",   "vol": 0.9, "price": 342.8,  "chg": +0.6,  "sector": "BIST-Gıda"},
    "BRISA": {"bias": 0.41, "hype": 1.4, "rsi": 50, "macd_dir": "up",   "vol": 1.1, "price": 428.6,  "chg": +1.1,  "sector": "BIST-Otomotiv"},
    "GUBRF": {"bias": 0.54, "hype": 1.8, "rsi": 55, "macd_dir": "up",   "vol": 1.3, "price": 428.4,  "chg": +2.1,  "sector": "BIST-Kimya"},
    "TSKB":  {"bias": 0.36, "hype": 1.4, "rsi": 49, "macd_dir": "up",   "vol": 1.1, "price": 28.4,   "chg": +0.8,  "sector": "BIST-Banka"},
    "ALARK": {"bias": 0.43, "hype": 1.5, "rsi": 51, "macd_dir": "up",   "vol": 1.2, "price": 68.4,   "chg": +1.3,  "sector": "BIST-Holding"},
    "KORDS": {"bias": 0.31, "hype": 1.2, "rsi": 48, "macd_dir": "up",   "vol": 0.9, "price": 128.6,  "chg": +0.7,  "sector": "BIST-Tekstil"},
    # ── GLOBAL DİĞER ──
    "NKE":   {"bias": 0.38, "hype": 1.5, "rsi": 50, "macd_dir": "up",   "vol": 1.1, "price": 92.4,   "chg": +0.9,  "sector": "Consumer"},
    "SBUX":  {"bias": -0.29,"hype": 1.4, "rsi": 65, "macd_dir": "down", "vol": 1.0, "price": 72.8,   "chg": -1.6,  "sector": "Consumer"},
    "MCD":   {"bias": 0.18, "hype": 1.1, "rsi": 46, "macd_dir": "up",   "vol": 0.9, "price": 298.4,  "chg": +0.3,  "sector": "Consumer"},
    "DIS":   {"bias": -0.41,"hype": 1.8, "rsi": 68, "macd_dir": "down", "vol": 1.2, "price": 98.4,   "chg": -2.3,  "sector": "Media"},
    "COIN":  {"bias": 0.78, "hype": 4.2, "rsi": 66, "macd_dir": "up",   "vol": 3.4, "price": 228.4,  "chg": +6.8,  "sector": "Crypto"},
    "MSTR":  {"bias": 0.84, "hype": 4.6, "rsi": 69, "macd_dir": "up",   "vol": 3.8, "price": 1682.4, "chg": +8.4,  "sector": "Crypto"},
    "RBLX":  {"bias": 0.55, "hype": 2.1, "rsi": 56, "macd_dir": "up",   "vol": 1.5, "price": 38.2,   "chg": +2.4,  "sector": "Gaming"},
    "HOOD":  {"bias": 0.62, "hype": 2.8, "rsi": 59, "macd_dir": "up",   "vol": 2.1, "price": 18.4,   "chg": +3.6,  "sector": "Finance"},
    "RIVN":  {"bias": -0.52,"hype": 2.2, "rsi": 74, "macd_dir": "down", "vol": 1.6, "price": 11.2,   "chg": -4.8,  "sector": "EV"},
    "LCID":  {"bias": -0.64,"hype": 2.5, "rsi": 78, "macd_dir": "down", "vol": 1.9, "price": 2.84,   "chg": -6.2,  "sector": "EV"},
    "GME":   {"bias": 0.88, "hype": 4.9, "rsi": 62, "macd_dir": "up",   "vol": 4.1, "price": 12.4,   "chg": +9.2,  "sector": "Meme"},
    "AMC":   {"bias": 0.72, "hype": 4.3, "rsi": 65, "macd_dir": "up",   "vol": 3.6, "price": 4.28,   "chg": +7.4,  "sector": "Meme"},
    "BBBY":  {"bias": -0.71,"hype": 3.8, "rsi": 81, "macd_dir": "down", "vol": 2.8, "price": 0.48,   "chg": -12.4, "sector": "Meme"},
    "BB":    {"bias": 0.45, "hype": 2.4, "rsi": 54, "macd_dir": "up",   "vol": 1.8, "price": 3.12,   "chg": +3.1,  "sector": "Meme"},
    "F":     {"bias": 0.32, "hype": 1.4, "rsi": 49, "macd_dir": "up",   "vol": 1.1, "price": 11.8,   "chg": +0.8,  "sector": "Auto"},
    "GM":    {"bias": 0.28, "hype": 1.3, "rsi": 47, "macd_dir": "up",   "vol": 1.0, "price": 42.8,   "chg": +0.6,  "sector": "Auto"},
    "WMT":   {"bias": 0.35, "hype": 1.2, "rsi": 50, "macd_dir": "up",   "vol": 1.0, "price": 68.4,   "chg": +0.7,  "sector": "Retail"},
    "TGT":   {"bias": -0.24,"hype": 1.3, "rsi": 62, "macd_dir": "down", "vol": 0.9, "price": 142.6,  "chg": -1.1,  "sector": "Retail"},
    "COST":  {"bias": 0.48, "hype": 1.5, "rsi": 53, "macd_dir": "up",   "vol": 1.2, "price": 798.4,  "chg": +1.4,  "sector": "Retail"},
}

# ── Sahte Reddit Yorumları ────────────────────────────────────────────────────
REDDIT_BULLISH = [
    "Just loaded up on {ticker}. RSI oversold, golden cross forming 🚀🚀",
    "{ticker} is the trade of the year. Institutional buying confirmed.",
    "Breaking: {ticker} massive volume spike! Smart money accumulating.",
    "Bought {ticker} at open. MACD bullish crossover + positive earnings beat.",
    "{ticker} hakkında çok iyimserim. Teknik analiz mükemmel görünüyor.",
    "r/wallstreetbets is waking up to {ticker}. This is just the beginning.",
    "{ticker} chart is textbook bullish. Higher highs, higher lows. Easy hold.",
    "Diamond hands on {ticker}. These dips are just shaking out weak hands 💎",
    "{ticker} strong buy signal on weekly chart. Adding to my position.",
    "Finally broke out of the channel! {ticker} next target is +20% from here.",
    "{ticker} için alım fırsatı kaçmadan girenleri tebrik ederim!",
    "Kurumsal yatırımcılar {ticker} biriktiriyor. Büyük hareket yakında.",
    "{ticker} short squeeze setup perfect. Bears are trapped.",
    "My entire portfolio is {ticker}. See you on the moon 🌙",
    "{ticker} fundamentals are incredible. P/E is still undervalued vs peers.",
    "Added more {ticker} on today's dip. This company prints money.",
    "{ticker} Boğa kanalından çıktı! Hedef fiyat %25 yukarıda.",
    "Options flow on {ticker} is extremely bullish. Big money bets.",
    "{ticker} insider buying detected. They know something we don't.",
    "Volume + price action on {ticker} = textbook accumulation phase.",
]

REDDIT_BEARISH = [
    "{ticker} is a total disaster. Revenue declining, debt exploding. SELL.",
    "SHORT {ticker}. Death cross + distribution pattern = massive dump incoming.",
    "{ticker} hissesi için çok kötü haberler var. Uzak durun!",
    "RSI overbought at 78 on {ticker}. Correction is inevitable. Get out now.",
    "{ticker} insiders dumping shares like crazy. Run while you can.",
    "I warned everyone about {ticker} last week. Now look at it. -15% incoming.",
    "{ticker} için ayı piyasası başladı. MACD death cross onaylandı.",
    "The {ticker} bull thesis is completely broken. Cut your losses.",
    "Massive put options on {ticker}. Hedge funds know something ugly is coming.",
    "{ticker} overvalued by 40-60%. Mean reversion will be brutal.",
    "{ticker} satış baskısı artıyor. Hacim de bunu destekliyor.",
    "Short selling {ticker} with high conviction. Price target -30%.",
    "{ticker} broke key support. Next stop is the 200-day MA.",
    "The {ticker} pump is over. Distribution phase is clear as day.",
    "{ticker} için kötü dönem başlıyor. Sektör baskısı altında.",
]

TWITTER_BULLISH = [
    "#{ticker} 🚀 Just broke out! Loading more calls. $3 to $50 incoming! #stocks #trading",
    "#{ticker} looking absolutely JUICY right now. RSI reset, MACD turning up. BUY THE DIP",
    "My {ticker} position is up 40% this week. Told you all on Monday. #{ticker} #moonshot",
    "#{ticker} için hedef fiyatımı 2 kat artırdım. Analiz çok güçlü. #BIST #borsa",
    "{ticker} just got an upgrade from Goldman. $500 price target. #{ticker} 🔥",
    "Thread: Why #{ticker} is the best risk/reward setup in the market right now 🧵1/12",
    "#{ticker} volume today is 3x average. Something BIG is coming. #stocks #options",
    "Rotating into #{ticker} from bonds. Macro tailwinds perfectly aligned. #investing",
    "#{ticker} hissesinde dev alım sinyali! Teknik ve temel uyum içinde. #thyao #borsa",
    "Everyone sleeping on #{ticker}. This is the next 10-bagger. Screenshot this.",
]

TWITTER_BEARISH = [
    "#{ticker} is going to ZERO. The fraud is finally being exposed. Shorting hard.",
    "Getting out of #{ticker} before earnings. Chart looks terrible. #bearish",
    "#{ticker} hissesi için acil satış önerisi! RSI aşırı alım bölgesinde.",
    "Why is nobody talking about #{ticker}'s debt pile? This is a ticking time bomb.",
    "Sold all my #{ticker} today. The technicals are screaming SELL. #trading",
    "#{ticker} management just sold $50M in shares. HUGE red flag. DUMP IT.",
    "#{ticker} için ayı baskısı devam ediyor. Stop-loss tetiklendi. #borsa",
    "The #{ticker} rally is completely fake. Zero fundamental support. Short city.",
]

TWITTER_NEUTRAL = [
    "Watching #{ticker} closely. Could go either way at this level. #technicalanalysis",
    "#{ticker} consolidating near support. Waiting for a clear break. #trading",
    "#{ticker} için net bir sinyal yok henüz. Bekle-gör stratejisi. #borsa",
    "Mixed signals on #{ticker}. Sector headwinds vs company-specific tailwinds.",
    "#{ticker} earnings next week. Staying on the sidelines until then. #options",
]


def _get_ticker_profile(ticker: str) -> dict:
    t = ticker.upper().replace(".IS", "")
    if t in TICKER_DEMO_PROFILE:
        return TICKER_DEMO_PROFILE[t]
    seed = sum(ord(c) for c in t)
    rng = random.Random(seed)
    bias = rng.uniform(-0.6, 0.6)
    return {
        "bias": bias, "hype": rng.uniform(1.0, 3.5),
        "rsi": rng.uniform(30, 72), "macd_dir": "up" if bias > 0 else "down",
        "vol": rng.uniform(0.7, 2.5), "price": rng.uniform(10, 400),
        "chg": rng.uniform(-4, 4), "sector": "Other",
    }


def _generate_demo_posts(ticker: str, n: int = 60) -> list[dict]:
    """Hisse profiline göre gerçekçi sahte sosyal medya gönderileri."""
    profile = _get_ticker_profile(ticker)
    bias = profile["bias"]
    hype = profile["hype"]
    n = max(20, int(n * min(hype, 4)))

    # Bias'a göre şablon ağırlıkları
    if bias > 0.5:
        reddit_pool = REDDIT_BULLISH * 5 + TWITTER_NEUTRAL
        twitter_pool = TWITTER_BULLISH * 5
    elif bias > 0.2:
        reddit_pool = REDDIT_BULLISH * 3 + TWITTER_NEUTRAL * 2
        twitter_pool = TWITTER_BULLISH * 3 + TWITTER_NEUTRAL * 2
    elif bias < -0.5:
        reddit_pool = REDDIT_BEARISH * 5 + TWITTER_NEUTRAL
        twitter_pool = TWITTER_BEARISH * 5
    elif bias < -0.2:
        reddit_pool = REDDIT_BEARISH * 3 + TWITTER_NEUTRAL * 2
        twitter_pool = TWITTER_BEARISH * 3 + TWITTER_NEUTRAL * 2
    else:
        reddit_pool = REDDIT_BULLISH * 2 + REDDIT_BEARISH * 2 + TWITTER_NEUTRAL * 2
        twitter_pool = TWITTER_BULLISH * 2 + TWITTER_BEARISH * 2 + TWITTER_NEUTRAL * 2

    subreddits = ["wallstreetbets", "stocks", "investing", "SecurityAnalysis",
                  "options", "StockMarket", "BIST100", "turkish_stocks"]
    posts = []
    rng = random.Random(sum(ord(c) for c in ticker) + 42)
    nrng = np.random.default_rng(sum(ord(c) for c in ticker) + 42)

    for i in range(n):
        is_twitter = rng.random() < 0.4
        pool = twitter_pool if is_twitter else reddit_pool
        template = rng.choice(pool)
        text = template.format(ticker=ticker)
        hours_ago = rng.randint(0, 72)
        dt = datetime.now() - timedelta(hours=hours_ago)
        engagement = int(abs(nrng.lognormal(3 + hype * 0.5, 1.2)))
        account_age = rng.randint(90, 2500)
        followers = int(abs(nrng.lognormal(6, 1.8)))
        posts.append({
            "text": text,
            "source": "twitter" if is_twitter else "reddit",
            "subreddit": rng.choice(subreddits) if not is_twitter else None,
            "timestamp": dt,
            "engagement": engagement,
            "account_age_days": account_age,
            "follower_count": followers,
            "is_demo": True,
        })
    return posts


def fetch_reddit_posts(ticker: str, subreddits: list, limit: int = 50) -> list[dict]:
    posts = _generate_demo_posts(ticker, limit)
    return [p for p in posts if p["source"] == "reddit"]


def fetch_twitter_posts(ticker: str, limit: int = 30) -> list[dict]:
    posts = _generate_demo_posts(ticker, limit)
    return [p for p in posts if p["source"] == "twitter"]


def fetch_price_data(ticker: str, period: str = "3mo"):
    return _generate_demo_price_data(ticker), _calculate_demo_indicators(ticker)


def _generate_demo_price_data(ticker: str) -> pd.DataFrame:
    profile = _get_ticker_profile(ticker)
    base_price = profile["price"]
    daily_chg = profile["chg"] / 100
    rng = np.random.default_rng(sum(ord(c) for c in ticker))
    dates = pd.date_range(end=datetime.now(), periods=90, freq="B")
    price = base_price * (1 - abs(daily_chg) * 15)
    prices, volumes = [], []
    base_vol = abs(rng.lognormal(14, 0.5))
    for i in range(len(dates)):
        price *= np.exp(rng.normal(daily_chg * 0.2, 0.014))
        prices.append(max(price, 0.001))
        vol_mult = profile["vol"] if i > 82 else 1.0
        volumes.append(max(1, int(base_vol * vol_mult * abs(rng.lognormal(0, 0.25)))))
    return pd.DataFrame({
        "date": dates, "close": prices,
        "open":  [p * 0.998 for p in prices],
        "high":  [p * 1.011 for p in prices],
        "low":   [p * 0.989 for p in prices],
        "volume": volumes,
    })


def _calculate_demo_indicators(ticker: str = "") -> dict:
    profile = _get_ticker_profile(ticker) if ticker else {}
    rsi = float(profile.get("rsi", 50))
    macd_dir = profile.get("macd_dir", "up")
    vol = float(profile.get("vol", 1.0))
    price = float(profile.get("price", 100.0))
    chg = float(profile.get("chg", 0.0))
    rng = np.random.default_rng(sum(ord(c) for c in ticker) + 7)

    if macd_dir == "up":
        macd = abs(float(rng.normal(1.1, 0.3)))
        signal = macd - abs(float(rng.normal(0.25, 0.08)))
    else:
        macd = -abs(float(rng.normal(1.1, 0.3)))
        signal = macd + abs(float(rng.normal(0.25, 0.08)))
    hist = macd - signal

    rsi_series = [float(np.clip(rsi + rng.normal(0, 3), 15, 85)) for _ in range(90)]
    macd_series   = [float(macd * (0.4 + i/150) + rng.normal(0, 0.15)) for i in range(90)]
    signal_series = [float(signal * (0.4 + i/150) + rng.normal(0, 0.12)) for i in range(90)]
    histogram_series = [m - s for m, s in zip(macd_series, signal_series)]

    return {
        "rsi": rsi, "macd": macd, "macd_signal": signal,
        "macd_histogram": hist, "macd_direction": macd_dir,
        "macd_crossover": macd_dir == "up" and hist > 0.1,
        "macd_crossunder": macd_dir == "down" and hist < -0.1,
        "bb_upper": price * 1.08, "bb_lower": price * 0.92, "bb_middle": price,
        "current_price": price * (1 + chg / 100),
        "volume_ratio": vol, "price_change_pct": chg,
        "rsi_series": rsi_series, "macd_series": macd_series,
        "signal_series": signal_series, "histogram_series": histogram_series,
    }
