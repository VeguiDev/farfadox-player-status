import os
import pickle


class AuthStore:
    def __init__(
        self,
        access_token: str | None,
        expires_at: str | None,
        refresh_token: str | None,
    ):
        self.filepath = os.path.join(os.getcwd(), "data", "auth.data")

        self.access_token = access_token
        self.expires_at = expires_at
        self.refresh_token = refresh_token

    def existsDataFolder(self):
        return os.path.exists(self.getFolderPath())

    def getFolderPath(self):
        return os.path.dirname(self.filepath)

    def save(self):
        if existsDataFolder() == False:
            os.mkdir(self.getFolderPath())

        try:
            with open(self.filepath, "wb") as f:
                pickle.dump(self, f, protocol=pickle.HIGHEST_PROTOCOL)
        except Exception as ex:
            print("Error saving auth data:", ex)

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
                with open(filename, "rb") as f:
                    self.loadFromRaw(pickle.load(f))
            except Exception as ex:
                print("Error during unpickling object (Possibly unsupported):", ex)
