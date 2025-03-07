from flask import Flask, request, jsonify, send_file, redirect, url_for
from flask_cors import CORS
import mysql.connector
import bcrypt
import jwt
import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Secret key for JWT
app.config['SECRET_KEY'] = 'Monty@2005'

# Database Connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Monty@2005",
    database="farmrise_db"
)
cursor = db.cursor()

# --- SERVE HTML FILES WITHOUT MOVING THEM ---
@app.route("/")
def home():
    return send_file("/Users/mohitredhu/Desktop/Farm Rise/Frontend/index.html")

@app.route("/signup")
def signup_page():
    return send_file("/Users/mohitredhu/Desktop/Farm Rise/Frontend/signup.html")

@app.route("/login")
def login_page():
    return send_file("/Users/mohitredhu/Desktop/Farm Rise/Frontend/login.html")

@app.route("/dashboard")
def dashboard():
    return send_file("/Users/mohitredhu/Desktop/Farm Rise/Frontend/dashboard.html")

# --- USER SIGNUP ---
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    full_name = data['fullName']
    email = data['email']
    password = data['password']
    role = data['role']
    phone_number = data['phoneNumber']

    # Check if email already exists
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing_user = cursor.fetchone()
    if existing_user:
        return jsonify({'message': 'Email already exists'}), 400

    # Hash Password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Insert User
    cursor.execute("INSERT INTO users (full_name, email, password, role, phone_number) VALUES (%s, %s, %s, %s, %s)",
                   (full_name, email, hashed_password, role, phone_number))
    db.commit()

    return jsonify({'message': 'User registered successfully'}), 201

# --- USER LOGIN ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    # Check user in database
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user and bcrypt.checkpw(password.encode('utf-8'), user[3].encode('utf-8')):  # user[3] is password column
        token = jwt.encode({'email': email, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
                           app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'message': 'Login successful', 'token': token, 'redirect': '/dashboard'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# Run Server
if __name__ == '__main__':
    app.run(debug=True)