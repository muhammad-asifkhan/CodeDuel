@echo off
set "ROOT=%~dp0"
cd /d "%ROOT%"
echo Starting CodeDuel backend and frontend...
start "CodeDuel Backend" cmd /k "cd /d ""%ROOT%backend"" && npm run dev"
ping 127.0.0.1 -n 3 >nul
start "CodeDuel Frontend" cmd /k "cd /d ""%ROOT%frontend"" && npm run dev"
echo Done. Two windows should open (backend :3001, frontend Vite).
