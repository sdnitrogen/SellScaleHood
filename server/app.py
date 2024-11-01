import decimal
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
from openai import OpenAI
from models import Account, Holding, Trade, Watchlist, db, User
from config import ApplicationConfig
from flask_bcrypt import Bcrypt
import yfinance as yf

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
CORS(app, supports_credentials=True)

bcrypt = Bcrypt(app)
server_session = Session(app)

db.init_app(app)
with app.app_context():
  db.create_all()


# Get current logged in user details
@app.route("/@user")
def get_current_user():
  user_id = session.get("user_id")

  if not user_id:
    return jsonify({"error": "Unauthorized"}), 401
  
  user = User.query.filter_by(id = user_id).first()

  return jsonify({
    "id": user.id,
    "email": user.email,
    "firstName": user.firstName,
    "lastName": user.lastName,
    "address1": user.address1,
    "city": user.city,
    "state": user.state,
    "postalCode": user.postalCode,
    "dateOfBirth": user.dateOfBirth,
  })  

# sign-up an user
@app.route("/signup", methods=["POST"])
def signup_user():
  email = request.json["email"]
  password = request.json["password"]
  firstName = request.json["firstName"]
  lastName = request.json["lastName"]
  address1 = request.json["address1"]
  city = request.json["city"]
  state = request.json["state"]
  postalCode = request.json["postalCode"]
  dateOfBirth = request.json["dateOfBirth"]

  user_exists = User.query.filter_by(email = email).first() is not None

  if user_exists:
    return jsonify({"error": "User already exists"}), 409

  hashed_password = bcrypt.generate_password_hash(password)

  new_user = User(email = email, password = hashed_password, firstName = firstName, lastName = lastName, address1 = address1, city = city, state= state, postalCode = postalCode, dateOfBirth = dateOfBirth)
  db.session.add(new_user)
  
  db.session.commit()

  # Add some stocks in the watchlist by default
  default_watchlist = ["AAPL", "GOOGL", "AMZN"]
  for stock in default_watchlist:
    watchlist_entry = Watchlist(userId = new_user.id, ticker = stock)
    db.session.add(watchlist_entry)

  db.session.commit()

  session["user_id"] = new_user.id

  return jsonify({
    "id": new_user.id,
    "email": new_user.email,
    "firstName": new_user.firstName,
    "lastName": new_user.lastName,
    "address1": new_user.address1,
    "city": new_user.city,
    "state": new_user.state,
    "postalCode": new_user.postalCode,
    "dateOfBirth": new_user.dateOfBirth,
  })

# Sign-in an user
@app.route("/signin", methods=["POST"])
def signin_user():
  email = request.json["email"]
  password = request.json["password"]

  user = User.query.filter_by(email = email).first()

  if user is None:
    return jsonify({"error": "Unauthorized"}), 401

  if not bcrypt.check_password_hash(user.password, password):
    return jsonify({"error": "Unauthorized"}), 401
  
  session["user_id"] = user.id

  return jsonify({
    "id": user.id,
    "email": user.email,
    "firstName": user.firstName,
    "lastName": user.lastName,
    "address1": user.address1,
    "city": user.city,
    "state": user.state,
    "postalCode": user.postalCode,
    "dateOfBirth": user.dateOfBirth,
  })

# Sign-out an user
@app.route("/signout", methods=["POST"])
def signout_user():
  session.pop("user_id")
  return "200"

# add bank accounts to an user profile
@app.route("/add-bank-accounts", methods=["POST"])
def add_user_bank_account():
  userId = request.json["userId"]
  bankAccounts = request.json["bankAccounts"]

  for bankAccount in bankAccounts:
    new_bank_account = Account(userId = userId, name = bankAccount["name"], mask = bankAccount["mask"], currentBalance = bankAccount["currentBalance"])
    db.session.add(new_bank_account)

  db.session.commit()

  return jsonify({
    "msg": "Successfully added default accounts",
  })

# get the all bank accounts of an user
@app.route("/get-bank-accounts", methods=["GET"])
def get_user_bank_accounts():
  user_id = session["user_id"]
  
  if not user_id:
    return jsonify({"error": "Unauthorized"}), 401
  
  accounts= Account.query.filter_by(userId = user_id).all()

  bank_accounts = [{column.name: getattr(row, column.name) for column in Account.__table__.columns} for row in accounts]

  return jsonify({
    "userId": user_id,
    "bankAccounts": bank_accounts,
  })

# Add a stock to watchlist
@app.route("/add-watchlist", methods=["POST"])
def add_user_watchlist():
  user_id = session["user_id"]
  ticker = request.json["ticker"]
  
  if not user_id:
    return jsonify({"error": "Unauthorized"}), 401
  
  watch_exists= Watchlist.query.filter_by(userId = user_id).filter_by(ticker = ticker).first()

  if watch_exists:
    return jsonify({"error": "Stock already exists in Watchlist"}), 409
  
  watchlist_entry = Watchlist(userId = user_id, ticker = ticker)
  db.session.add(watchlist_entry)
  db.session.commit()

  stocks= Watchlist.query.filter_by(userId = user_id).all()

  watchlist = [{column.name: getattr(row, column.name) for column in Watchlist.__table__.columns} for row in stocks]

  return jsonify({
    "userId": user_id,
    "watchlist": watchlist,
  })

# Remove a stock from watchlist
@app.route("/remove-watchlist", methods=["POST"])
def remove_user_watchlist():
  user_id = session["user_id"]
  ticker = request.json["ticker"]
  
  if not user_id:
    return jsonify({"error": "Unauthorized"}), 401
  
  watch_exists= Watchlist.query.filter_by(userId = user_id).filter_by(ticker = ticker).first()

  if watch_exists is None:
    return jsonify({"error": "Stock doesn't exist in your Watchlist"}), 404
  
  db.session.delete(watch_exists)
  db.session.commit()

  stocks= Watchlist.query.filter_by(userId = user_id).all()
  watchlist = [{column.name: getattr(row, column.name) for column in Watchlist.__table__.columns} for row in stocks]

  return jsonify({
    "userId": user_id,
    "watchlist": watchlist,
  })

# Retrieve all stocks in a user's watchlist
@app.route("/get-watchlist", methods=["GET"])
def get_user_watchlist():
  user_id = session["user_id"]
  
  if not user_id:
    return jsonify({"error": "Unauthorized"}), 401
  
  stocks= Watchlist.query.filter_by(userId = user_id).all()

  watchlist = [{column.name: getattr(row, column.name) for column in Watchlist.__table__.columns} for row in stocks]

  return jsonify({
    "userId": user_id,
    "watchlist": watchlist,
  })

# search for details of a stock symbol using yfinance
@app.route('/api/stock/<ticker>', methods=['GET'])
def get_stock_info(ticker):
    try:
      stock = yf.Ticker(ticker)
      hist = stock.history(period="1y")
      # Dictionary to store monthly totals and counts
      monthly_data = {}

      for date, row in hist.iterrows():
          month = date.strftime('%B')
          close_price = row['Close']

          if month in monthly_data:
              monthly_data[month]['total'] += close_price
              monthly_data[month]['count'] += 1
          else:
              monthly_data[month] = {'total': close_price, 'count': 1}

      # Convert to array of dictionaries with averages
      monthly_average = [
          {'month': month, 'average_price': round(data['total'] / data['count'], 2)}
          for month, data in monthly_data.items()
      ]
      info = stock.info
      if info:
            symbol = info.get('symbol', '')
            currentPrice = info.get('currentPrice', None)
            name = info.get('longName', None)
            sector = info.get('sector', None)
            previousClose = info.get('previousClose', None)
            if name is None:
              ask = f"An user is searching for a stock symbol. They typed {ticker} in the searchbox. What stock symbol could they be searching for? Give me only the symbol as the response."

              # Initialize OpenAI client with API key
              load_dotenv()
              OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
              client = OpenAI(
                # This is the default and can be omitted
                api_key=os.environ.get("OPENAI_API_KEY"),
              ) 
                
              # Generate completion based on the combined portfolio review
              try:
                response = client.chat.completions.create(
                  model="gpt-4o-mini",
                  messages=[
                    {
                      "role": "user",
                      "content": ask,
                    }
                  ]
                )

                # Extract content from the first choice
                message_content = response.choices[0].message.content
                stock_info = {
                  'symbol': symbol,
                  'currentPrice': currentPrice,
                  'name': name,
                  'sector': sector,
                  'previousClose': previousClose,
                  'history': monthly_average,
                  'correction': message_content
                }
                return jsonify(stock_info)
              except Exception as e:
                return jsonify({'error': f'Failed to analyze search term: {str(e)}'}), 500

            stock_info = {
                'symbol': symbol,
                'currentPrice': currentPrice,
                'name': name,
                'sector': sector,
                'previousClose': previousClose,
                'history': monthly_average,
            }
            return jsonify(stock_info)
      else:
            return jsonify({'error': 'No information available for the provided ticker'}), 404
    except ValueError as ve:
        return jsonify({'error': f'Invalid ticker symbol: {ticker}'}), 400
    except Exception as e:
        return jsonify({'error': f'Failed to fetch stock information: {str(e)}'}), 500
    
# Fetch stock details for multiple stocks    
@app.route('/api/stocks/<tickers>', methods=['GET'])
def get_stocks_info(tickers):
    stocks = tickers.split(",")
    output_stocks = []
    for stock in stocks:
      try:
        stock = yf.Ticker(stock)
        info = stock.info
        if info:
              symbol = info.get('symbol', '')
              currentPrice = info.get('currentPrice', None)
              name = info.get('longName', None)
              sector = info.get('sector', None)
              previousClose = info.get('previousClose', None)
              website = info.get('website', None)
              stock_info = {
                  'symbol': symbol,
                  'currentPrice': currentPrice,
                  'name': name,
                  'sector': sector,
                  'previousClose': previousClose,
                  'website': website
              }
              output_stocks.append(stock_info)
        else:
              return jsonify({'error': 'No information available for the provided ticker'}), 404
      except ValueError as ve:
          return jsonify({'error': f'Invalid ticker symbol: {stock}'}), 400
      except Exception as e:
          return jsonify({'error': f'Failed to fetch stock information: {str(e)}'}), 500
    return jsonify(output_stocks), 200


# Buy a stock
@app.route('/buy', methods=['POST'])
def buy_stock():
    user_id = session["user_id"]
    ticker = request.json["ticker"]
    volume = request.json["volume"]
    from_account = request.json["from"]

    if not user_id:
      return jsonify({"error": "Unauthorized"}), 401

    # fetch stock info for the latest price
    response = get_stock_info(ticker)
    if response.json["name"] is None:
      return jsonify({"error": "Couldn't find a stock with that symbol!."}), 400
    
    price = response.json["currentPrice"]

    #Check if buying power exists
    account= Account.query.filter_by(id = from_account).first()
    if (account.currentBalance < round(volume*price, 2) ):
       return jsonify({'error': 'You do not have enough buying power in this account'}), 400

    # Check if the stock already exists in the portfolio
    stock = Holding.query.filter_by(userId = user_id).filter_by(ticker = ticker).first()
    if stock:
        stock.volume += volume
        stock.investment += decimal.Decimal(round(volume*price, 2))  # Update the investment amount
    else:
        stock = Holding(userId = user_id, ticker = ticker, volume = volume, investment = round(volume*price, 2))
        db.session.add(stock)

    # Create Trade
    new_trade = Trade(userId = user_id, trade_type = "buy", ticker = ticker, volume = volume, trade_price = price)
    db.session.add(new_trade)

    # Update account
    account.currentBalance -= decimal.Decimal(round(volume*price, 2))
    db.session.add(account)

    db.session.commit()

    # get the accounts and holdings to send back
    accounts= Account.query.filter_by(userId = user_id).all()
    bank_accounts = [{column.name: getattr(row, column.name) for column in Account.__table__.columns} for row in accounts]

    holdings= Holding.query.filter_by(userId = user_id).all()
    user_holdings = [{column.name: getattr(row, column.name) for column in Holding.__table__.columns} for row in holdings]

    return jsonify({
       "message": "Stock purchased successfully",
       "accounts": bank_accounts,
       "holdings": user_holdings
       }), 200


# Sell a stock
@app.route('/sell', methods=['POST'])
def sell_stock():
    user_id = session["user_id"]
    ticker = request.json["ticker"]
    volume = request.json["volume"]
    to_account = request.json["to"]

    if not user_id:
      return jsonify({"error": "Unauthorized"}), 401
    
    # Fetch the stock details for latest price
    response = get_stock_info(ticker)
    if response.json["name"] is None:
      return jsonify({"error": "Couldn't find a stock with that symbol!."}), 400
    
    price = response.json["currentPrice"]

    # Check if the stock already exists in the portfolio
    stock = Holding.query.filter_by(userId = user_id).filter_by(ticker = ticker).first()
    if stock:
        if stock.volume >= volume:
          stock.volume -= volume
          if stock.volume == 0:
            db.session.delete(stock)
          else:
            stock_trades= Trade.query.filter_by(userId = user_id).filter_by(ticker = ticker).filter_by(trade_type = "buy").all()
            stock_transactions = [{column.name: getattr(row, column.name) for column in Trade.__table__.columns} for row in stock_trades]
            sold_quantity = volume
            for trx in stock_transactions:
              if trx["volume"] >= sold_quantity:
                stock.investment -= decimal.Decimal(round(sold_quantity*trx["trade_price"], 2))
                break
              else:
                stock.investment -= decimal.Decimal(round(trx["volume"]*trx["trade_price"], 2))
                sold_quantity -= trx["volume"]
               
          # Create Trade
          new_trade = Trade(userId = user_id, trade_type = "sell", ticker = ticker, volume = volume, trade_price = price)
          db.session.add(new_trade)

          # Update account
          account= Account.query.filter_by(id = to_account).first()
          account.currentBalance += decimal.Decimal(round(volume*price, 2))
          db.session.add(account)

          db.session.commit()

          # get the accounts and holdings to send back
          accounts= Account.query.filter_by(userId = user_id).all()
          bank_accounts = [{column.name: getattr(row, column.name) for column in Account.__table__.columns} for row in accounts]

          holdings= Holding.query.filter_by(userId = user_id).all()
          user_holdings = [{column.name: getattr(row, column.name) for column in Holding.__table__.columns} for row in holdings]

          return jsonify({
            "message": "Stock sold successfully",
            "accounts": bank_accounts,
            "holdings": user_holdings
            }), 200
        else:
           return jsonify({'error': 'Not enough quantity to sell'}), 400
    else:
        return jsonify({"error": "Stock not found in portfolio" }), 404
    

# get all the stocks in portfolio    
@app.route("/holdings", methods=["GET"])
def get_user_holdings():
  user_id = session["user_id"]
  
  if not user_id:
    return jsonify({"error": "Unauthorized"}), 401
  
  stocks= Holding.query.filter_by(userId = user_id).all()
  holdings = [{column.name: getattr(row, column.name) for column in Holding.__table__.columns} for row in stocks]

  return jsonify({
    "userId": user_id,
    "holdings": holdings,
  })

# get all stock tradings
@app.route("/transactions", methods=["GET"])
def get_user_transactions():
  user_id = session["user_id"]
  
  if not user_id:
    return jsonify({"error": "Unauthorized"}), 401
  
  trades= Trade.query.filter_by(userId = user_id).all()
  transactions = [{column.name: getattr(row, column.name) for column in Trade.__table__.columns} for row in trades]

  return jsonify({
    "userId": user_id,
    "transactions": transactions,
  })

# analyze portfolio    
@app.route("/review-portfolio", methods=["GET"])
def generate_portfolio_analysis():
  user_id = session["user_id"]
  
  if not user_id:
    return jsonify({"error": "Unauthorized"}), 401
  
  stocks= Holding.query.filter_by(userId = user_id).all()
  holdings = [{column.name: getattr(row, column.name) for column in Holding.__table__.columns} for row in stocks]
  mod_holdings = [{k: v for k, v in d.items() if k != 'userId'} for d in holdings]

  portfolio_review = f"You are a stock portfolio analyzer. I have a stock portfolio as follows: \n{mod_holdings}\n Give me three bullet points of 1 senetnce each on What's good about my stock portfolio, What can be improved about my portfolio and What can I buy next to improve my portfolio. The response should be in utf-8 format and not markdown so i can easily show it on a html page."

  # Initialize OpenAI client with API key
  load_dotenv()
  OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
  client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
  ) 
    
  # Generate completion based on the combined portfolio review
  try:
    response = client.chat.completions.create(
      model="gpt-4o-mini",
      messages=[
        {
          "role": "user",
          "content": portfolio_review,
        }
      ]
    )

    # Extract content from the first choice
    message_content = response.choices[0].message.content
    return message_content
  except Exception as e:
    return jsonify({'error': f'Failed to analyze portfolio: {str(e)}'}), 500

if __name__ == "__main__":
  app.run(debug=True)