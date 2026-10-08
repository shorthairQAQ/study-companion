@echo off
rem 伴学 · AI 学习空间 —— 一键启动（本文件编码 GBK/cp936、换行 CRLF，别用编辑器另存成 UTF-8）
title 伴学 - AI 学习空间（本地服务器）
cd /d "%~dp0"

echo.
echo   ==========================================
echo     伴学 - AI 学习空间  ^(本地服务器^)
echo   ==========================================
echo.

set "NODE="

where node >nul 2>nul
if not errorlevel 1 set "NODE=node"

if not defined NODE if exist "%ProgramFiles%\nodejs\node.exe" set "NODE=%ProgramFiles%\nodejs\node.exe"
if not defined NODE if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "NODE=%ProgramFiles(x86)%\nodejs\node.exe"
if not defined NODE if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "NODE=%LOCALAPPDATA%\Programs\nodejs\node.exe"

rem 兜底：本机别处自带一份 node 的情况（例如编辑器、工具链）
if not defined NODE (
  for /d %%D in ("%USERPROFILE%\.dsh\dsh-runtimes\*") do (
    if not defined NODE if exist "%%~fD\dependencies\node\bin\node.exe" set "NODE=%%~fD\dependencies\node\bin\node.exe"
  )
)

if not defined NODE (
  echo   [X] 没有检测到 Node.js
  echo.
  echo   这台电脑还没装 Node.js^，所以起不了本地服务器。
  echo   两个办法^，任选一个：
  echo.
  echo     办法一（最省事）：直接双击本目录下的 index.html
  echo                       一样能用^，只是调 API 时个别浏览器会拦跨域。
  echo.
  echo     办法二：去 https://nodejs.org 下载 LTS 版装上^，再双击本文件。
  echo.
  echo   按任意键关闭这个窗口...
  pause >nul
  exit /b 1
)

echo   正在启动服务器^，默认端口 8765 ^(被占用会自动顺延^)...
echo   浏览器会自动打开^，这个黑窗口不要关^，关了服务就停了。
echo.

"%NODE%" server.js

echo.
echo   [X] 服务器退出了^，请把上面的报错截图给队友。
echo   按任意键关闭这个窗口...
pause >nul
