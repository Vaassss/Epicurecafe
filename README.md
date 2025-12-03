
  # Cafe Loyalty Program Website

Production-ready Vite + React app using SWC. Built output is in dist. Use Node 18+ locally for maximum compatibility.

## Scripts
- dev: vite
- build: vite build

## Local Setup
1. npm install
2. npm run dev
3. npm run build

## Deploy to Vercel
- vercel.json is configured to use @vercel/static-build with distDir set to "dist".
- In Vercel project settings:
  - Framework: Other
  - Build Command: npm run build
  - Output Directory: dist

## Static hosting
Serve the dist directory with any static host.
  