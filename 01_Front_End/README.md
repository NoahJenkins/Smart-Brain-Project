# Smart Brain Project - Frontend

This README provides a comprehensive guide to the frontend portion of the Smart Brain Project, detailing the architecture, components, and setup instructions.

## 📋 Table of Contents
- [Overview](#overview)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Component Breakdown](#component-breakdown)
- [State Management](#state-management)
- [Routing](#routing)
- [API Integration](#api-integration)
- [Styling](#styling)

## 🔍 Overview

The Smart Brain Project frontend is a React application that provides a user interface for detecting faces in images. Users can register, sign in, and submit image URLs to detect faces. The application highlights detected faces with bounding boxes and keeps track of the number of submissions per user.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository or download the project files
   ```bash
   git clone https://github.com/yourusername/Smart-Brain-Project.git
   ```

2. Navigate to the frontend directory:
   ```bash
   cd Smart-Brain-Project/01_Front_End
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

### Environment Configuration
Create a `.env` file in the frontend root directory with the following variables:
```
VITE_API_URL=http://localhost:3000
```

### Important Note
The frontend expects the backend server to be running on `http://localhost:3000`. Make sure to start the backend server before using the application.

## 📁 Project Structure

```
01_Front_End/
├── public/                # Static files
├── src/                   # Source files
│   ├── Components/        # React components
│   │   ├── FaceRecognition/   # Face detection display component
│   │   ├── ImageLinkForm/     # URL input component
│   │   ├── Logo/              # App logo component
│   │   ├── Navigation/        # Navigation bar component
│   │   ├── Rank/              # User stats component
│   │   ├── Register/          # Registration form component
│   │   └── SignIn/            # Sign in form component
│   ├── App.jsx            # Main application component
│   ├── App.css            # Main application styles
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── package.json           # Project dependencies
├── vite.config.js         # Vite configuration
└── index.html             # HTML entry point
```

## 🧩 Component Breakdown

### App.jsx

The `App.jsx` file is the main component that orchestrates the entire application. It manages the application state and handles component interactions.

#### Key Features:
- **State Management**: Maintains application state including:
  - `input`: Current text in the image URL input field
  - `imageUrl`: URL of the image being analyzed
  - `boxes`: Array of face detection bounding boxes
  - `route`: Current application screen ('signin', 'register', 'home')
  - `isSignedIn`: Authentication status
  - `user`: Current user data (id, name, email, entries, joined)

- **Key Methods**:
  - `loadUser`: Updates user state with data from backend
  - `onRouteChange`: Handles navigation between screens
  - `calculateFaceLocations`: Computes bounding box coordinates from API response
  - `displayFaceBoxes`: Updates state with face detection boxes
  - `onInputChange`: Updates input state when the URL field changes
  - `onButtonSubmit`: Triggers face detection process and API calls

- **Routing Logic**: Conditionally renders components based on the `route` state
- **API Integration**: Makes fetch requests to the backend for authentication and face detection

### Navigation Component

Located in `src/Components/Navigation/Navigation.jsx`, this component provides the navigation bar at the top of the application.

#### Key Features:
- Conditional rendering based on authentication status
- Sign in and register links for unauthenticated users
- Sign out link for authenticated users
- Uses the `onRouteChange` prop to trigger navigation

### Logo Component

Located in `src/Components/Logo/logo.jsx`, this component displays the application logo with a tilt animation effect.

#### Key Features:
- Uses `react-parallax-tilt` for 3D tilt animation
- Custom styling with CSS for visual appeal

### ImageLinkForm Component

Located in `src/Components/ImageLinkForm/ImageLinkForm.jsx`, this component provides the interface for users to submit image URLs.

#### Key Features:
- Text input field for image URL entry
- Submit button to trigger face detection
- Custom styled form with CSS patterns
- Passes user input to parent component via callbacks

### Rank Component

Located in `src/Components/Rank/Rank.jsx`, this component displays the user's current submission count.

#### Key Features:
- Shows personalized message with user's name
- Displays current entry count from user state

### FaceRecognition Component

Located in `src/Components/FaceRecognition/FaceRecognition.jsx`, this component displays the image with face detection boxes.

#### Key Features:
- Renders the submitted image
- Overlays bounding boxes based on face detection results
- Handles multiple face detections
- Responsive sizing and positioning

### SignIn Component

Located in `src/Components/SignIn/SignIn.jsx`, this component provides the login form.

#### Key Features:
- Email and password input fields
- Form validation
- API integration for authentication
- Error message display
- Navigation to registration page

### Register Component

Located in `src/Components/Register/Register.jsx`, this component provides the user registration form.

#### Key Features:
- Input fields for name, email, and password
- Form validation
- API integration for user creation
- Error message display

## 🔄 State Management

The application uses React's state management system. Key features include:

- Centralized state in the App component
- Props passed down to child components
- Callback functions passed to child components to update parent state
- Conditional rendering based on state values
- State reset on sign out

## 🧭 Routing

Routing is handled through the internal state rather than a router library:

- The `route` state variable tracks the current screen
- The `onRouteChange` method updates the route state
- Conditional rendering in the render method displays appropriate components

## 🔌 API Integration

The frontend communicates with the backend through several endpoints:

- `/signin`: User authentication
- `/register`: User account creation
- `/profile/:id`: Get user profile information
- `/image`: Update entry count and process image detection
- `/imageurl`: Handle image URL processing

All API requests use the Fetch API with appropriate headers and error handling.

## 🎨 Styling

The application uses a combination of styling approaches:

- **Tachyons**: Utility-first CSS framework for rapid styling
- **Custom CSS**: Component-specific styling for unique visual elements
- **particles-bg**: Background animation library for visual appeal
- **react-parallax-tilt**: For 3D animation effects on the logo

The color scheme follows a gradient theme with purple and gold accents, creating a modern and engaging user interface.

## 🛠️ Additional Features

- **Multiple Face Detection**: The application can detect and highlight multiple faces in a single image
- **Particle Background**: Dynamic animated background using particles-bg
- **Responsive Design**: Adapts to different screen sizes
- **Error Handling**: User-friendly error messages for API failures and validation issues
- **Security**: Implementation of secure authentication practices

## 🔒 Security Considerations

- Passwords are never stored in the frontend
- JWT tokens are used for session management
- API calls use HTTPS for secure data transmission
- Input validation is performed on both client and server side

## 🧪 Testing

To run tests for the frontend application:

```bash
npm test
```

## 📱 Browser Compatibility

The application has been tested and works on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

This frontend application is designed to work seamlessly with the Smart Brain Project backend. The combination provides a full-featured face detection application with user authentication, persistence, and an engaging user interface.
