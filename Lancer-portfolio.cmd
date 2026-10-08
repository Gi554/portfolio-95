@echo off
cd /d "%~dp0"
title Portfolio 95 - Serveur local
echo.
echo Ouvre http://127.0.0.1:5173/ dans ton navigateur.
echo Pour arreter le serveur : Ctrl+C ou fermer cette fenetre.
echo.
call npm start
pause
