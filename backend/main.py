from flask import Flask, request, g
from flask_cors import CORS
from db import initDB, getDB
import re

app = Flask(__name__)
CORS(app)

def createTables():
    cursor = getDB().cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Worlds (
            WorldID INT NOT NULL AUTO_INCREMENT,
            Name VARCHAR(31) NOT NULL,
            Description VARCHAR(255) NOT NULL,
            IsPublic Bool NOT NULL,
            PRIMARY KEY (WorldID)
        );
    """)
    getDB().commit()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Characters (
            WorldID INT NOT NULL,
            CharacterID INT NOT NULL,
            Name VARCHAR(31) NOT NULL,
            PRIMARY KEY (WorldID, CharacterID)
        );
    """)
    getDB().commit()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Questions (
            WorldID INT NOT NULL,
            QuestionID INT NOT NULL,
            Question VARCHAR(31) NOT NULL,
            PRIMARY KEY (WorldID, QuestionID)
        );
    """)
    getDB().commit()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Played (
            WorldID INT NOT NULL,
            CharacterID INT NOT NULL,
            QuestionID INT NOT NULL,
            Answer INT NOT NULL,
            Count INT NOT NULL,
            PRIMARY KEY (WorldID, CharacterID, QuestionID, Answer, Count)
        );
    """)
    getDB().commit()

@app.route("/publicworlds", methods=["GET"])
def getWorlds():
    cursor = getDB().cursor()
    cursor.execute("SELECT Name FROM Worlds WHERE IsPublic;")

    return {"worlds": [data[0] for data in cursor]}

@app.route("/getdesc", methods=["GET"])
def getDesc():
    cursor = getDB().cursor()
    cursor.execute("SELECT Description FROM Worlds WHERE Name=%s;", (request.args["name"].strip(),))

    res = cursor.fetchall()
    if not res:
        return {"notFound": True}
    else:
        return {"desc": res[0][0]}
    
MIN_NAME_LENGTH = 5
MAX_NAME_LENGTH = 20
MAX_DESC_LENGTH = 150
MAX_CHAR_LENGTH = 20
MAX_QUESTION_LENGTH = 20
REGEX = r"^[a-zA-Z0-9,;.:\-_#'+*~´`?\\}=\])[({/&%$§\"!^°<>| ]*$"

@app.route("/create", methods=["POST"])
def createWorld():
    data = request.json
    name, desc, isPublic, characters, questions = data["name"].strip(), data["desc"].strip(), data["isPublic"], [c.strip() for c in data["characters"]], [q.strip() for q in data["questions"]]
    
    if len(name) < MIN_NAME_LENGTH or len(name) > MAX_NAME_LENGTH or not re.search(REGEX, name):
        return "Invalid name", 400
    
    if len(desc) > MAX_DESC_LENGTH or not re.search(REGEX, desc):
        return "Invalid description", 400
    
    lCharacters = [c.lower() for c in characters]
    if len(characters) < 2 or any([not c or len(c) > MAX_CHAR_LENGTH or not re.search(REGEX, c) for c in characters]) or len(lCharacters) != len(set(lCharacters)):
        return "Invalid characters", 400
    
    lQuestions = [q.lower() for q in questions]
    if len(questions) == 0 or any([not q or len(q) > MAX_QUESTION_LENGTH or not re.search(REGEX, q) for q in questions]) or len(lQuestions) != len(set(lQuestions)):
        return "Invalid questions", 400

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

    cursor.execute("SELECT MAX(QuestionID) FROM Questions WHERE WorldID=%s;", (worldID,))
    res = cursor.fetchall()
    questionID = 1 if res[0][0] == None else res[0][0] + 1

    for c in characters:
        cursor.execute("INSERT INTO Characters (WorldID, CharacterID, Name) VALUES (%s, %s, %s);", (worldID, characterID, c))
        getDB().commit()
        characterID += 1

    for q in questions:
        cursor.execute("INSERT INTO Questions (WorldID, QuestionID, Question) VALUES (%s, %s, %s);", (worldID, questionID, q))
        getDB().commit()
        questionID += 1

    return "Success"

@app.route("/play/normal/getquestion", methods=["POST"])
def getQuestion():
    data = request.json
    world, game = data["world"].strip(), data["game"]
    asked = [qa[0] for qa in game]
    
    cursor = getDB().cursor()

    cursor.execute("SELECT WorldID FROM Worlds WHERE Name=%s;", (world,))
    res = cursor.fetchall()
    if not res:
        return {"notFound": True}
    worldID = res[0][0]

    cursor.execute("SELECT QuestionID, Question FROM Questions WHERE WorldID=%s;", (worldID,))

    res = cursor.fetchall()
    for (id, q) in res:
        if id not in asked:
            return {"questionID": id, "question": q}

    return {"gameOver": True}

with app.app_context():
    initDB()
    createTables()

app.run(host="0.0.0.0", port=5000)

