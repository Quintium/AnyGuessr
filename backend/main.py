from flask import Flask, request, g
from flask_cors import CORS
import mysql.connector
import os
from db import initDB, getDB

app = Flask(__name__)
CORS(app)

@app.route('/publicworlds', methods=['GET'])
def getWorlds():
    print("Public worlds request received")

    mycursor = getDB().cursor()
    mycursor.execute("SELECT Name FROM Worlds WHERE IsPublic;")

    return [data[0] for data in mycursor]

@app.route('/getdesc', methods=['GET'])
def getDesc():
    print("Get description request received")

    mycursor = getDB().cursor()
    mycursor.execute("SELECT Description FROM Worlds WHERE Name=%s;", (request.args["name"],))

    res = list(mycursor)
    if not res:
        return {"found": False}
    else:
        return {"found": True, "desc": res[0][0]}

with app.app_context():
    initDB()

app.run(host='0.0.0.0', port=5000)

