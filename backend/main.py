from flask import Flask, request, g
from flask_cors import CORS
from db import initDB, getDB
import re

app = Flask(__name__)
CORS(app)

@app.route("/publicworlds", methods=["GET"])
def getWorlds():
    cursor = getDB().cursor()
    cursor.execute("SELECT Name FROM Worlds WHERE IsPublic;")

    return {"worlds": [data[0] for data in cursor]}

@app.route("/getdesc", methods=["GET"])
def getDesc():
    cursor = getDB().cursor()
    cursor.execute("SELECT Description FROM Worlds WHERE Name=%s;", (request.args["name"].strip(),))

    res = list(cursor)
    if not res:
        return {"notFound": True}
    else:
        return {"desc": res[0][0]}
    
MIN_NAME_LENGTH = 5
MAX_NAME_LENGTH = 20
MAX_DESC_LENGTH = 200
MAX_CHAR_LENGTH = 20
REGEX = r"^[a-zA-Z0-9,;.:\-_#'+*~´`?\\}=\])[({/&%$§\"!^°<>| ]*$"

@app.route("/create", methods=["POST"])
def createWorld():
    data = request.json
    name, desc, isPublic, characters = data["name"].strip(), data["desc"].strip(), data["isPublic"], [c.strip() for c in data["characters"]]
    lCharacters = [c.lower() for c in characters]
    if len(name) < MIN_NAME_LENGTH or len(name) > MAX_NAME_LENGTH or len(desc) > MAX_DESC_LENGTH or not re.search(REGEX, name) or not re.search(REGEX, desc) or len(characters) < 2 or any([not c or len(c) > MAX_CHAR_LENGTH or not re.search(REGEX, c) for c in characters]) or len(lCharacters) != len(set(lCharacters)):
        return "Invalid params", 400
    
    cursor = getDB().cursor()
    cursor.execute("SELECT * FROM Worlds WHERE Name=%s;", (name,))

    res = cursor.fetchall()
    if len(res) != 0:
        return {"taken": True}

    cursor.execute("INSERT INTO Worlds (Name, Description, IsPublic) VALUES (%s, %s, %s);", (name, desc, (1 if isPublic else 0)))
    getDB().commit()

    cursor.execute("SELECT MAX(WorldID) FROM Worlds;")
    res = cursor.fetchall()
    worldID = 1 if res[0][0] == None else res[0][0]

    cursor.execute("SELECT MAX(CharacterID) FROM Characters WHERE WorldID=%s;", (worldID,))
    res = cursor.fetchall()
    characterID = 1 if res[0][0] == None else res[0][0] + 1

    for c in characters:
        cursor.execute("INSERT INTO Characters (WorldID, CharacterID, Name) VALUES (%s, %s, %s);", (worldID, characterID, c))
        getDB().commit()
        characterID += 1

    return "Success"

with app.app_context():
    initDB()

app.run(host="0.0.0.0", port=5000)

