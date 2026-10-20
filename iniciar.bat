@echo off
setlocal
title Logic Paint
cd /d "%~dp0"

if not exist backend\.env copy backend\.env.example backend\.env >nul
if not exist Frontend\.env copy Frontend\.env.example Frontend\.env >nul

if not exist backend\node_modules (
  echo Instalando dependencias del backend...
  pushd backend
  call npm install
  popd
)
if not exist Frontend\node_modules (
  echo Instalando dependencias del frontend...
  pushd Frontend
  call npm install
  popd
)

echo Inicializando base de datos (MySQL debe estar encendido)...
pushd backend
call npm run db:init
if errorlevel 1 echo [AVISO] No se pudo inicializar la base de datos. Revisa backend\.env y que MySQL este activo.
popd

start "Logic Paint - API" cmd /k "cd /d ""%~dp0backend"" && npm run dev"
start "Logic Paint - Web" cmd /k "cd /d ""%~dp0Frontend"" && npm run dev"
timeout /t 5 >nul
start http://localhost:5173
endlocal
