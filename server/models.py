from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
  return uuid4().hex

class User(db.Model):
  __tablename__ = "users"
  id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
  email = db.Column(db.String(100), unique=True, nullable=False)
  password = db.Column(db.Text, nullable=False)
  firstName = db.Column(db.String(100), nullable=False)
  lastName = db.Column(db.String(100), nullable=False)
  address1 = db.Column(db.String(100), nullable=False)
  city = db.Column(db.String(100), nullable=False)
  state = db.Column(db.String(100), nullable=False)
  postalCode = db.Column(db.String(10), nullable=False)
  dateOfBirth = db.Column(db.String(100), nullable=False)

class Account(db.Model):
  __tablename__ = "accounts"
  id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
  userId = db.Column(db.String(100), nullable=False)
  name = db.Column(db.String(100), nullable=False)
  mask = db.Column(db.String(4), nullable=False)
  currentBalance = db.Column(db.Numeric(10,2), nullable=False)

class Holding(db.Model):
    __tablename__ = "holdings"
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.String(100), nullable=False)
    ticker = db.Column(db.String(10), nullable=False)
    volume = db.Column(db.Integer, nullable=False)
    investment = db.Column(db.Numeric(10,2), nullable=False)

class Trade(db.Model):
    __tablename__ = "trades"
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.String(100), nullable=False)
    trade_type = db.Column(db.String(10), nullable=False)
    ticker = db.Column(db.String(10), nullable=False)
    volume = db.Column(db.Integer, nullable=False)
    trade_price = db.Column(db.Numeric(10,2), nullable=False)
    trade_date = db.Column(db.DateTime, default=datetime.now(timezone.utc))

class Watchlist(db.Model):
    __tablename__ = "watchlists"
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.String(100), nullable=False)
    ticker = db.Column(db.String(10), nullable=False)