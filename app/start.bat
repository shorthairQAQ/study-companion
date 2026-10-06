@echo off
chcp 65001 >nul
cd /d %~dp0
echo.
echo   正在启动本地服务器，请稍等...
echo.
start "" /b node server.js
timeout /t 2 /nobreak >nul
start "" http://localhost:8080
echo   ✅ 浏览器已打开 http://localhost:8080
echo   ⚠️  不要关掉这个窗口，关掉服务器就停了。
echo.
pause >nul
