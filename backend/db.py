from flask import Flask, request, g, current_app
from flask_cors import CORS
import mysql.connector
import os

def getDB():
    if 'db' not in g or not g.db.is_connected():
        g.db = mysql.connector.connect(
            host="localhost",
            user="anyguessr",
            password=os.environ['ANYGUESSR_DB_PASSWORD'],
            database="anyguessr_db"
        )
    return g.db

def closeDB(e=None):
    db = g.pop('db', None)

    if db is not None and db.is_connected():
        db.close()

def initDB():
    current_app.teardown_appcontext(closeDB)