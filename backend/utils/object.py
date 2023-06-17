def keyExists(key: str, obj):
    if obj == None:
        return False

    objKeys = obj.keys()

    if key in objKeys:
        if obj[key] == None:
            return False

        return True

    return False
