import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import argparse
from tqdm import tqdm
import os

class EnergyDataGenerator:
    def __init__(self, num_machines=20, duration_days=365, sampling_interval=10, start_date='2024-01-01'):
        self.num_machines = num_machines
        self.duration_days = duration_days
        self.sampling_interval = sampling_interval
        self.start_date = datetime.strptime(start_date, '%Y-%m-%d')
        
        self.machine_types = [
            {'type': 'CNC_Mill', 'base_voltage': 400, 'base_current': 45, 'power_factor': 0.85},
            {'type': 'Injection_Molding', 'base_voltage': 380, 'base_current': 60, 'power_factor': 0.82},
            {'type': 'Robot_Arm', 'base_voltage': 400, 'base_current': 25, 'power_factor': 0.88},
            {'type': 'Press', 'base_voltage': 400, 'base_current': 80, 'power_factor': 0.80},
            {'type': 'Conveyor', 'base_voltage': 230, 'base_current': 15, 'power_factor': 0.90}
        ]
        
        self.samples_per_day = int((24 * 60 * 60) / sampling_interval)
        self.total_samples = self.samples_per_day * duration_days
        
    def get_time_factors(self, timestamp):
        hour = timestamp.hour
        day_of_week = timestamp.weekday()
        day_of_year = timestamp.timetuple().tm_yday
        
        day_night_factor = 1.0 if 6 <= hour < 22 else 0.15
        weekend_factor = 0.3 if day_of_week in [5, 6] else 1.0
        seasonal_factor = 0.9 + 0.2 * np.sin((day_of_year / 365) * 2 * np.pi)
        lunch_factor = 0.7 if hour == 12 else 1.0
        
        return day_night_factor * weekend_factor * seasonal_factor * lunch_factor
    
    def generate_normal_machine(self, machine_id, machine_spec, timestamp, data_point):
        time_factor = self.get_time_factors(timestamp)
        noise = 0.97 + np.random.random() * 0.06
        
        cycle_phase = np.sin((data_point / 360) * 2 * np.pi + machine_id)
        load_cycle = 0.7 + 0.3 * (cycle_phase + 1) / 2
        
        voltage = machine_spec['base_voltage'] * (0.98 + np.random.random() * 0.04) * noise
        current = machine_spec['base_current'] * time_factor * load_cycle * noise
        power_factor = machine_spec['power_factor'] + (np.random.random() - 0.5) * 0.02
        power = voltage * current * power_factor / 1000
        
        return {
            'machineId': f"Machine_{machine_id:02d}",
            'machineType': machine_spec['type'],
            'timestamp': timestamp,
            'voltage': round(voltage, 2),
            'current': round(current, 2),
            'power': round(power, 2),
            'powerFactor': round(power_factor, 3)
        }
    
    def generate_error_machine(self, machine_id, machine_spec, timestamp, data_point):
        base = self.generate_normal_machine(machine_id, machine_spec, timestamp, data_point)
        
        hour = timestamp.hour
        if 6 <= hour < 22 and np.random.random() < 0.003:
            base['voltage'] *= 1.08
            base['current'] *= 0.95
            base['power'] = round(base['voltage'] * base['current'] * base['powerFactor'] / 1000, 2)
        
        return base
    
    def generate_degrading_machine(self, machine_id, machine_spec, timestamp, data_point):
        base = self.generate_normal_machine(machine_id, machine_spec, timestamp, data_point)
        
        degradation_factor = 1 + (data_point / self.total_samples) * 0.15
        efficiency_loss = 1 - (data_point / self.total_samples) * 0.08
        
        base['current'] *= degradation_factor
        base['powerFactor'] *= efficiency_loss
        base['power'] = round(base['voltage'] * base['current'] * base['powerFactor'] / 1000, 2)
        
        return base
    
    def generate_harmonic_machine(self, machine_id, machine_spec, timestamp, data_point):
        base = self.generate_normal_machine(machine_id, machine_spec, timestamp, data_point)
        
        harmonic3 = np.sin((data_point / 120) * 2 * np.pi) * 0.05
        harmonic5 = np.sin((data_point / 72) * 2 * np.pi) * 0.03
        
        base['current'] *= (1 + harmonic3 + harmonic5)
        base['powerFactor'] *= 0.93
        base['power'] = round(base['voltage'] * base['current'] * base['powerFactor'] / 1000, 2)
        
        return base
    
    def generate_imbalanced_machine(self, machine_id, machine_spec, timestamp, data_point):
        base = self.generate_normal_machine(machine_id, machine_spec, timestamp, data_point)
        
        imbalance = 0.92 + np.sin((data_point / 500) * 2 * np.pi) * 0.08
        base['current'] *= imbalance
        base['power'] = round(base['voltage'] * base['current'] * base['powerFactor'] / 1000, 2)
        
        return base
    
    def generate_data(self, output_file='energy_monitoring_data.csv', chunk_size=50000):
        print(f"\n🔋 Generating {self.num_machines} machines × {self.duration_days} days")
        print(f"   Estimated: {self.total_samples * self.num_machines:,} records")
        
        machines = []
        for i in range(self.num_machines):
            machine_spec = self.machine_types[i % len(self.machine_types)]
            behavior = 'normal'
            
            if i == 5: behavior = 'error'
            elif i == 12: behavior = 'degrading'
            elif i == 8: behavior = 'harmonic'
            elif i == 15: behavior = 'imbalanced'
            
            machines.append({'id': i, 'spec': machine_spec, 'behavior': behavior})
        
        if os.path.exists(output_file):
            os.remove(output_file)
        
        chunk_data = []
        header_written = False
        
        with tqdm(total=self.total_samples, desc="Progress") as pbar:
            for data_point in range(self.total_samples):
                timestamp = self.start_date + timedelta(seconds=data_point * self.sampling_interval)
                
                for machine in machines:
                    if machine['behavior'] == 'error':
                        data_entry = self.generate_error_machine(machine['id'], machine['spec'], timestamp, data_point)
                    elif machine['behavior'] == 'degrading':
                        data_entry = self.generate_degrading_machine(machine['id'], machine['spec'], timestamp, data_point)
                    elif machine['behavior'] == 'harmonic':
                        data_entry = self.generate_harmonic_machine(machine['id'], machine['spec'], timestamp, data_point)
                    elif machine['behavior'] == 'imbalanced':
                        data_entry = self.generate_imbalanced_machine(machine['id'], machine['spec'], timestamp, data_point)
                    else:
                        data_entry = self.generate_normal_machine(machine['id'], machine['spec'], timestamp, data_point)
                    
                    chunk_data.append(data_entry)
                
                if len(chunk_data) >= chunk_size:
                    pd.DataFrame(chunk_data).to_csv(output_file, mode='a', header=not header_written, index=False)
                    chunk_data = []
                    header_written = True
                
                pbar.update(1)
        
        if chunk_data:
            pd.DataFrame(chunk_data).to_csv(output_file, mode='a', header=not header_written, index=False)
        
        print(f"✅ Done! Saved to {output_file}")

def main():
    parser = argparse.ArgumentParser(description='Generate energy monitoring data')
    parser.add_argument('-m', '--machines', type=int, default=20)
    parser.add_argument('-d', '--days', type=int, default=365)
    parser.add_argument('-i', '--interval', type=int, default=10)
    parser.add_argument('-s', '--start', type=str, default='2024-01-01')
    parser.add_argument('-o', '--output', type=str, default='energy_monitoring_data.csv')
    parser.add_argument('-c', '--chunk', type=int, default=50000)
    
    args = parser.parse_args()
    
    generator = EnergyDataGenerator(args.machines, args.days, args.interval, args.start)
    generator.generate_data(args.output, args.chunk)

if __name__ == '__main__':
    main()

