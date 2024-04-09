from flask import Flask, request, g
from flask_cors import CORS
from db import initDB, getDB
import re

app = Flask(__name__)
CORS(app)

@app.route("/publicworlds", methods=["GET"])
def getWorlds():
    print("Public worlds request received")

    mycursor = getDB().cursor()
    mycursor.execute("SELECT Name FROM Worlds WHERE IsPublic;")

    return [data[0] for data in mycursor]

@app.route("/getdesc", methods=["GET"])
def getDesc():
    print("Get description request received")

    mycursor = getDB().cursor()
    mycursor.execute("SELECT Description FROM Worlds WHERE Name=%s;", (request.args["name"].strip(),))

    res = list(mycursor)
    if not res:
        return {"notFound": True}
    else:
        return {"desc": res[0][0]}
    
MIN_NAME_LENGTH = 5
MAX_NAME_LENGTH = 20
MAX_DESC_LENGTH = 200
NAME_REGEX = r"^[a-zA-Z0-9_ ]*$"
DESC_REGEX = r"^[a-zA-Z0-9,;.:\-_#'+*~´`?\\}=\])[({/&%$§\"!^°<>| ]*$"

@app.route("/create", methods=["POST"])
def createWorld():
    print("Creation request received")

    name, desc, public = request.args["worldName"].strip(), request.args["worldDesc"].strip(), request.args["isPublic"]
    if len(name) < MIN_NAME_LENGTH or len(name) > MAX_NAME_LENGTH or len(desc) > MAX_DESC_LENGTH or not re.search(NAME_REGEX, name) or not re.search(DESC_REGEX, desc):
        return "Invalid name/description", 400
    
    mycursor = getDB().cursor()
    mycursor.execute("INSERT INTO Worlds (Name, Description, IsPublic) VALUES (%s, %s, %s);", (name, desc, (1 if public else 0)))
    getDB().commit()

    return "Success"

with app.app_context():
    initDB()

app.run(host="0.0.0.0", port=5000)

