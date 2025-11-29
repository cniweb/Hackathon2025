import zipfile
import os

# Der Dateiname für den Export
ZIP_FILENAME = "future_systems_dashboard.zip"

# --- KONFIGURATIONSDATEIEN ---

package_json = """{
  "name": "future-systems-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0",
    "recharts": "^2.10.3",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0"
  }
}"""

tsconfig_json = """{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}"""

tsconfig_node_json = """{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}"""

vite_config_ts = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})"""

tailwind_config_js = """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}"""

postcss_config_js = """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}"""

index_html = """<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Future Systems | Energy Monitoring</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>"""

index_css = """@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-slate-50 text-slate-900;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
"""

main_tsx = """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)"""

# PLATZHALTER FÜR APP.TSX
# (Der User fügt den Code hier manuell ein)
app_tsx = """
import React from 'react';

export default function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Future Systems Setup</h1>
        <p className="text-slate-600">
            Das Projekt wurde erfolgreich generiert.<br/>
            Bitte kopiere nun den vollständigen Dashboard-Code aus dem Chat<br/>
            in die Datei: <code>src/App.tsx</code>
        </p>
      </div>
    </div>
  );
}
"""

# --- ZIP ERSTELLUNG ---

files = {
    "package.json": package_json,
    "tsconfig.json": tsconfig_json,
    "tsconfig.node.json": tsconfig_node_json,
    "vite.config.ts": vite_config_ts,
    "tailwind.config.js": tailwind_config_js,
    "postcss.config.js": postcss_config_js,
    "index.html": index_html,
    "src/index.css": index_css,
    "src/main.tsx": main_tsx,
    "src/App.tsx": app_tsx
}

def create_zip():
    print(f"Erstelle {ZIP_FILENAME}...")
    with zipfile.ZipFile(ZIP_FILENAME, 'w') as zipf:
        for path, content in files.items():
            # Schreibe den Inhalt in die Datei im Zip-Archiv
            zipf.writestr(path, content)
            print(f"  - {path} hinzugefügt")
    
    print("\nFERTIG! Die Datei wurde erstellt.")
    print("Anleitung:")
    print("1. Entpacke die ZIP-Datei.")
    print("2. Öffne den Ordner im Terminal.")
    print("3. Führe 'npm install' aus.")
    print("4. Kopiere den Dashboard-Code aus dem Chat in 'src/App.tsx'.")
    print("5. Starte mit 'npm run dev'.")

if __name__ == "__main__":
    create_zip()