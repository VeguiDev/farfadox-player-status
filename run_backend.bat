@echo off

cd frontend

call npm install

call npm run build

cd ..

call ./backend/env/Scripts/activate.bat

pip install -r ./backend/requirements.txt

uvicorn backend.main:app
