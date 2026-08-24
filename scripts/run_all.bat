@echo off
echo ========================================================
echo   ControlFlow AI — Intelligent Finance Controller
echo ========================================================
echo.
echo Installing dependencies...
call npm install
cd server && call npm install && cd ..
cd client && call npm install && cd ..
echo.
echo Starting Backend API (Port 5000) and Frontend (Port 3000)...
npm run dev
