@echo off
chcp 65001 >nul
title 伴学 - 本地服务器
cd /d %~dp0

echo.
echo   ================================
echo      伴学 · AI 学习空间
echo   ================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo   [!] 没有检测到 Node.js
  echo.
  echo   你有两个选择：
  echo.
  echo   方式一（最简单）：直接双击 index.html
  echo            功能基本一样，只是部分浏览器
  echo            对本地文件的网络请求限制更严。
  echo.
  echo   方式二（推荐）：装一个 Node.js
  echo            去 https://nodejs.org 下载 LTS 版，
  echo            一路下一步装完，再双击本文件即可。
  echo.
  pause
  exit /b 1
)

echo   正在启动本地服务器，浏览器会自动打开...
echo.
node server.js

echo.
echo   服务器已停止。
pause >nul
