@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PY="
where python >nul 2>nul && set "PY=python"
if not defined PY ( where py >nul 2>nul && set "PY=py" )
if not defined PY (
  if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" set "PY=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
)
if not defined PY (
  echo.
  echo   [X] 没有检测到 Python。
  echo       到 https://www.python.org/downloads/ 装一个，安装时勾选 "Add python.exe to PATH"。
  echo.
  pause
  exit /b 1
)

"%PY%" new-post.py %*
echo.
pause
