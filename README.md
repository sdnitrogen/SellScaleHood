## SellScaleHood

A full stack basic implementation of Robinhood, where one can sign-up and trade stocks.

Built for SellScale.

![Dev Status](https://img.shields.io/badge/Development-Completed-1471DC?style=for-the-badge)

### Features

- [x] User authentication
- [x] Search for a Stock symbol
- [x] See user portfolio
- [x] See a stock details page
- [x] Add/Remove a stock from their watchlist
- [x] Buy/Sell stocks
- [x] View their trading history

### Technologies

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/-NextJS-FFFFFF?style=for-the-badge&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-%23DD0031.svg?logo=redis&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-%2307405e.svg?logo=sqlite&logoColor=white)

### Prerequisites

- Install python 3.x from official website
- Install nodejs

```
brew install nvm
nvm install 20
```

- Install redis

```
brew install redis
```

- Clone this repository to your local system.

### Steps to run the project

- cd into the location where you have cloned this repository
- setup and activate a python virtual env

```
pip3 -m venv .venv

source ./venv/bin/activate
```

- cd into the server directory
- install the python libraries from requirements

```
pip3 install -r requirements.txt
```

- set FLASK environment variables

```
export FLASK_APP = app.py
export FLASK_ENV = development
```

- copy the .env.example filed to a new file named ".env"
- set the SECRET_KEY=XXXXXXXXXXXXX where the Xs are any string you want to.

- start a redis server

```
redis-server
```

- open a new terminal at the server directory location and run the flask app

```
flask run --reload
```

- open a new terminal at the client directory of the project folder
- install node dependencies

```
npm install
```

- run the frontend application

```
npm run dev
```

- Go to http://localhost:3000/ to access the application
