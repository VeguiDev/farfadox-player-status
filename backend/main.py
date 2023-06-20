from fastapi import FastAPI, Response, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .routers import auth
from .services import AuthService
from .api import users
from os import path
from .utils import msg

authService = AuthService()


app = FastAPI()

origins = ["http://localhost:8000", "http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dirname = path.dirname(path.realpath(__file__))
staticDir = path.join(dirname, "..", "frontend", "dist")


@app.get("/api/status", status_code=200)
async def getCurrentStatus(response: Response):
    accessToken = await authService.getValidAccessToken()

    if not accessToken:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "not_logged", "message": "You aren't logged in!"}

    resp = await users.getPlayerStatus(accessToken)

    if resp.status == 200:
        return resp.json()

    if resp.status == 204:
        return {"status": "not_playing"}

    return {
        "error": "error_obtaining_player_status",
        "message": "Exception occurred when try to obtain player status!",
    }


app.include_router(auth.router, prefix="/api")

app.mount("/", StaticFiles(directory=staticDir))


@app.exception_handler(404)
async def not_found(request, ex):
    return FileResponse(path.join(staticDir, "index.html"))


@app.on_event("startup")
async def startup_event():
    msg.sendMessageToOBS(
        {"type": "READY", "data": {"isLogged": authService.isLoggedIn()}}
    )
