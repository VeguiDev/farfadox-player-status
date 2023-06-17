from fastapi import FastAPI, Response, status
from .routers import auth
from .services import AuthService
from .api import users

app = FastAPI()

app.include_router(auth.router)

authService = AuthService()


@app.get("/")
def index():
    return "hello world"


@app.get("/status", status_code=200)
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
