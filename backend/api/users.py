import urllib3

apiEndpoint = "https://api.spotify.com/v1"


async def getCurrentUser(access_token: str):
    headers = urllib3.HTTPHeaderDict()

    headers.add("accept", "application/json")
    headers.add("Authorization", "Bearer " + access_token)
    headers.add("Content-Type", "application/json")

    return urllib3.request("GET", url=apiEndpoint + "/me", headers=headers)


async def getPlayerStatus(access_token: str):
    headers = urllib3.HTTPHeaderDict()

    headers.add("accept", "application/json")
    headers.add("Authorization", "Bearer " + access_token)
    headers.add("Content-Type", "application/json")

    return urllib3.request("GET", url=apiEndpoint + "/me/player", headers=headers)
