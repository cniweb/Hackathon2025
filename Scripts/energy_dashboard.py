import streamlit as st
import json
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px

st.set_page_config(page_title="Energy Analytics", page_icon="⚡", layout="wide")

st.markdown("""
<style>
    .metric-card {background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.75rem; color: white;}
    .critical-badge {background-color: #ef4444; color: white; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-weight: bold;}
    .warning-badge {background-color: #f59e0b; color: white; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-weight: bold;}
    .normal-badge {background-color: #10b981; color: white; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-weight: bold;}
</style>
""", unsafe_allow_html=True)

def get_badge(severity):
    if severity == "CRITICAL": return '<span class="critical-badge">🔴 CRITICAL</span>'
    elif severity == "WARNING": return '<span class="warning-badge">🟡 WARNING</span>'
    elif severity == "NORMAL": return '<span class="normal-badge">🟢 NORMAL</span>'
    return '<span class="normal-badge">INFO</span>'

def calc_health_score(data):
    critical = sum(1 for v in data.values() if isinstance(v, dict) and v.get('severity') == 'CRITICAL')
    warning = sum(1 for v in data.values() if isinstance(v, dict) and v.get('severity') == 'WARNING')
    normal = sum(1 for v in data.values() if isinstance(v, dict) and v.get('severity') == 'NORMAL')
    total = critical + warning + normal
    return round((normal * 100 + warning * 50) / total) if total > 0 else 100

def overview_page(data):
    st.title("⚡ Energy Analytics Dashboard")
    
    health_score = calc_health_score(data)
    
    col1, col2, col3, col4 = st.columns([2, 1, 1, 1])
    
    with col1:
        fig = go.Figure(go.Indicator(
            mode="gauge+number",
            value=health_score,
            title={'text': "Health Score"},
            gauge={
                'axis': {'range': [None, 100]},
                'bar': {'color': "darkblue"},
                'steps': [
                    {'range': [0, 50], 'color': '#fee2e2'},
                    {'range': [50, 80], 'color': '#fef3c7'},
                    {'range': [80, 100], 'color': '#d1fae5'}
                ],
            }
        ))
        fig.update_layout(height=300)
        st.plotly_chart(fig, use_container_width=True)
    
    critical = [k for k, v in data.items() if isinstance(v, dict) and v.get('severity') == 'CRITICAL']
    warnings = [k for k, v in data.items() if isinstance(v, dict) and v.get('severity') == 'WARNING']
    normal = [k for k, v in data.items() if isinstance(v, dict) and v.get('severity') == 'NORMAL']
    
    with col2: st.metric("🔴 Critical", len(critical))
    with col3: st.metric("🟡 Warnings", len(warnings))
    with col4: st.metric("🟢 Normal", len(normal))
    
    if critical or warnings:
        st.markdown("### ⚠️ Issues Detected")
        for key in critical + warnings:
            st.markdown(get_badge(data[key].get('severity', 'INFO')) + f" **{data[key].get('machine_id', key)}** - {key.replace('_', ' ').title()}", unsafe_allow_html=True)

def anomalies_page(data):
    if 'voltage_anomalies' not in data:
        st.warning("No data")
        return
    
    anom = data['voltage_anomalies']
    st.title(f"⚡ Voltage Anomalies - {anom.get('machine_id', 'N/A')}")
    
    col1, col2, col3 = st.columns(3)
    col1.metric("Total Anomalies", anom.get('total_anomalies', 0))
    col2.metric("Anomaly Rate", f"{anom.get('anomaly_rate', 0):.3f}%")
    col3.metric("Expected", "0.300%")
    
    if anom.get('anomalies'):
        df = pd.DataFrame(anom['anomalies'][:50])
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        st.dataframe(df, use_container_width=True)
        
        fig = px.scatter(df, x='timestamp', y='voltage', color='anomaly_score',
                        size='voltage', color_continuous_scale='Reds')
        st.plotly_chart(fig, use_container_width=True)

def degradation_page(data):
    if 'degradation' not in data:
        st.warning("No data")
        return
    
    deg = data['degradation']
    st.title(f"📉 Degradation - {deg.get('machine_id', 'N/A')}")
    st.markdown(get_badge(deg.get('severity', 'NORMAL')), unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### Current")
        st.metric("Change", f"{deg.get('current_change_percent', 0):+.2f}%")
        st.metric("Slope", f"{deg.get('current_trend_slope', 0):.6f}")
    
    with col2:
        st.markdown("### Power Factor")
        st.metric("Change", f"{deg.get('power_factor_change_percent', 0):+.2f}%")
        st.metric("Slope", f"{deg.get('pf_trend_slope', 0):.6f}")
    
    if deg.get('severity') != 'NORMAL':
        st.info("💡 Schedule maintenance inspection")

def harmonics_page(data):
    if 'harmonics' not in data:
        st.warning("No data")
        return
    
    harm = data['harmonics']
    st.title(f"🌊 Harmonics - {harm.get('machine_id', 'N/A')}")
    st.markdown(get_badge(harm.get('severity', 'NORMAL')), unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    col1.metric("THD", f"{harm.get('thd_percent', 0):.2f}%")
    col2.metric("Power Factor", f"{harm.get('power_factor', 0):.3f}")
    col3.metric("Expected PF", "~0.770")
    
    if harm.get('dominant_harmonics'):
        df = pd.DataFrame(harm['dominant_harmonics'][:10], columns=['Frequency', 'Magnitude'])
        fig = px.bar(df, x='Frequency', y='Magnitude', color='Magnitude', color_continuous_scale='Purples')
        st.plotly_chart(fig, use_container_width=True)

def imbalance_page(data):
    if 'phase_imbalance' not in data:
        st.warning("No data")
        return
    
    imb = data['phase_imbalance']
    st.title(f"⚖️ Phase Imbalance - {imb.get('machine_id', 'N/A')}")
    st.markdown(get_badge(imb.get('severity', 'NORMAL')), unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    col1.metric("CV", f"{imb.get('coefficient_of_variation', 0):.3f}")
    col2.metric("Range", f"{imb.get('current_range', 0):.2f}A")
    
    if imb.get('autocorrelations'):
        df = pd.DataFrame(list(imb['autocorrelations'].items()), columns=['Lag', 'Correlation'])
        df['Lag'] = df['Lag'].astype(int)
        fig = px.line(df, x='Lag', y='Correlation', markers=True)
        st.plotly_chart(fig, use_container_width=True)

def peak_load_page(data):
    if 'peak_load_optimization' not in data:
        st.warning("No data")
        return
    
    peak = data['peak_load_optimization']
    st.title("⚡ Peak Load Optimization")
    
    col1, col2, col3 = st.columns(3)
    col1.metric("Peak", f"{peak.get('peak_load_kw', 0):.2f} kW")
    col2.metric("Average", f"{peak.get('average_load_kw', 0):.2f} kW")
    col3.metric("Ratio", f"{peak.get('peak_average_ratio', 0):.2f}x")
    
    col1, col2 = st.columns(2)
    col1.metric("Avg Correlation", f"{peak.get('average_correlation', 0):.3f}")
    col2.metric("High Corr Pairs", peak.get('highly_correlated_pairs', 0))
    
    potential = peak.get('optimization_potential', 'UNKNOWN')
    if potential == 'LOW':
        st.success("✅ Excellent async operation")
    elif potential == 'MEDIUM':
        st.warning("⚠️ Moderate optimization opportunity")
    else:
        st.error("🔴 High optimization potential - implement load scheduling")

def main():
    with st.sidebar:
        st.markdown("## 📁 Upload Results")
        uploaded_file = st.file_uploader("JSON file", type=['json'])
        
        if uploaded_file:
            page = st.radio("Navigation", ["Overview", "Anomalies", "Degradation", "Harmonics", "Imbalance", "Peak Load"])
        else:
            page = "Overview"
    
    if not uploaded_file:
        st.title("⚡ Energy Analytics Dashboard")
        st.info("👈 Upload JSON file to start")
        st.markdown("""
        ### Quick Start
        1. `python energy_data_generator.py -d 7 -o data.csv`
        2. `python energy_ml_analyzer.py data.csv`
        3. Upload `ai_analysis_results.json`
        """)
        return
    
    data = json.load(uploaded_file)
    
    if page == "Overview": overview_page(data)
    elif page == "Anomalies": anomalies_page(data)
    elif page == "Degradation": degradation_page(data)
    elif page == "Harmonics": harmonics_page(data)
    elif page == "Imbalance": imbalance_page(data)
    elif page == "Peak Load": peak_load_page(data)

if __name__ == "__main__":
    main()

