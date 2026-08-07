@echo off

echo ================================
echo   ClearTax Success Report Tool
echo ================================
echo.

echo Starting local server...
start /min cmd /c "npx http-server >nul 2>&1"

timeout /t 3 >nul

echo Generating reports...
node generate.js

echo.
echo ================================
echo Reports generated successfully!
echo Check the OUTPUT folder.
echo ================================
echo.

pause