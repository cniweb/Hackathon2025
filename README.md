# Hackathon2025

Future Systems Dashboard + data-generating scripts used during Hackathon 2025.

## Repository Structure

- `Scripts/`: Python utilities to generate and view energy-related CSV data
  - `generate_energy_data.py`, `rms_value_generator.py`, `sinus_generator_3ph.py`
  - `csv_viewer.py`, `csv_viewer_motorstart.py`, `energy_data.csv`
- `Web/`: Frontend dashboards
  - `future_systems_dashboard/`: Vite + React + TypeScript app

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+

## Quick Start (Web)

Install dependencies and run the Vite app:

```bash
# From repo root
pushd Web/future_systems_dashboard
npm install
npm run dev
# Open the local URL shown by Vite, e.g. http://localhost:5173
popd
```

Build for production:

```bash
pushd Web/future_systems_dashboard
npm run build
# Output in Web/future_systems_dashboard/dist
popd
```

## Quick Start (Scripts)

Create a virtual environment and run data generators:

```bash
# From repo root
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt  # if present; otherwise ensure stdlib-only scripts

# Generate sample energy data
pushd Scripts
python3 generate_energy_data.py
python3 rms_value_generator.py
python3 sinus_generator_3ph.py
popd
```

CSV viewer utilities:

```bash
pushd Scripts
python3 csv_viewer.py
python3 csv_viewer_motorstart.py
popd
```

## Development Notes

- TypeScript settings in `future_systems_dashboard/tsconfig.json` are tuned for rapid iteration. Re-enable strict checks if you prefer tighter typing.
- Large bundle warning: consider code-splitting via dynamic `import()` in the Vite app.

## Scripts/Data

- Generated CSV files in `Scripts/` are ignored by Git (`Scripts/*.csv`).

## License

Internal hackathon project; consult your team before external publication.
