# Bookstore API

## Welcome to the Bookstore API!

This API provides endpoints for managing books, users, and authentication within a bookstore application.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Bookstore API allows users to perform various actions such as:

- View a list of books
- Search for books by title, author, or category
- Add books to a shopping cart
- Manage user accounts
- Authenticate users using JWT tokens
- Reset forgotten passwords

## Features

- RESTful API design
- Authentication and authorization using JWT tokens
- CRUD operations for managing books
- User account management
- Password reset functionality

## Getting Started

### Prerequisites

Before running the Bookstore API, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MongoDB (or a MongoDB Atlas account)

### Installation

1. Clone the repository:

   ```bash
   git clone 'https://github.com/Mohsen0Rashidi/bookstore-api'
   cd bookstore-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and define the following variables:

   ```makefile
   PORT=3000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret-key>
   ```

4. Start the server:

   ```bash
   npm start
   ```

## Usage

Once the server is running, you can interact with the API using tools like Postman or curl. Refer to the Endpoints section for a list of available endpoints and their descriptions.

## Endpoints

The following are the main endpoints provided by the Bookstore API:

- `GET /api/v1/book`: Get all books
- `GET /api/v1/book/:id`: Get a single book by ID
- `POST /api/v1/book`: Create a new book
- `PATCH /api/v1/book/:id`: Update a book
- `DELETE /api/v1/book/:id`: Delete a book
- `POST /api/v1/user/signup`: Register a new user
- `POST /api/v1/user/login`: Login user and receive JWT token
- `POST /api/v1/user/forgotPassword`: Request password reset
- `POST /api/v1/user/resetPassword/:token`: Reset user password

For more details on each endpoint and their request/response formats, refer to the API documentation or Swagger documentation.

## Authentication

The Bookstore API uses JWT (JSON Web Tokens) for authentication. When a user logs in or signs up, they receive a JWT token which they can use to authenticate subsequent requests.

## Error Handling

The API returns standard HTTP status codes for success and error responses. Error responses include a JSON object with an `error` field containing a descriptive error message.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

```

```
