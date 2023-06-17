import time
from ..store import AuthStore
from ..api import oauth, users


class AuthService:
    def __init__(self):
        self.authData = AuthStore()

        self.authData.load()

    def tokenExpired(self):
        if self.authData.access_token != None and self.authData.expires_at != None:
            return time.time() > self.authData.expires_at

        return False

    async def tryRefreshAuthData(self):
        resp = await oauth.requestAccessTokenByRefreshToken(self.authData.refresh_token)

        if resp.status == 200:
            data = resp.json()

            self.authData.refresh(data)

            return True

        print("Auth data invalidated, cleaning!")

        self.authData.refresh(None)
        return False

    async def validateAuthData(self):
        if not self.authData.refresh_token == None:
            if self.tokenExpired():
                if not self.tryRefreshAuthData():
                    return False

            resp = await users.getCurrentUser(self.authData.access_token)

            if resp.status == 200:
                return resp.json()

            self.authData.refresh(None)
            return False

    def isLoggedIn(self):
        auth = self.authData

        return auth.access_token != None and auth.refresh_token != None

    async def login(self, code: str):
        resp = await oauth.requestAccessToken(code)

        if resp.status == 200:
            data = resp.json()
            print(data)
            self.authData.refresh(data)

            return True

        return False

    async def logout(self):
        if self.isLoggedIn():
            self.auth.refresh(null)
            return True

        return False

    async def getValidAccessToken(self):
        if not self.tokenExpired():
            return self.authData.access_token

        if not await self.tryRefreshAuthData():
            return None

        return self.authData.access_token
