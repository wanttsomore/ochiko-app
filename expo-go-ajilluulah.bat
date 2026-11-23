@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Ochiko app - Expo Go (ene tsonhiig bitgii haa)
if not exist node_modules call npm install
echo.
echo  Utasnii Expo Go-oor doorh QR-iig unshuulna (utas, kompyuter neg Wi-Fi-d baih yostoi)
echo.
call npx expo start --clear --port 8088
pause
