@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Ochiko app (web) - ene tsonhiig bitgii haa
if not exist node_modules call npm install
echo.
echo  Ochiko app brauzer deer neegdene: http://localhost:8081
echo  Utasnii hemjeegeer harah: F12 darj, daraa Ctrl+Shift+M
echo.
call npx expo start --web
pause
