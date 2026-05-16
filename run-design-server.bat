@echo off
REM Sermon Skills Dashboard - dev server launcher
REM Works from anywhere (Desktop, Start Menu, etc.)
REM If you move the project folder, edit PROJECT_DIR below.

setlocal
set "PROJECT_DIR=D:\Download_AI\Gitgub\cys-claude-sermon-skills\web"

if not exist "%PROJECT_DIR%" (
    echo [error] Project folder not found: %PROJECT_DIR%
    echo         Open this .bat file and fix the PROJECT_DIR line.
    pause
    exit /b 1
)

cd /d "%PROJECT_DIR%"

if not exist "node_modules" (
    echo [setup] node_modules not found. Running npm install...
    call npm install
    if errorlevel 1 (
        echo [error] npm install failed.
        pause
        exit /b 1
    )
)

if not exist ".env.local" (
    if exist ".env.example" (
        echo [setup] .env.local missing - copying from .env.example
        copy /Y ".env.example" ".env.local" >nul
    )
)

echo.
echo ============================================================
echo  Sermon Skills Dashboard - dev server
echo  URL: http://localhost:3000
echo  Press Ctrl+C to stop.
echo ============================================================
echo.

REM Auto-open Chrome to the dashboard after the server warms up.
start "open-chrome" /MIN cmd /c "timeout /t 6 /nobreak >nul && (start chrome --new-window http://localhost:3000 || start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" http://localhost:3000 || start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" http://localhost:3000 || start http://localhost:3000)"

call npm run dev

endlocal
