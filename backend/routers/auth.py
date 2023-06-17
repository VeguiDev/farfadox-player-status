from fastapi import APIRouter, Response, status
from fastapi.responses import RedirectResponse
from ..api.oauth import requestAccessToken
from ..config import token_scope

from ..config import client_id
from ..services import AuthService

router = APIRouter(prefix="/auth", tags=["authentication"])

authService = AuthService()


@router.get("/")
async def getAuthInfo():
    if authService.isLoggedIn():
        user = await authService.validateAuthData()

        if not user == False:
            return {"user": user, "logged": True}

    return {"user": None, "logged": False}


@router.get("/oauth")
def redirectToAuthorization():
    scope = token_scope

    return RedirectResponse(
        "https://accounts.spotify.com/authorize?response_type=code&client_id="
        + client_id
        + "&scope="
        + scope
        + "&redirect_uri=http://localhost:8000/auth/response&state=state"
    , 301)


@router.get("/response", status_code=200)
async def getAccessToken(code: str | None, state: str, error: str | None = None, response:Response):
    if error != None:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": error}

    login = await authService.login(code)

    if login == True:
        return {"success": True, "message": "Successfully loggedin!"}

    response.status_code = status.HTTP_400_BAD_REQUEST
    return {"success": False, "message": "Error during login process!"}


@router.delete("/auth")
async def logout():
    if await authService.logout():
        return {"success": True, "message": "Successfully logged out!"}
    
    response.status_code = status.HTTP_400_BAD_REQUEST
    return {"success": False, "message": "You aren't logged in!"}
