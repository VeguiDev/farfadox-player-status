import os
import pickle
import time


class AuthStore:
    filepath = os.path.join(os.getcwd(), "data", "auth.data")

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
        return os.path.dirname(self.filepath)

    def save(self):
        if self.existsDataFolder() == False:
            os.mkdir(self.getFolderPath())

        try:
            with open(self.filepath, "wb") as f:
                data = self

                del data.filepath

                pickle.dump(data, f, protocol=pickle.HIGHEST_PROTOCOL)
        except Exception as ex:
            print("Error saving auth data:", ex)

    def refresh(self, data):
        if not data == None:
            self.access_token = data["access_token"]
            self.refresh_token = data["refresh_token"]
            self.expires_at = time.time() + data["expires_in"]
        else:
            self.access_token = None
            self.refresh_token = None
            self.expires_at = None

        self.save()

    def loadFromRaw(self, raw):
        self.access_token = raw.access_token
        self.refresh_token = raw.refresh_token
        self.expires_at = raw.expires_at

    def load(self):
        if self.existsDataFolder() == False:
            os.mkdir(self.getFolderPath())

        if not os.path.exists(self.filepath):
            self.save()
        else:
            try:
                with open(self.filepath, "rb") as f:
                    self.loadFromRaw(pickle.load(f))
            except Exception as ex:
                print("Error during unpickling object (Possibly unsupported):", ex)
