@echo off
cd /d "%~dp0"
echo === Event Horizon deploy ===
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Download the LTS version from https://nodejs.org , install it, then run this file again.
  pause
  exit /b 1
)
call npm install
if errorlevel 1 goto fail
echo.
echo If a browser opens, log in to Netlify. If asked, choose "Link this directory to an existing site" and pick your site.
echo.
call npx --yes netlify-cli@17 deploy --build --prod
if errorlevel 1 goto fail
echo.
echo DONE. The new version is live.
pause
exit /b 0
:fail
echo.
echo Something went wrong. Copy the text above and send it to Claude.
pause
exit /b 1
