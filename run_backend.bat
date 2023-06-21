@echo off

cd frontend

call npm install

call npm run build

cd ../api

call npm install

call npm run build

call npm start