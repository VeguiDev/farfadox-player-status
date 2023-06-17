from fastapi import FastAPI, Response, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth
from .services import AuthService
from .api import users

router = APIRouter(prefix="/api")

router.include_router(auth.router)

authService = AuthService()


@router.get("/")
def index():
    return "hello world"


@router.get("/status", status_code=200)
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


app = FastAPI()

origins = ["http://localhost:8000", "http://localhost:5173"]

app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
