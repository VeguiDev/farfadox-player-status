from fastapi import APIRouter
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
    )


@router.get("/response")
async def getAccessToken(code: str | None, state: str, error: str | None = None):
    if error != None:
        return {"error": error}

    login = await authService.login(code)

    if login == True:
        return {"success": True, "message": "Successfully loggedin!"}

    return {"success": False, "message": "Error during login process!"}
