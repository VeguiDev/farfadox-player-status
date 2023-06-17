import os
import pickle
import time
from . import JsonStore

authFilePath = os.path.join(os.getcwd(), "data", "auth.data")


class AuthStore:
    def __init__(
        self,
        access_token: str | None = None,
        expires_at: str | None = None,
        refresh_token: str | None = None,
    ):
        self.access_token = access_token
        self.expires_at = expires_at
        self.refresh_token = refresh_token

    def existsDataFolder(self):
        return os.path.exists(self.getFolderPath())

    def getFolderPath(self):
        return os.path.dirname(authFilePath)

    def save(self):
        if self.existsDataFolder() == False:
            os.mkdir(self.getFolderPath())

        try:
            data = self

            print(data)

            JsonStore.saveFile(data.__dict__, authFilePath)
        except Exception as ex:
            print("Error saving auth data:", ex)

    def refresh(self, data):
        if data != None:
            self.access_token = data["access_token"]

            if data["refresh_token"] != None:
                self.refresh_token = data["refresh_token"]

            self.expires_at = time.time() + data["expires_in"]
        else:
            self.access_token = None
            self.refresh_token = None
            self.expires_at = None

        self.save()

    def loadFromRaw(self, raw):
        if raw == None:
            return

        self.access_token = raw["access_token"]
        self.refresh_token = raw["refresh_token"]
        self.expires_at = raw["expires_at"]

    def load(self):
        if self.existsDataFolder() == False:
            os.mkdir(self.getFolderPath())

        if not os.path.exists(authFilePath):
            self.save()
        else:
            try:
                raw = JsonStore.loadFile(authFilePath)

                if not raw == None:
                    self.loadFromRaw(raw)
            except Exception as ex:
                print("Error during unpickling object (Possibly unsupported):", ex)
