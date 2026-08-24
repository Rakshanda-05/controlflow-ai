#!/bin/bash
echo "========================================================"
echo "  ControlFlow AI — Intelligent Finance Controller"
echo "========================================================"
echo ""
echo "Installing dependencies..."
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
echo ""
echo "Starting Backend API (Port 5000) and Frontend (Port 3000)..."
npm run dev
