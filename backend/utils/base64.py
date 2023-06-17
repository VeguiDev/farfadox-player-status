import base64


def Base64Encode(text: str):

    string_bytes = text.encode("ascii")

    base64_bytes = base64.b64encode(string_bytes)
    return base64_bytes.decode("ascii")
