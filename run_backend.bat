@echo off

cd frontend

call npm install

call npm run build

cd ..

call ./backend/env/Scripts/activate.bat

call pip install -r ./backend/requirements.txt

call hypercorn backend.main:app --bind localhost:8000