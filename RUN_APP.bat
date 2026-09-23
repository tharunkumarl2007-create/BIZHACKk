@echo off
title WARRANTY+ Launcher
echo ========================================================
echo Starting WARRANTY+ Web Application...
echo ========================================================
set PATH=C:\Users\AMD\AppData\Local\Programs\nodejs;%PATH%
start http://localhost:5173
npm run dev
pause
