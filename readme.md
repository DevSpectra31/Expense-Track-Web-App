# Expense Tracker App
# A RESTful backend API built with Node.js, Express, and MongoDB featuring JWT authentication and user-specific expense management.

# Features
# User registration & login
# JWT authentication
# Expense CRUD operations
# Expense ownership
# Filtering, pagination, sorting
# Secure password hashing
# Tech Stack
# Node.js
# Express.js
# MongoDB + Mongoose
# JWT
# bcrypt
# Setup
# npm install
# npm run dev

# Create .env:

# PORT=5000
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret

# API Endpoints
# Auth
# POST /api/v1/users/signup
# POST /api/v1/users/signin
# GET /api/v1/users/currentUser
# UPDATE /api/v1/users/update
# DELETE /api/v1/users/delete
# Expenses
# POST /api/v1/expenses/create
# GET /api/v1/expenses/getExpenses
# GET /api/v1/expenses/getExpensebyid
# PUT /api/v1/expenses/updateExpensebyid
# DELETE /api/v1/expenses/deleteExpense/
# Author
# Vineet Rajpal