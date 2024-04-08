from flask import Flask
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
  host="localhost",
  user="anyguessr",
  password=os.environ['ANYGUESSR_DB_PASSWORD'],
  database="anyguessr_db"
)

print(db)

@app.route('/', methods=['POST'])
def post():
    print("Post request received")
    return "Successful"


app.run(host='0.0.0.0', port=5000)

mycursor = db.cursor()
