# Duranta Online Backend

This is the backend server for **Duranta Online Ltd.**, an ISP and IT solutions provider. It provides RESTful APIs for managing packages, support tickets, and contact messages. Built with **Node.js**, **Express**, and **MongoDB**, it is ready to be connected to the frontend application hosted on Vercel.

---

## Features

- REST API endpoints for:
  - **Packages**: Create and fetch internet packages
  - **Support Tickets**: Submit and view support messages
  - **Contact Messages**: Submit contact form messages
- CORS enabled for local development and production frontend
- MongoDB Atlas integration
- Environment variable support for sensitive data (username, password, port)

---

## Tech Stack

- **Node.js** - JavaScript runtime  
- **Express.js** - Web framework  
- **MongoDB** - NoSQL database (MongoDB Atlas)  
- **CORS** - Cross-Origin Resource Sharing support  
- **dotenv** - Environment variables  

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/duranta-online-backend.git
cd duranta-online-backend
```

## Project Structure

```
duranta-online-backend/
│
├─ server.js           # Main server file
├─ package.json
├─ .env
└─ README.md
```

## Authors

- **[Md Hossahin](https://hossahin.netlify.app/)** – Backend Developer 
- **[Mehedi Hasan](https://m-hasan.vercel.app/)** –  Contributor

