@echo off

echo [WRAPPER] * Checking for updates!

call node update_checker.js
IF %ERRORLEVEL% == 0 goto run_server
IF %ERRORLEVEL% == 2 goto update_runner
exit


:run_server

echo [WRAPPER] * Preparing to run server

cd frontend

echo [WRAPPER] * Installing frontend deps

call npm install

echo [WRAPPER] * Building frontend

call npm run build

cd ../api

echo [WRAPPER] * Installing API deps

call npm install

echo [WRAPPER] * Building API

call npm run build

echo [WRAPPER] * Running API

call npm start

echo [WRAPPER] * Exiting
exit

:update_runner
echo [WRAPPER] * Updating runner!
call run_backend
exit
