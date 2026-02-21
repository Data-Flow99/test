@echo off
setlocal

REM 依赖：Python 3 + pyinstaller
pyinstaller --onefile --name android-packager android_packager.py

echo.
echo EXE 已生成：dist\android-packager.exe
endlocal
