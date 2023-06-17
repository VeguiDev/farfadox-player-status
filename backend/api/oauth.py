import urllib3
import urllib.parse
from ..utils.base64 import Base64Encode
from ..config import client_id, client_secret

apiEndpoint = "https://accounts.spotify.com/api/token"

http = urllib3.PoolManager()


async def requestAccessToken(code: str):
    headers = urllib3.HTTPHeaderDict()

    headers.add("accept", "application/json")
    headers.add(
        "Authorization", "Basic " + Base64Encode(client_id + ":" + client_secret)
    )
    headers.add("Content-Type", "application/x-www-form-urlencoded")

    payload = urllib.parse.urlencode(
        {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": "http://localhost:8000/api/auth/response",
        }
    )

    return http.request("POST", apiEndpoint, body=payload, headers=headers)


async def requestAccessTokenByRefreshToken(refresh_token: str):
    headers = urllib3.HTTPHeaderDict()

    headers.add("accept", "application/json")
    headers.add(
        "Authorization", "Basic " + Base64Encode(client_id + ":" + client_secret)
    )
    headers.add("Content-Type", "application/x-www-form-urlencoded")

    payload = urllib.parse.urlencode(
        {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "redirect_uri": "http://localhost:8000/auth/response",
        }
    )

    return http.request("POST", apiEndpoint, body=payload, headers=headers)
