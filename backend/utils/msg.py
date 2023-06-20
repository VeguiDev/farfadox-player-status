import json


def sendMessageToOBS(message):
    print("[[MSG_LINE]]:" + json.dumps(message))
