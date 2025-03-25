# Backend - Smart Brain Project

This README provides detailed documentation for the backend of the Smart Brain Project, explaining the server architecture, API endpoints, and controller functions.

## Directory Structure

```
02_Back_End/
├── package.json        # Project dependencies and scripts
├── server.js           # Main server application file
└── controllers/        # API endpoint controllers
    ├── home.js         # Home/user listing controller
    ├── image.js        # Image processing and entry updating
    ├── profile.js      # User profile operations
    ├── register.js     # User registration
    └── signin.js       # User authentication
```

## Project Setup & Initialization

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git (for cloning the repository)

### Initial Setup

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/yourusername/Smart-Brain-Project.git
   cd Smart-Brain-Project
   ```

2. **Navigate to the backend directory**:
   ```bash
   cd 02_Back_End
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Database setup**:
   - The SQLite database will be automatically created in the `03_Database` directory 
     when the server starts for the first time
   - If the `03_Database` directory doesn't exist, create it:
     ```bash
     mkdir -p ../03_Database
     ```

5. **Start the server**:
   ```bash
   npm start
   ```
   This will start the server with auto-restart on file changes using Node's watch mode.

6. **Verify installation**:
   - The server should be running on port 3000
   - You should see console output: 
     - "Server is listening on port 3000"
     - "Connected to the SQLite database"
     - "Users table ready"
   - You can test the API by navigating to http://localhost:3000 in your browser or 
     using a tool like Postman or curl

### Environment Configuration

The application uses environment variables to securely store API keys and configuration.

#### Setting Up Environment Variables

1. **Automatic Environment Setup**:
   The application includes an environment checking script that runs automatically when you start the server. 
   It will:
   - Check if a `.env` file exists
   - Create one with placeholder values if it doesn't exist
   - Alert you to update the values with your actual credentials
   
   You can also run this check manually:
   ```bash
   npm run check-env
   ```

2. **Manual Environment Setup**:
   If you prefer to set up the environment manually, create a `.env` file in the `02_Back_End` directory:
   ```bash
   touch .env
   ```

3. **Add your Clarifai API credentials** to the `.env` file:
   ```
   CLARIFAI_PAT=your_personal_access_token
   CLARIFAI_USER_ID=your_user_id
   CLARIFAI_APP_ID=your_app_id
   ```

4. **Obtaining Clarifai Credentials**:
   - Sign up at [Clarifai](https://clarifai.com/signup)
   - Create a new application in the Clarifai dashboard
   - Navigate to your account settings to find your Personal Access Token (PAT)
   - Your User ID and App ID can be found in your application settings

5. **Important Security Notes**:
   - Never commit your `.env` file to version control
   - The `.env` file is already included in `.gitignore`
   - Each developer needs to create their own `.env` file locally

#### Using Environment Variables in Development

Environment variables are automatically loaded when running the server thanks to the `dotenv` package.

#### Environment Variables in Production

For production deployment:
- Set environment variables according to your hosting provider's instructions
- Common providers like Heroku, Vercel, or Netlify have specific UI sections for setting environment variables
- For Docker deployments, use Docker's environment variable functionality

### Troubleshooting

If you encounter any issues during setup:

1. **Port conflicts**: 
   - If port 3000 is already in use, you can modify the port in `server.js`
   - Look for `app.listen(3000, ...)` and change the port number

2. **Database errors**:
   - Ensure the `03_Database` directory exists and is writable
   - Check for error messages in the console related to SQLite
   - You can manually delete the database file to reset it: `rm ../03_Database/smart-brain.db`

3. **Dependency issues**:
   - Try removing `node_modules` and reinstalling: `rm -rf node_modules && npm install`
   - Ensure you're using a compatible Node.js version

4. **Clarifai API errors**:
   - The included API key might be rate-limited or expired
   - You can replace it with your own key in `controllers/image.js`

## Server Architecture (`server.js`)

The `server.js` file is the main entry point for the backend application, setting up the Express server, middleware, database connection, and routes.

### Main Components

1. **Dependencies**
   - [Express](http://expressjs.com/): Web server framework
   - [body-parser](https://www.npmjs.com/package/body-parser): Request body parsing
   - [bcryptjs](https://www.npmjs.com/package/bcryptjs): Password hashing
   - [cors](https://www.npmjs.com/package/cors): Cross-origin resource sharing
   - [sqlite3](https://www.npmjs.com/package/sqlite3): Database driver
   - [node-fetch](https://www.npmjs.com/package/node-fetch): HTTP client for Clarifai API

2. **Middleware Setup**
   - JSON body parsing
   - CORS configuration for frontend communication

3. **Database Initialization**
   - Connects to SQLite database
   - Creates `users` table if it doesn't exist
   - Seeds database with initial users for development

4. **Route Configuration**
   - Maps HTTP endpoints to controller functions
   - Handles all API requests

5. **Graceful Shutdown**
   - Properly closes database connection on server shutdown

## Controllers

### 1. Home Controller (`home.js`)

Lists all registered users - primarily used for development and testing.

```javascript
GET / - Returns list of all users (without passwords)
```

### 2. Sign In Controller (`signin.js`)

Handles user authentication and login.

```javascript
POST /signin - Authenticates user credentials
```

**Features:**
- Input validation
- Password comparison with bcrypt
- Returns user data (excluding password) on successful login
- Error handling for invalid credentials

### 3. Register Controller (`register.js`)

Manages new user registration.

```javascript
POST /register - Creates new user account
```

**Features:**
- Input validation for required fields
- Password hashing with bcrypt
- Unique email constraint handling
- Returns new user data on successful registration

### 4. Profile Controller (`profile.js`)

Retrieves user profile information.

```javascript
GET /profile/:id - Gets user profile by ID
```

**Features:**
- Returns user data excluding password
- Error handling for non-existent users

### 5. Image Controller (`image.js`)

Handles face detection and entry count updates.

```javascript
POST /image - Updates user entry count
POST /clarifai-face-detect - Proxies requests to Clarifai API
```

**Features:**
- Increments and returns updated entry count
- Interfaces with Clarifai API for face detection
- Error handling for API communication

## Database Schema

The application uses a single `users` table with the following schema:

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

## Security Features

- Password hashing with bcrypt
- Parameterized SQL queries to prevent SQL injection
- Input validation across all controllers
- Error handling to prevent information disclosure

## Running the Backend

```bash
# Install dependencies
npm install

# Start server with auto-restart on file changes
npm start
```

The server will be available on port 3000 (http://localhost:3000).

## API Endpoints Overview

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/` | GET | Get all users | - | Array of users |
| `/signin` | POST | Authenticate user | `{email, password}` | User object or error |
| `/register` | POST | Create new user | `{name, email, password}` | New user object or error |
| `/profile/:id` | GET | Get user by ID | - | User object or error |
| `/image` | POST | Update entry count | `{id}` | Updated entry count or error |
| `/clarifai-face-detect` | POST | Detect faces | `{imageUrl}` | Clarifai API response |

## Frontend Integration

This backend is designed to work with the Smart Brain frontend. To connect the two:

1. **Configure the frontend API endpoint**:
   - In your frontend project, set the API base URL to point to this backend
   - Example (in a React app):
     ```javascript
     const API_URL = 'http://localhost:3000';
     // Then use this base URL for all fetch requests
     fetch(`${API_URL}/profile/${id}`)
     ```

2. **CORS configuration**:
   - The backend is already configured to accept requests from common development origins
   - If you're hosting the frontend on a different domain, update the CORS configuration in `server.js`

## Testing the API

You can test the API endpoints using various tools:

1. **Using cURL**:
   ```bash
   # Test the home endpoint
   curl http://localhost:3000
   
   # Test the sign in endpoint
   curl -X POST http://localhost:3000/signin -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password"}'
```

## 4. Version History

```markdown
## Version History

- **v1.0.0** (Initial Release):
  - Basic user authentication (register/login)
  - Face detection integration with Clarifai API
  - SQLite database implementation
  - Entry counting functionality
