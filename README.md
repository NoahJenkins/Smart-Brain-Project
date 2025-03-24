# Smart Brain Project

The Smart Brain Project is a web application that allows users to register, sign in, and detect faces in uploaded images. This project showcases a full-stack application with React frontend, Node.js backend, and SQLite database.

## 📚 Project Overview

This project demonstrates the integration of multiple technologies to create a functional face detection application:

- **Interactive UI**: Register, sign in, and detect faces in images
- **Face Detection**: Leverages Clarifai's AI API for accurate face detection
- **User Management**: Register new users and track usage statistics
- **Database Storage**: Persist user data using SQLite

## 📁 Project Structure

The project is divided into three main components:

1. **Frontend** (`/01_Front_End`)
   - React.js application
   - User interface components
   - State management
   - API integration

2. **Backend** (`/02_Back_End`)
   - Node.js & Express server
   - RESTful API endpoints
   - Authentication logic
   - Clarifai API integration

3. **Database** (`/03_Database`) 
   - SQLite database file
   - User data storage

## 🚀 Getting Started

Follow these steps to set up and run the project locally:

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd 02_Back_End
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   
   The server will run on port 3000 and automatically create the database file if it doesn't exist.

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd 01_Front_End
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application in your browser at the URL shown in your terminal (typically http://localhost:5173)

## 📝 Detailed Documentation

For more detailed information about each component:

- [Frontend Documentation](./01_Front_End/README.md) - Details on components, state management, and UI features
- [Backend Documentation](./02_Back_End/README.md) - API endpoints, controllers, and database interactions

## 🔒 Security Features

- Password hashing with bcrypt
- Parameterized SQL queries to prevent injection attacks
- Input validation to prevent malformed requests
- Secure API key handling

## 🧩 Main Features

- User registration and authentication
- Face detection in images via URL
- Multiple face detection capability
- User statistics tracking
- Responsive and animated UI

---

Happy coding! 👩‍💻👨‍💻