from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from ..api.oauth import requestAccessToken
from ..config import token_scope

from ..config import client_id

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.get("/")
def getAuthInfo():
    return {"user": None}


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

    resp = await requestAccessToken(code)

    print(resp.status)

    return resp.json()
