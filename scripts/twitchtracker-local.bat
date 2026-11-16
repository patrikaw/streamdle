@echo off
cd /d "%~dp0.."
python scripts\twitchtracker.py --write --visible
echo.
echo Listo. Revisa scripts\ultimo-reporte-tt.md y hace commit de data\streamers.js
pause
