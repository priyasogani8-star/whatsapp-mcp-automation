@echo off
title WhatsApp for Claude - Setup
color 0A

echo.
echo  =====================================================
echo   WhatsApp for Claude - Setup
echo  =====================================================
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Node.js is not installed.
    echo.
    echo  Please install Node.js first:
    echo  1. Go to https://nodejs.org
    echo  2. Click the big green "LTS" button to download
    echo  3. Run the installer, click Next through all steps
    echo  4. Come back and double-click this setup file again
    echo.
    pause
    exit /b 1
)

:: Check Python / uv
uv --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] uv (Python package manager) is not installed.
    echo.
    echo  Please install uv:
    echo  1. Open a new terminal window (search "cmd" in Start Menu)
    echo  2. Paste this command and press Enter:
    echo     winget install --id=astral-sh.uv -e
    echo  3. Close the terminal, come back and run this setup again
    echo.
    pause
    exit /b 1
)

echo  [1/3] Installing automation tools...
call npm install --silent
if %errorlevel% neq 0 (
    echo  [!] npm install failed. Check your internet connection and try again.
    pause
    exit /b 1
)

echo  [2/3] Creating data folder...
if not exist "%USERPROFILE%\.whatsapp-mcp" mkdir "%USERPROFILE%\.whatsapp-mcp"

echo  [3/3] Setup complete!
echo.
echo  =====================================================
echo   Next steps:
echo  =====================================================
echo.
echo  1. Start the WhatsApp bridge:
echo     Double-click whatsapp-bridge.exe
echo     (Scan the QR code with your phone the first time)
echo.
echo  2. Add this to your Claude settings (see README.md
echo     for the exact config block to copy and paste):
echo.
echo     "whatsapp": {
echo       "command": "node",
echo       "args": ["%CD%\combined-server.js"]
echo     }
echo.
echo  3. Restart Claude. You are ready!
echo.
pause
