@echo off
chcp 65001 >nul
cd /d %~dp0
echo.
echo   正在启动本地服务器，浏览器会自动打开...
echo.
node server.js
echo.
echo   服务器已停止。
pause >nul
