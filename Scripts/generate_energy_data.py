"""
Energy Consumption Data Generator
Generates realistic multi-source energy consumption data for ML training
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import argparse

class EnergyDataGenerator:
    """Generate realistic energy consumption data for shop floor machines"""
    
    def __init__(self, start_date, days, interval_minutes, num_machines, 
                 include_anomalies=True, anomaly_rate=0.02, include_degradation=True,
                 degradation_rate=0.001, include_seasonal_variation=True,
                 include_maintenance_downtime=True):
        self.start_date = pd.to_datetime(start_date)
        self.days = days
        self.interval_minutes = interval_minutes
        self.num_machines = num_machines
        self.include_anomalies = include_anomalies
        self.anomaly_rate = anomaly_rate
        self.include_degradation = include_degradation
        self.degradation_rate = degradation_rate
        self.include_seasonal_variation = include_seasonal_variation
        self.include_maintenance_downtime = include_maintenance_downtime
        
        # Define machine configurations FIRST
        base_machines = [
            {'id': 'M001', 'name': 'CNC Maschine 1', 'base_load': 15, 'peak_load': 45, 'type': 'CNC'},
            {'id': 'M002', 'name': 'CNC Maschine 2', 'base_load': 18, 'peak_load': 50, 'type': 'CNC'},
            {'id': 'M003', 'name': 'Schweißroboter 1', 'base_load': 8, 'peak_load': 35, 'type': 'Welding'},
            {'id': 'M004', 'name': 'Fördersystem', 'base_load': 5, 'peak_load': 12, 'type': 'Conveyor'},
            {'id': 'M005', 'name': 'Kompressor 1', 'base_load': 20, 'peak_load': 60, 'type': 'Compressor'},
            {'id': 'M006', 'name': 'Lackierroboter', 'base_load': 10, 'peak_load': 30, 'type': 'Painting'},
            {'id': 'M007', 'name': 'Presse 1', 'base_load': 25, 'peak_load': 75, 'type': 'Press'},
            {'id': 'M008', 'name': 'Schweißroboter 2', 'base_load': 8, 'peak_load': 35, 'type': 'Welding'},
            {'id': 'M009', 'name': 'CNC Maschine 3', 'base_load': 16, 'peak_load': 48, 'type': 'CNC'},
            {'id': 'M010', 'name': 'Kompressor 2', 'base_load': 22, 'peak_load': 65, 'type': 'Compressor'},
            {'id': 'M011', 'name': 'Presse 2', 'base_load': 24, 'peak_load': 72, 'type': 'Press'},
            {'id': 'M012', 'name': 'Montagestation 1', 'base_load': 6, 'peak_load': 18, 'type': 'Assembly'},
            {'id': 'M013', 'name': 'Montagestation 2', 'base_load': 6, 'peak_load': 18, 'type': 'Assembly'},
            {'id': 'M014', 'name': 'Ofen 1', 'base_load': 30, 'peak_load': 80, 'type': 'Furnace'},
            {'id': 'M015', 'name': 'Ofen 2', 'base_load': 28, 'peak_load': 75, 'type': 'Furnace'},
            {'id': 'M016', 'name': 'CNC Maschine 4', 'base_load': 17, 'peak_load': 52, 'type': 'CNC'},
            {'id': 'M017', 'name': 'Schleifmaschine', 'base_load': 12, 'peak_load': 35, 'type': 'Grinding'},
            {'id': 'M018', 'name': 'Laserschneider', 'base_load': 20, 'peak_load': 55, 'type': 'Laser'},
            {'id': 'M019', 'name': 'Kühlsystem', 'base_load': 15, 'peak_load': 45, 'type': 'Cooling'},
            {'id': 'M020', 'name': 'Druckluftsystem', 'base_load': 18, 'peak_load': 50, 'type': 'Pneumatic'}
        ]
        
        self.machine_configs = base_machines[:num_machines]
        
        # NOW generate holidays and maintenance (after machine_configs is set)
        self.holidays = self._generate_holidays()
        self.maintenance_schedule = self._generate_maintenance_schedule() if include_maintenance_downtime else []
        
        # Define machine configurations (expandable)
        base_machines = [
            {'id': 'M001', 'name': 'CNC Maschine 1', 'base_load': 15, 'peak_load': 45, 'type': 'CNC'},
            {'id': 'M002', 'name': 'CNC Maschine 2', 'base_load': 18, 'peak_load': 50, 'type': 'CNC'},
            {'id': 'M003', 'name': 'Schweißroboter 1', 'base_load': 8, 'peak_load': 35, 'type': 'Welding'},
            {'id': 'M004', 'name': 'Fördersystem', 'base_load': 5, 'peak_load': 12, 'type': 'Conveyor'},
            {'id': 'M005', 'name': 'Kompressor 1', 'base_load': 20, 'peak_load': 60, 'type': 'Compressor'},
            {'id': 'M006', 'name': 'Lackierroboter', 'base_load': 10, 'peak_load': 30, 'type': 'Painting'},
            {'id': 'M007', 'name': 'Presse 1', 'base_load': 25, 'peak_load': 75, 'type': 'Press'},
            {'id': 'M008', 'name': 'Schweißroboter 2', 'base_load': 8, 'peak_load': 35, 'type': 'Welding'},
            {'id': 'M009', 'name': 'CNC Maschine 3', 'base_load': 16, 'peak_load': 48, 'type': 'CNC'},
            {'id': 'M010', 'name': 'Kompressor 2', 'base_load': 22, 'peak_load': 65, 'type': 'Compressor'},
            {'id': 'M011', 'name': 'Presse 2', 'base_load': 24, 'peak_load': 72, 'type': 'Press'},
            {'id': 'M012', 'name': 'Montagestation 1', 'base_load': 6, 'peak_load': 18, 'type': 'Assembly'},
            {'id': 'M013', 'name': 'Montagestation 2', 'base_load': 6, 'peak_load': 18, 'type': 'Assembly'},
            {'id': 'M014', 'name': 'Ofen 1', 'base_load': 30, 'peak_load': 80, 'type': 'Furnace'},
            {'id': 'M015', 'name': 'Ofen 2', 'base_load': 28, 'peak_load': 75, 'type': 'Furnace'},
            {'id': 'M016', 'name': 'CNC Maschine 4', 'base_load': 17, 'peak_load': 52, 'type': 'CNC'},
            {'id': 'M017', 'name': 'Schleifmaschine', 'base_load': 12, 'peak_load': 35, 'type': 'Grinding'},
            {'id': 'M018', 'name': 'Laserschneider', 'base_load': 20, 'peak_load': 55, 'type': 'Laser'},
            {'id': 'M019', 'name': 'Kühlsystem', 'base_load': 15, 'peak_load': 45, 'type': 'Cooling'},
            {'id': 'M020', 'name': 'Druckluftsystem', 'base_load': 18, 'peak_load': 50, 'type': 'Pneumatic'}
        ]
        
        self.machine_configs = base_machines[:num_machines]
        
        # NOW generate holidays and maintenance (after machine_configs is set)
        self.holidays = self._generate_holidays()
        self.maintenance_schedule = self._generate_maintenance_schedule() if include_maintenance_downtime else []
    
    def _generate_holidays(self):
        """Generate public holidays and factory shutdown periods"""
        year = self.start_date.year
        holidays = []
        
        # German public holidays (simplified)
        holidays.extend([
            pd.Timestamp(f'{year}-01-01'),  # Neujahr
            pd.Timestamp(f'{year}-05-01'),  # Tag der Arbeit
            pd.Timestamp(f'{year}-10-03'),  # Tag der Deutschen Einheit
            pd.Timestamp(f'{year}-12-24'),  # Heiligabend
            pd.Timestamp(f'{year}-12-25'),  # 1. Weihnachtsfeiertag
            pd.Timestamp(f'{year}-12-26'),  # 2. Weihnachtsfeiertag
            pd.Timestamp(f'{year}-12-31'),  # Silvester
        ])
        
        # Summer shutdown (Betriebsferien) - 2 weeks in August
        summer_start = pd.Timestamp(f'{year}-08-01')
        for i in range(14):
            holidays.append(summer_start + pd.Timedelta(days=i))
        
        # Christmas shutdown - last week of year
        christmas_start = pd.Timestamp(f'{year}-12-27')
        for i in range(5):
            holidays.append(christmas_start + pd.Timedelta(days=i))
        
        return set(holidays)
    
    def _generate_maintenance_schedule(self):
        """Generate planned maintenance windows for machines"""
        schedule = []
        
        # Each machine gets quarterly maintenance (4 times per year)
        for machine in self.machine_configs:
            for quarter in range(4):
                # Maintenance in first week of: Jan, Apr, Jul, Oct
                maintenance_month = quarter * 3 + 1
                maintenance_day = np.random.randint(1, 8)  # Random day in first week
                
                maintenance_date = pd.Timestamp(f'{self.start_date.year}-{maintenance_month:02d}-{maintenance_day:02d}')
                
                # Only add if within our simulation period
                if self.start_date <= maintenance_date <= (self.start_date + pd.Timedelta(days=self.days)):
                    schedule.append({
                        'machine_id': machine['id'],
                        'date': maintenance_date,
                        'duration_hours': np.random.randint(4, 12)  # 4-12 hours maintenance
                    })
        
        return schedule
    
    def _is_holiday(self, timestamp):
        """Check if date is a holiday"""
        return timestamp.date() in [h.date() for h in self.holidays]
    
    def _is_maintenance(self, timestamp, machine_id):
        """Check if machine is under maintenance"""
        for maint in self.maintenance_schedule:
            if maint['machine_id'] == machine_id:
                if (timestamp.date() == maint['date'].date() and 
                    0 <= timestamp.hour < maint['duration_hours']):
                    return True
        return False
    
    def _get_seasonal_factor(self, timestamp):
        """Calculate seasonal variation factor for production"""
        day_of_year = timestamp.timetuple().tm_yday
        
        # Lower production in summer (vacation) and end of year
        # Peak production in Q1 and Q3
        seasonal_curve = 1.0 + 0.2 * np.sin((day_of_year - 60) / 365 * 2 * np.pi)
        
        # Reduce in August (summer shutdown nearby)
        if timestamp.month == 8:
            seasonal_curve *= 0.6
        
        # Reduce end of December
        if timestamp.month == 12 and timestamp.day > 20:
            seasonal_curve *= 0.4
        
        return max(0.3, seasonal_curve)  # Never below 30%
        
    def _calculate_temperature(self, timestamp):
        """Simulate seasonal temperature variation"""
        day_of_year = timestamp.timetuple().tm_yday
        # Seasonal variation + daily random variation
        base_temp = 15 + 10 * np.sin((day_of_year / 365) * 2 * np.pi)
        return base_temp + np.random.uniform(-2.5, 2.5)
    
    def _calculate_consumption(self, timestamp, machine, days_elapsed):
        """Calculate realistic consumption based on time, machine type, and degradation"""
        hour = timestamp.hour
        day_of_week = timestamp.dayofweek
        is_weekend = day_of_week >= 5
        is_holiday = self._is_holiday(timestamp)
        is_maintenance = self._is_maintenance(timestamp, machine['id'])
        
        # Factory closed on holidays and most weekends
        is_working_hours = (hour >= 6 and hour < 22 and not is_weekend and not is_holiday)
        
        # Some weekend shifts (20% chance)
        weekend_shift = is_weekend and (6 <= hour < 14) and np.random.random() < 0.2
        if weekend_shift:
            is_working_hours = True
        
        consumption = machine['base_load']
        
        # Under maintenance: minimal power (safety systems only)
        if is_maintenance:
            consumption = machine['base_load'] * 0.05
            return consumption, False, is_weekend, True
        
        # Closed: standby mode
        if is_holiday:
            consumption = machine['base_load'] * 0.1
            return consumption, False, is_weekend, False
        
        if is_working_hours:
            # Apply seasonal production factor
            seasonal_factor = self._get_seasonal_factor(timestamp) if self.include_seasonal_variation else 1.0
            
            # Peak production hours (9-17)
            if 9 <= hour < 17:
                peak_factor = 0.7 + np.random.uniform(0, 0.3)
                peak_factor *= seasonal_factor  # Adjust for season
                consumption = machine['base_load'] + (machine['peak_load'] - machine['base_load']) * peak_factor
            else:
                # Ramp up/down periods
                ramp_factor = 0.3 + np.random.uniform(0, 0.2)
                ramp_factor *= seasonal_factor
                consumption = machine['base_load'] + (machine['peak_load'] - machine['base_load']) * ramp_factor
        else:
            # Standby mode
            consumption = machine['base_load'] * (0.2 + np.random.uniform(0, 0.1))
            
            # Occasional late-night maintenance or cleaning
            if np.random.random() < 0.05:
                consumption = machine['base_load'] * 0.5
        
        # Add realistic noise
        consumption *= (0.95 + np.random.uniform(0, 0.1))
        
        # Apply degradation/regression over time (gradual efficiency loss)
        if self.include_degradation:
            # Consumption increases over time due to wear and tear
            degradation_factor = 1 + (self.degradation_rate * days_elapsed)
            consumption *= degradation_factor
        
        return consumption, is_working_hours, is_weekend, False
    
    def _add_anomaly(self, consumption, machine):
        """Inject anomalies into the data"""
        anomaly_type = np.random.choice(['overload', 'failure', 'partial_failure'])
        
        if anomaly_type == 'overload':
            return machine['peak_load'] * 1.5
        elif anomaly_type == 'failure':
            return machine['base_load'] * 0.1
        else:  # partial_failure
            return machine['peak_load'] * 0.3
    
    def generate(self):
        """Generate the complete dataset"""
        data = []
        
        total_minutes = self.days * 24 * 60
        num_intervals = total_minutes // self.interval_minutes
        
        print(f"Generating data...")
        print(f"  Date range: {self.start_date.date()} to {(self.start_date + timedelta(days=self.days)).date()}")
        print(f"  Interval: {self.interval_minutes} minutes")
        print(f"  Machines: {self.num_machines}")
        print(f"  Total data points: {num_intervals * self.num_machines:,}")
        
        for i in range(num_intervals):
            timestamp = self.start_date + timedelta(minutes=i * self.interval_minutes)
            temperature = self._calculate_temperature(timestamp)
            days_elapsed = (timestamp - self.start_date).days
            
            for machine in self.machine_configs:
                consumption, is_working, is_weekend, is_maintenance = self._calculate_consumption(
                    timestamp, machine, days_elapsed
                )
                
                # Check for anomaly
                is_anomaly = False
                if self.include_anomalies and np.random.random() < self.anomaly_rate:
                    consumption = self._add_anomaly(consumption, machine)
                    is_anomaly = True
                
                # Calculate efficiency (inverse of consumption for same output)
                baseline_consumption = machine['base_load'] + (machine['peak_load'] - machine['base_load']) * 0.8
                efficiency = baseline_consumption / consumption if consumption > 0 else 1.0
                efficiency = min(efficiency, 1.0)  # Cap at 100%
                
                # Get seasonal factor for reporting
                seasonal_factor = self._get_seasonal_factor(timestamp) if self.include_seasonal_variation else 1.0
                
                data.append({
                    'timestamp': timestamp,
                    'machine_id': machine['id'],
                    'machine_name': machine['name'],
                    'machine_type': machine['type'],
                    'consumption_kwh': round(consumption, 3),
                    'efficiency': round(efficiency, 3),
                    'days_in_operation': days_elapsed,
                    'seasonal_factor': round(seasonal_factor, 3),
                    'temperature_celsius': round(temperature, 1),
                    'is_working_hours': is_working,
                    'is_weekend': is_weekend,
                    'is_holiday': self._is_holiday(timestamp),
                    'is_maintenance': is_maintenance,
                    'hour': timestamp.hour,
                    'day_of_week': timestamp.dayofweek,
                    'month': timestamp.month,
                    'anomaly': is_anomaly
                })
            
            # Progress indicator
            if (i + 1) % 1000 == 0:
                progress = (i + 1) / num_intervals * 100
                print(f"  Progress: {progress:.1f}%", end='\r')
        
        print(f"  Progress: 100.0%")
        
        df = pd.DataFrame(data)
        return df
    
    def save(self, df, filename='energy_data.csv'):
        """Save the generated data to CSV"""
        df.to_csv(filename, index=False)
        print(f"\n✓ Data saved to: {filename}")
        
        # Print statistics
        print("\n" + "="*60)
        print("DATASET STATISTICS")
        print("="*60)
        print(f"Total records: {len(df):,}")
        print(f"Date range: {df['timestamp'].min()} to {df['timestamp'].max()}")
        print(f"Machines: {df['machine_id'].nunique()}")
        print(f"Anomalies: {df['anomaly'].sum():,} ({df['anomaly'].sum()/len(df)*100:.2f}%)")
        
        if 'is_holiday' in df.columns:
            holidays_count = df[df['is_holiday']].groupby('timestamp').first()
            print(f"Holidays/Shutdowns: {len(holidays_count)} days")
        
        if 'is_maintenance' in df.columns:
            maint_count = df['is_maintenance'].sum()
            print(f"Maintenance periods: {maint_count:,} data points")
        
        print(f"\nConsumption statistics (kWh):")
        print(df.groupby('machine_id')['consumption_kwh'].describe().round(2))
        
        if self.include_seasonal_variation:
            print(f"\nSeasonal variation:")
            monthly_avg = df.groupby('month')['seasonal_factor'].mean()
            print(monthly_avg.round(3))
        
        print("="*60)
    
    def preview(self, df, n_rows=10):
        """Display a preview of the data"""
        print("\n" + "="*60)
        print(f"DATA PREVIEW (first {n_rows} rows)")
        print("="*60)
        print(df.head(n_rows).to_string(index=False))
        print("="*60)


def main():
    """Main function with CLI interface"""
    parser = argparse.ArgumentParser(
        description='Generate realistic energy consumption data for ML training',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Generate 365 days of data with realistic patterns
  python generate_energy_data.py --days 365 --machines 10 --interval 15
  
  # Generate 7 days without seasonal variation for testing
  python generate_energy_data.py --days 7 --no-seasonal-variation
  
  # Generate with custom anomaly rate and no maintenance
  python generate_energy_data.py --days 90 --anomaly-rate 0.05 --no-maintenance
        """
    )
    
    parser.add_argument('--start-date', type=str, default='2024-01-01',
                       help='Start date (YYYY-MM-DD), default: 2024-01-01')
    parser.add_argument('--days', type=int, default=30,
                       help='Number of days to generate, default: 30')
    parser.add_argument('--interval', type=int, default=1,
                       choices=[1, 5, 10, 15, 30, 60],
                       help='Interval in minutes, default: 1')
    parser.add_argument('--machines', type=int, default=5,
                       help='Number of machines (1-20), default: 5')
    parser.add_argument('--no-anomalies', action='store_true',
                       help='Disable anomaly generation')
    parser.add_argument('--anomaly-rate', type=float, default=0.02,
                       help='Anomaly rate (0.0-1.0), default: 0.02')
    parser.add_argument('--no-degradation', action='store_true',
                       help='Disable efficiency degradation over time')
    parser.add_argument('--degradation-rate', type=float, default=0.001,
                       help='Daily degradation rate (0.0-0.01), default: 0.001')
    parser.add_argument('--no-seasonal-variation', action='store_true',
                       help='Disable seasonal production variations')
    parser.add_argument('--no-maintenance', action='store_true',
                       help='Disable planned maintenance schedules')
    parser.add_argument('--output', type=str, default='energy_data.csv',
                       help='Output filename, default: energy_data.csv')
    parser.add_argument('--preview', type=int, default=10,
                       help='Number of preview rows, default: 10')
    
    args = parser.parse_args()
    
    # Create generator
    generator = EnergyDataGenerator(
        start_date=args.start_date,
        days=args.days,
        interval_minutes=args.interval,
        num_machines=args.machines,
        include_anomalies=not args.no_anomalies,
        anomaly_rate=args.anomaly_rate,
        include_degradation=not args.no_degradation,
        degradation_rate=args.degradation_rate,
        include_seasonal_variation=not args.no_seasonal_variation,
        include_maintenance_downtime=not args.no_maintenance
    )
    
    # Generate data
    df = generator.generate()
    
    # Preview
    generator.preview(df, n_rows=args.preview)
    
    # Save
    generator.save(df, filename=args.output)
    
    print(f"\n✓ Generation complete! Use '{args.output}' for ML training.")


if __name__ == "__main__":
    # If no arguments provided, run with defaults
    import sys
    if len(sys.argv) == 1:
        print("Running with default parameters...")
        print("Use --help to see all options\n")
        generator = EnergyDataGenerator(
            start_date='2024-01-01',
            days=365,
            interval_minutes=15,
            num_machines=5,
            include_anomalies=True,
            anomaly_rate=0.02,
            include_degradation=True,
            degradation_rate=0.001,
            include_seasonal_variation=True,
            include_maintenance_downtime=True
        )
        df = generator.generate()
        generator.preview(df, n_rows=10)
        generator.save(df, filename='energy_data.csv')
    else:
        main()

