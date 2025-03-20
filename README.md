# Smart Brain Project

The Smart Brain Project is a web application that allows users to register, sign in, and detect faces in uploaded images. This README explains the architecture and functionality of the application.

## 1. Frontend (React.js)

The frontend is built using React.js, a popular JavaScript library for building user interfaces.

### Key Components

- **App.jsx**: The main component that manages application state, including:
  - User authentication state
  - Image URL handling
  - Face detection boxes
  - Routing between pages

- **Navigation**: Handles user navigation and sign-out functionality

- **Logo**: Displays the application logo using the Tilt animation library

- **ImageLinkForm**: Provides a form for users to input image URLs for face detection

- **Rank**: Displays the current user's usage statistics

- **FaceRecognition**: Renders the image with bounding boxes around detected faces

- **SignIn/Register**: Form components for user authentication

### State Management

- Uses React Hooks (useState) for component-level state
- Main App component maintains global state and passes data via props
- Handles form submissions and API calls to the backend

### User Flow

1. Users start at the sign-in page
2. They can either sign in or navigate to registration
3. Once authenticated, users can submit image URLs
4. The application displays the image with face detection boxes
5. User entry count increases with each successful detection

## 2. Backend (Node.js & Express)

The backend is built with Node.js and Express, providing RESTful API endpoints for the frontend.

### Server Setup

- **Express**: Handles HTTP requests and routing
- **CORS**: Enables cross-origin requests from the frontend
- **Body Parser**: Parses JSON request bodies

### API Endpoints

- **GET /** - Lists all users (development/testing purpose)
- **POST /signin** - Authenticates users and returns user data
- **POST /register** - Creates new user accounts
- **GET /profile/:id** - Retrieves user profile data
- **POST /image** - Updates user entry count
- **POST /clarifai-face-detect** - Proxies requests to Clarifai API for face detection

### Security Features

- Passwords are hashed using bcrypt before storage
- Input validation to prevent malformed requests
- Parameterized SQL queries to prevent injection attacks

### External API Integration

- Integrates with Clarifai's face detection API
- Handles API responses and forwards relevant data to the frontend

## 3. Database (SQLite)

The application uses SQLite, a file-based relational database for data persistence.

### Database Structure

- Located in the 03_Database folder as `smart-brain.db`
- Single `users` table with the following schema:
  ```sql
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    entries INTEGER DEFAULT 0,
    joined DATETIME DEFAULT CURRENT_TIMESTAMP
  )
  ```

### Database Operations

- **READ**: Retrieves user data for authentication and profile display
  ```javascript
  db.get('SELECT * FROM users WHERE email = ?', [email], callback)
  ```

- **CREATE**: Stores new user information during registration
  ```javascript
  db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
    [name, email, hash], callback)
  ```

- **UPDATE**: Increments the entry count when users submit images
  ```javascript
  db.run('UPDATE users SET entries = entries + 1 WHERE id = ?', [id], callback)
  ```

### Data Flow

1. **Registration**: 
   - Frontend collects user data and sends to backend
   - Backend hashes password and stores in database
   - New user ID is returned to frontend

2. **Authentication**:
   - Frontend sends credentials to backend
   - Backend verifies against database records
   - User data (excluding password) is returned on success

3. **Face Detection**:
   - User submits image URL
   - Backend proxies request to Clarifai API
   - Database updates entry count
   - Frontend displays results and updated count

### Security Considerations

- Database queries use parameterized statements to prevent SQL injection
- Passwords are never stored in plain text
- IDs are explicitly converted to numbers to ensure type consistency
- Database file can be backed up or migrated as needed

---

## Running the Application

1. Start the backend server:
   ```bash
   cd 02_Back_End
   npm install
   node server.js
   ```

2. Start the frontend development server:
   ```bash
   cd 01_Front_End
   npm install
   npm start
   ```

3. Access the application at http://localhost:3000

The database file will be automatically created in the 03_Database directory when the server starts for the first time.