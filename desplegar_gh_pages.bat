@echo off
setlocal
title Desplegar Logic Paint a GitHub Pages
cd /d "%~dp0"

echo ====================================================
echo   Desplegando Logic Paint a GitHub Pages...
echo ====================================================

pushd Frontend
call npm run deploy
popd

echo.
echo ====================================================
echo   Despliegue finalizado con exito!
echo   Tu juego estara disponible en tu enlace de GitHub Pages.
echo ====================================================
pause
endlocal
