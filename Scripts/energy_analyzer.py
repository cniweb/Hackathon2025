import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from scipy import stats
from scipy.signal import find_peaks
from scipy.fft import fft, fftfreq
import json
import argparse
import warnings
warnings.filterwarnings('ignore')

class EnergyMLAnalyzer:
    def __init__(self, data_file, chunk_size=100000):
        self.data_file = data_file
        self.results = {}
        
        print(f"\n🤖 Loading {data_file}...")
        self.df = self._load_data_smart(chunk_size)
        print(f"✅ {len(self.df):,} records loaded\n")
        
    def _load_data_smart(self, chunk_size):
        try:
            total_rows = sum(1 for _ in open(self.data_file)) - 1
        except:
            total_rows = 1000000
        
        if total_rows > 5_000_000:
            print(f"⚠️  Large dataset ({total_rows:,} rows) - sampling 10%")
            chunks = []
            for chunk in pd.read_csv(self.data_file, chunksize=chunk_size, parse_dates=['timestamp']):
                chunks.append(chunk.sample(frac=0.1, random_state=42))
            df = pd.concat(chunks, ignore_index=True)
        else:
            df = pd.read_csv(self.data_file, parse_dates=['timestamp'])
        
        return df.sort_values('timestamp').reset_index(drop=True)
    
    def detect_voltage_anomalies(self, machine_id='Machine_05', contamination=0.005):
        print(f"⚡ Analyzing {machine_id} for voltage anomalies...")
        
        machine_data = self.df[self.df['machineId'] == machine_id].copy()
        
        machine_data['voltage_rolling_mean'] = machine_data['voltage'].rolling(window=10, min_periods=1).mean()
        machine_data['voltage_rolling_std'] = machine_data['voltage'].rolling(window=10, min_periods=1).std()
        machine_data['voltage_deviation'] = abs(machine_data['voltage'] - machine_data['voltage_rolling_mean'])
        machine_data['current_voltage_ratio'] = machine_data['current'] / machine_data['voltage']
        
        features = ['voltage', 'voltage_deviation', 'voltage_rolling_std', 'current_voltage_ratio']
        X = machine_data[features].fillna(0)
        
        iso_forest = IsolationForest(contamination=contamination, random_state=42, n_estimators=100)
        predictions = iso_forest.fit_predict(X)
        scores = iso_forest.score_samples(X)
        
        machine_data['anomaly'] = predictions
        machine_data['anomaly_score'] = scores
        anomalies = machine_data[machine_data['anomaly'] == -1]
        
        print(f"   Found: {len(anomalies):,} anomalies ({len(anomalies)/len(machine_data)*100:.3f}%)\n")
        
        self.results['voltage_anomalies'] = {
            'machine_id': machine_id,
            'total_anomalies': len(anomalies),
            'anomaly_rate': len(anomalies)/len(machine_data)*100,
            'anomalies': anomalies[['timestamp', 'voltage', 'current', 'anomaly_score']].head(100).to_dict('records')
        }
        
        return anomalies
    
    def detect_degradation_trend(self, machine_id='Machine_12', window_size=1000):
        print(f"📉 Analyzing {machine_id} for degradation...")
        
        machine_data = self.df[self.df['machineId'] == machine_id].copy().reset_index(drop=True)
        
        machine_data['current_ma'] = machine_data['current'].rolling(window=window_size, min_periods=1).mean()
        machine_data['pf_ma'] = machine_data['powerFactor'].rolling(window=window_size, min_periods=1).mean()
        
        x = np.arange(len(machine_data))
        mask = ~np.isnan(machine_data['current_ma'].values)
        
        if mask.sum() >= 2:
            current_slope, _ = np.polyfit(x[mask], machine_data['current_ma'].values[mask], 1)
            pf_slope, _ = np.polyfit(x[mask], machine_data['pf_ma'].values[mask], 1)
        else:
            current_slope, pf_slope = 0, 0
        
        initial_current = machine_data['current_ma'].iloc[window_size:window_size+100].mean()
        final_current = machine_data['current_ma'].iloc[-100:].mean()
        current_change = (final_current - initial_current) / initial_current * 100
        
        initial_pf = machine_data['pf_ma'].iloc[window_size:window_size+100].mean()
        final_pf = machine_data['pf_ma'].iloc[-100:].mean()
        pf_change = (final_pf - initial_pf) / initial_pf * 100
        
        if current_change > 10 and pf_change < -5:
            severity = "CRITICAL"
        elif current_change > 7 or pf_change < -4:
            severity = "WARNING"
        else:
            severity = "NORMAL"
        
        print(f"   Current: {current_change:+.2f}% | PF: {pf_change:+.2f}% | {severity}\n")
        
        self.results['degradation'] = {
            'machine_id': machine_id,
            'current_change_percent': current_change,
            'power_factor_change_percent': pf_change,
            'severity': severity,
            'current_trend_slope': current_slope,
            'pf_trend_slope': pf_slope
        }
        
        return machine_data
    
    def detect_harmonics(self, machine_id='Machine_08', sample_size=10000):
        print(f"🌊 Analyzing {machine_id} for harmonics...")
        
        machine_data = self.df[self.df['machineId'] == machine_id].copy()
        sample_indices = np.linspace(0, len(machine_data)-1, min(sample_size, len(machine_data)), dtype=int)
        samples = machine_data.iloc[sample_indices]['current'].values
        
        N = len(samples)
        yf = fft(samples)
        xf = fftfreq(N, 1.0)[:N//2]
        power = 2.0/N * np.abs(yf[:N//2])
        
        peaks, _ = find_peaks(power, height=np.mean(power)*1.5, distance=2)
        
        if len(peaks) > 0:
            peak_magnitudes = power[peaks]
            sorted_indices = np.argsort(peak_magnitudes)[::-1]
            top_peaks = peaks[sorted_indices[:5]]
            top_magnitudes = peak_magnitudes[sorted_indices[:5]]
        else:
            top_peaks, top_magnitudes = [], []
        
        fundamental = power[1] if len(power) > 1 else 0
        harmonics_power = np.sum(power[2:min(10, len(power))]**2)
        thd = np.sqrt(harmonics_power) / fundamental * 100 if fundamental > 0 else 0
        
        severity = "CRITICAL" if thd > 15 else "WARNING" if thd > 10 else "NORMAL"
        
        print(f"   THD: {thd:.2f}% | PF: {machine_data['powerFactor'].mean():.3f} | {severity}\n")
        
        self.results['harmonics'] = {
            'machine_id': machine_id,
            'thd_percent': thd,
            'power_factor': machine_data['powerFactor'].mean(),
            'severity': severity,
            'dominant_harmonics': list(zip(top_peaks.tolist(), top_magnitudes.tolist()))
        }
        
        return machine_data
    
    def detect_phase_imbalance(self, machine_id='Machine_15'):
        print(f"⚖️  Analyzing {machine_id} for phase imbalance...")
        
        machine_data = self.df[self.df['machineId'] == machine_id].copy()
        
        current_mean = machine_data['current'].mean()
        current_std = machine_data['current'].std()
        cv = current_std / current_mean
        
        autocorr_lags = [100, 250, 500, 1000]
        autocorrs = {}
        for lag in autocorr_lags:
            if len(machine_data) > lag:
                autocorrs[lag] = machine_data['current'].autocorr(lag=lag)
        
        severity = "CRITICAL" if cv > 0.15 else "WARNING" if cv > 0.10 else "NORMAL"
        
        print(f"   CV: {cv:.3f} | Range: {machine_data['current'].max() - machine_data['current'].min():.2f}A | {severity}\n")
        
        self.results['phase_imbalance'] = {
            'machine_id': machine_id,
            'coefficient_of_variation': cv,
            'current_range': machine_data['current'].max() - machine_data['current'].min(),
            'severity': severity,
            'autocorrelations': autocorrs
        }
        
        return machine_data
    
    def optimize_peak_load(self):
        print(f"⚡ Analyzing peak load optimization...")
        
        total_power = self.df.groupby('timestamp')['power'].sum().reset_index()
        total_power.columns = ['timestamp', 'total_power']
        
        pivot = self.df.pivot_table(index='timestamp', columns='machineId', values='power', aggfunc='mean')
        corr_matrix = pivot.corr()
        
        high_corr_pairs = []
        for i in range(len(corr_matrix.columns)):
            for j in range(i+1, len(corr_matrix.columns)):
                corr_val = corr_matrix.iloc[i, j]
                if abs(corr_val) > 0.5:
                    high_corr_pairs.append((corr_matrix.columns[i], corr_matrix.columns[j], corr_val))
        
        avg_corr = corr_matrix.values[np.triu_indices_from(corr_matrix.values, k=1)].mean()
        
        if avg_corr < 0.3:
            potential = 'LOW'
        elif avg_corr < 0.6:
            potential = 'MEDIUM'
        else:
            potential = 'HIGH'
        
        print(f"   Peak: {total_power['total_power'].max():.2f}kW | Avg Corr: {avg_corr:.3f} | Potential: {potential}\n")
        
        self.results['peak_load_optimization'] = {
            'peak_load_kw': total_power['total_power'].max(),
            'average_load_kw': total_power['total_power'].mean(),
            'peak_average_ratio': total_power['total_power'].max()/total_power['total_power'].mean(),
            'average_correlation': avg_corr,
            'highly_correlated_pairs': len(high_corr_pairs),
            'optimization_potential': potential
        }
        
        return total_power
    
    def run_all_analyses(self):
        self.detect_voltage_anomalies()
        self.detect_degradation_trend()
        self.detect_harmonics()
        self.detect_phase_imbalance()
        self.optimize_peak_load()
        
        critical = sum(1 for v in self.results.values() if isinstance(v, dict) and v.get('severity') == 'CRITICAL')
        warnings = sum(1 for v in self.results.values() if isinstance(v, dict) and v.get('severity') == 'WARNING')
        
        print(f"{'='*60}")
        print(f"Summary: {critical} Critical | {warnings} Warnings")
        print(f"{'='*60}\n")
    
    def save_results(self, output_file='ai_analysis_results.json'):
        def convert(obj):
            if isinstance(obj, (np.integer, np.int64)): return int(obj)
            if isinstance(obj, (np.floating, np.float64)): return float(obj)
            if isinstance(obj, np.ndarray): return obj.tolist()
            if isinstance(obj, pd.Timestamp): return obj.isoformat()
            if isinstance(obj, dict): return {k: convert(v) for k, v in obj.items()}
            if isinstance(obj, list): return [convert(item) for item in obj]
            return obj
        
        with open(output_file, 'w') as f:
            json.dump(convert(self.results), f, indent=2)
        
        print(f"💾 Results saved to {output_file}")

def main():
    parser = argparse.ArgumentParser(description='AI-powered energy analysis')
    parser.add_argument('data_file', type=str)
    parser.add_argument('--output', type=str, default='ai_analysis_results.json')
    
    args = parser.parse_args()
    
    analyzer = EnergyMLAnalyzer(args.data_file)
    analyzer.run_all_analyses()
    analyzer.save_results(args.output)

if __name__ == '__main__':
    main()

