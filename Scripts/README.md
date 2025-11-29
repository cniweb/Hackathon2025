# ⚡ AI-Powered Energy Monitoring & Analytics System

> **Hackathon 2025** - Sustainable Energy Management Solution

A comprehensive energy monitoring system that generates realistic industrial machine data, applies AI-powered analytics to detect anomalies and inefficiencies, and visualizes insights through an interactive dashboard.

---

## 🎯 Overview

This system addresses the challenge of **sustainable energy usage** and **CO₂ emission reduction** by providing:

1. **Realistic Data Generation** - Simulates industrial energy consumption patterns
2. **AI-Powered Analysis** - Detects anomalies, degradation, and optimization opportunities
3. **Interactive Visualization** - Dashboard for exploring insights and recommendations

### 🎪 Hackathon Challenge Context

- **Goal**: Develop an innovative dashboard for energy monitoring visualization
- **Challenge**: Aggregate and analyze data from heterogeneous sources
- **Solution**: End-to-end system from data generation to actionable insights

---

## ✨ Features

### 🔧 Data Generation
- ✅ Realistic industrial machine consumption patterns
- ✅ Time-based variations (day/night, weekdays/weekends, seasonal)
- ✅ Multiple machine types (CNC, Injection Molding, Robots, Presses, Conveyors)
- ✅ **4 subtle anomaly scenarios** for AI detection challenges

### 🤖 AI-Powered Analytics
- ✅ **Voltage Anomaly Detection** - Isolation Forest ML algorithm
- ✅ **Degradation Trend Analysis** - Time-series regression
- ✅ **Harmonic Distortion Detection** - FFT frequency analysis
- ✅ **Phase Imbalance Detection** - Statistical correlation analysis
- ✅ **Peak Load Optimization** - Machine correlation & scheduling recommendations

### 📊 Interactive Dashboard
- ✅ Real-time system health scoring (0-100)
- ✅ Severity-based issue prioritization (Critical/Warning/Normal)
- ✅ Interactive charts with Plotly
- ✅ Detailed analysis per machine
- ✅ Actionable maintenance recommendations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Energy Monitoring System                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │   1. Data Generation Layer              │
        │   energy_data_generator.py              │
        │   • 20 machines × 365 days              │
        │   • 10-second sampling interval         │
        │   • Realistic consumption patterns      │
        │   • 4 embedded anomaly scenarios        │
        └─────────────────────────────────────────┘
                              │
                              ▼ CSV File
        ┌─────────────────────────────────────────┐
        │   2. AI Analytics Layer                 │
        │   energy_ml_analyzer.py                 │
        │   • Isolation Forest (anomalies)        │
        │   • Linear Regression (degradation)     │
        │   • FFT Analysis (harmonics)            │
        │   • Statistical Analysis (imbalance)    │
        │   • Correlation Matrix (peak load)      │
        └─────────────────────────────────────────┘
                              │
                              ▼ JSON Results
        ┌─────────────────────────────────────────┐
        │   3. Visualization Layer                │
        │   energy_dashboard.py (Streamlit)       │
        │   • Interactive charts & metrics        │
        │   • Severity-based alerts               │
        │   • Maintenance recommendations         │
        │   • Health score calculation            │
        └─────────────────────────────────────────┘
```

---

## 🚀 Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Install Dependencies

```bash
pip install pandas numpy scikit-learn scipy matplotlib seaborn plotly streamlit tqdm joblib
```
---

## 🎬 Quick Start

### Complete Workflow (7-Day Test)

```bash
# Step 1: Generate test data (7 days = ~1.2M records)
python energy_data_generator.py -d 7 -o test_data.csv

# Step 2: Run AI analysis
python energy_ml_analyzer.py test_data.csv --output test_results.json

# Step 3: Launch dashboard
streamlit run energy_dashboard.py

# Step 4: Upload test_results.json in the browser
```

### Full Year Production Dataset

```bash
# Generate full year (365 days = ~63M records)
python energy_data_generator.py -d 365 -o production_data.csv

# Analyze (will auto-sample large datasets)
python energy_ml_analyzer.py production_data.csv --output production_results.json

# Visualize
streamlit run energy_dashboard.py
```

---

## 🔧 Components

### 1. Data Generator (`energy_data_generator.py`)

**Purpose**: Generate realistic energy consumption data with embedded anomalies

**Usage**:
```bash
python energy_data_generator.py [OPTIONS]

Options:
  -m, --machines INT      Number of machines (default: 20)
  -d, --days INT         Duration in days (default: 365)
  -i, --interval INT     Sampling interval in seconds (default: 10)
  -s, --start DATE       Start date YYYY-MM-DD (default: 2024-01-01)
  -o, --output FILE      Output CSV file (default: energy_monitoring_data.csv)
  -c, --chunk INT        Chunk size for writing (default: 50000)
```

**Example**:
```bash
# Generate 30 days of data with 30-second sampling
python energy_data_generator.py -d 30 -i 30 -o monthly_data.csv
```

**Embedded Anomalies**:
- **Machine_05**: Voltage spikes (8% overvoltage, ~0.3% of readings)
- **Machine_12**: Gradual degradation (15% current increase, 8% PF decrease over time)
- **Machine_08**: Harmonic distortion (3rd & 5th harmonics, reduced PF)
- **Machine_15**: Phase imbalance (±8% current variation)

---

### 2. AI Analyzer (`energy_ml_analyzer.py`)

**Purpose**: Apply machine learning and statistical analysis to detect issues

**Usage**:
```bash
python energy_ml_analyzer.py DATA_FILE [OPTIONS]

Options:
  --all              Run all analyses (default)
  --anomalies        Detect voltage anomalies
  --degradation      Analyze degradation trends
  --harmonics        Detect harmonic distortion
  --imbalance        Analyze phase imbalance
  --peak             Optimize peak loads
  --output FILE      Output JSON file (default: ai_analysis_results.json)
```

**Example**:
```bash
# Run specific analyses
python energy_ml_analyzer.py data.csv --anomalies --degradation --output results.json

# Run all analyses
python energy_ml_analyzer.py data.csv
```

**AI Techniques**:
- **Isolation Forest**: Unsupervised anomaly detection
- **Linear Regression**: Trend analysis for degradation
- **FFT (Fast Fourier Transform)**: Frequency domain analysis
- **Statistical Process Control**: Variation analysis
- **Correlation Matrix**: Machine interaction patterns

---

### 3. Dashboard (`energy_dashboard.py`)

**Purpose**: Interactive web-based visualization of analysis results

**Usage**:
```bash
streamlit run energy_dashboard.py [STREAMLIT_OPTIONS]

Streamlit Options:
  --server.port PORT           Port number (default: 8501)
  --server.address ADDRESS     Server address (default: localhost)
  --server.headless BOOL       Run without browser (default: false)
```

**Example**:
```bash
# Run on specific port
streamlit run energy_dashboard.py --server.port 8080

# Run for remote access
streamlit run energy_dashboard.py --server.address 0.0.0.0
```

**Dashboard Pages**:
1. **Overview**: System health score, issue summary
2. **Anomalies**: Voltage spike detection results
3. **Degradation**: Performance decline analysis
4. **Harmonics**: Power quality assessment
5. **Imbalance**: Phase distribution analysis
6. **Peak Load**: Optimization recommendations

---

## 📊 Data Structure

### CSV Output Format (Generated Data)

```csv
machineId,machineType,timestamp,voltage,current,power,powerFactor
Machine_00,CNC_Mill,2024-01-01T00:00:00,399.45,42.31,14.26,0.847
Machine_01,Injection_Molding,2024-01-01T00:00:00,378.92,58.45,18.23,0.821
...
```

**Fields**:
- `machineId`: Unique machine identifier (Machine_00 to Machine_19)
- `machineType`: Equipment category (CNC_Mill, Injection_Molding, Robot_Arm, Press, Conveyor)
- `timestamp`: ISO 8601 format datetime
- `voltage`: Measured voltage in Volts (V)
- `current`: Measured current in Amperes (A)
- `power`: Calculated power in kilowatts (kW)
- `powerFactor`: Power factor (0-1)

---

### JSON Output Format (Analysis Results)

```json
{
  "voltage_anomalies": {
    "machine_id": "Machine_05",
    "total_anomalies": 245,
    "anomaly_rate": 0.287,
    "anomalies": [
      {
        "timestamp": "2024-01-15T14:23:10",
        "voltage": 432.15,
        "current": 41.23,
        "anomaly_score": -0.234
      }
    ]
  },
  "degradation": {
    "machine_id": "Machine_12",
    "current_change_percent": 14.87,
    "power_factor_change_percent": -7.92,
    "severity": "WARNING",
    "current_trend_slope": 0.000234,
    "pf_trend_slope": -0.000012
  },
  "harmonics": {
    "machine_id": "Machine_08",
    "thd_percent": 12.45,
    "power_factor": 0.771,
    "severity": "WARNING",
    "dominant_harmonics": [[3, 0.0234], [5, 0.0156]]
  },
  "phase_imbalance": {
    "machine_id": "Machine_15",
    "coefficient_of_variation": 0.123,
    "current_range": 4.56,
    "severity": "WARNING",
    "autocorrelations": {"100": 0.234, "250": 0.456}
  },
  "peak_load_optimization": {
    "peak_load_kw": 856.23,
    "average_load_kw": 543.12,
    "peak_average_ratio": 1.58,
    "average_correlation": 0.234,
    "highly_correlated_pairs": 3,
    "optimization_potential": "LOW"
  }
}
```

---

## 🧠 AI Models & Algorithms

### 1. Voltage Anomaly Detection

**Algorithm**: Isolation Forest (Unsupervised Learning)

**How it works**:
1. Feature engineering: voltage, deviation, rolling stats, ratios
2. Train Isolation Forest with contamination=0.005 (0.5%)
3. Score each data point (negative scores = anomalies)
4. Flag readings exceeding threshold

**Why it works**:
- No labeled training data needed
- Effective for rare events (0.3% spike rate)
- Handles high-dimensional feature space
- Fast inference on large datasets

**Parameters**:
- `n_estimators`: 100 trees
- `contamination`: 0.005 (expected anomaly rate)
- `random_state`: 42 (reproducibility)

---

### 2. Degradation Trend Analysis

**Algorithm**: Linear Regression + Rolling Averages

**How it works**:
1. Calculate rolling averages (window=1000 samples)
2. Fit linear regression to smoothed data
3. Calculate slope (trend) and percentage change
4. Classify severity based on thresholds

**Degradation Indicators**:
- Current increase >10% → Mechanical wear
- Power factor decrease >5% → Efficiency loss
- Combined trends → Predictive maintenance alert

**Thresholds**:
- NORMAL: <7% current change, >-4% PF change
- WARNING: 7-10% current change, -4% to -5% PF change
- CRITICAL: >10% current change, <-5% PF change

---

### 3. Harmonic Distortion Detection

**Algorithm**: Fast Fourier Transform (FFT)

**How it works**:
1. Sample current waveform (10,000 points)
2. Apply FFT to convert time → frequency domain
3. Identify peaks at harmonic frequencies (3rd, 5th, 7th)
4. Calculate Total Harmonic Distortion (THD)

**THD Calculation**:
```
THD = sqrt(sum(harmonics^2)) / fundamental × 100%
```

**Severity Classification**:
- THD <5%: Excellent power quality
- THD 5-10%: Good, monitor trends
- THD 10-15%: Moderate, consider improvements
- THD >15%: Critical, immediate action

---

### 4. Phase Imbalance Detection

**Algorithm**: Statistical Analysis + Autocorrelation

**How it works**:
1. Calculate coefficient of variation (CV = std/mean)
2. Compute rolling statistics (window=500)
3. Calculate autocorrelation at multiple lags
4. Detect periodic imbalance patterns

**Coefficient of Variation**:
- CV <0.10: Normal operation
- CV 0.10-0.15: Warning
- CV >0.15: Critical imbalance

**Autocorrelation**:
- High positive correlation → Periodic pattern
- Indicates systematic phase loading issues

---

### 5. Peak Load Optimization

**Algorithm**: Correlation Matrix Analysis

**How it works**:
1. Pivot data to machine × timestamp matrix
2. Calculate Pearson correlation between machines
3. Identify highly correlated pairs (|r| > 0.5)
4. Estimate optimization potential

**Optimization Potential**:
- LOW (avg corr <0.3): Good async operation
- MEDIUM (avg corr 0.3-0.6): Moderate opportunity
- HIGH (avg corr >0.6): Significant savings possible

**Recommendations**:
- Stagger highly correlated machine schedules
- Implement demand response strategies
- Apply load shifting during peak hours

---

## ⚙️ Configuration

### Data Generation Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| machines | 20 | 1-100 | Number of machines to simulate |
| days | 365 | 1-365 | Duration of data generation |
| interval | 10 | 1-3600 | Sampling interval (seconds) |
| chunk_size | 50000 | 1000-100000 | Rows per write batch |

### Machine Types & Profiles

| Type | Voltage | Current | Power Factor | Use Case |
|------|---------|---------|--------------|----------|
| CNC_Mill | 400V | 45A | 0.85 | Precision machining |
| Injection_Molding | 380V | 60A | 0.82 | Plastic production |
| Robot_Arm | 400V | 25A | 0.88 | Assembly automation |
| Press | 400V | 80A | 0.80 | Metal forming |
| Conveyor | 230V | 15A | 0.90 | Material transport |

### Time-Based Factors

- **Production Hours**: 6:00-22:00 (100% load)
- **Night Hours**: 22:00-6:00 (15% load)
- **Weekdays**: 100% load
- **Weekends**: 30% load
- **Lunch Break**: 12:00-13:00 (70% load)
- **Seasonal Variation**: ±20% sinusoidal

---

## 🐛 Troubleshooting

### Issue: Generator killed during execution

**Symptom**: Process terminated with "Killed"

**Cause**: Out of memory (RAM)

**Solution**:
```bash
# Reduce duration or increase sampling interval
python energy_data_generator.py -d 30 -i 30

# Or reduce number of machines
python energy_data_generator.py -m 10 -d 365
```

---

### Issue: Streamlit warnings about ScriptRunContext

**Symptom**: Warning messages when running with `python`

**Cause**: Incorrect execution method

**Solution**:
```bash
# Don't use: python energy_dashboard.py
# Use: streamlit run energy_dashboard.py
streamlit run energy_dashboard.py
```

---

### Issue: Analysis takes too long

**Symptom**: ML analyzer runs for hours

**Cause**: Dataset too large (>5M rows)

**Solution**: The analyzer automatically samples 10% of large datasets. To force smaller sample:
```bash
# Generate smaller dataset
python energy_data_generator.py -d 7 -o small_test.csv
```

---

### Issue: No anomalies detected

**Symptom**: Zero anomalies found in analysis

**Cause**: Check if using correct machine IDs

**Solution**: Embedded anomalies are in specific machines:
- Machine_05: Voltage spikes
- Machine_12: Degradation
- Machine_08: Harmonics
- Machine_15: Imbalance

Verify data generation completed successfully.

---

### Issue: Dashboard not loading JSON

**Symptom**: Error parsing JSON file

**Cause**: Corrupted or incomplete analysis

**Solution**:
```bash
# Re-run analysis
python energy_ml_analyzer.py data.csv --output new_results.json

# Verify JSON is valid
python -m json.tool results.json
```

---

## 📈 Performance Benchmarks

### Data Generation Speed

| Duration | Records | File Size | Generation Time |
|----------|---------|-----------|-----------------|
| 1 day | ~172,800 | ~16 MB | ~30 seconds |
| 7 days | ~1.2M | ~115 MB | ~3 minutes |
| 30 days | ~5.2M | ~490 MB | ~12 minutes |
| 365 days | ~63M | ~5.8 GB | ~2.5 hours |

*Tested on: Intel i7, 16GB RAM, SSD*

### Analysis Speed

| Dataset Size | Analysis Time | Memory Usage |
|--------------|---------------|--------------|
| 1M rows | ~2 minutes | ~500 MB |
| 5M rows | ~8 minutes | ~1.5 GB |
| 10M+ rows | ~15 minutes | ~2 GB (with sampling) |

---

## 🤝 Areas for improvement:

- [ ] Real-time data streaming support
- [ ] Additional ML models (LSTM, Prophet)
- [ ] Multi-site comparison features
- [ ] Cost calculation & ROI analysis
- [ ] Export reports to PDF
- [ ] Integration with SCADA systems
- [ ] Mobile-responsive dashboard
- [ ] Internationalization (i18n)

## 👥 Authors

**Wattwatchers Hackathon 2025 Team**
---

*Made with ❤️ for sustainable energy management*

