import json
from io import open


def saveFile(data, filepath: str):
    file = open(filepath, "w")

    file.write(json.dumps(data))

    file.close()


def loadFile(filepath: str):
    file = open(filepath, "r")

    rawData = file.read()

    if rawData == "":
        return None

    return json.loads(rawData)
