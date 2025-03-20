const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const fetch = require('node-fetch');
const path = require('path');

// Import controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const home = require('./controllers/home');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize SQLite database
const dbPath = path.resolve(__dirname, '..', '03_Database', 'smart-brain.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database');
    
    // Create users table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        entries INTEGER DEFAULT 0,
        joined DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table', err.message);
      } else {
        console.log('Users table ready');
        
        // Check if we need to seed initial users
        db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
          if (!err && result.count === 0) {
            // Seed initial users for development
            const seedUsers = [
              {
                name: 'John',
                email: 'john@gmail.com',
                password: 'cookies',
                entries: 0
              },
              {
                name: 'Sally',
                email: 'sally@gmail.com',
                password: 'bananas',
                entries: 0
              }
            ];
            
            seedUsers.forEach(user => {
              bcrypt.hash(user.password, 10, (err, hash) => {
                if (!err) {
                  db.run(
                    'INSERT INTO users (name, email, password, entries) VALUES (?, ?, ?, ?)',
                    [user.name, user.email, hash, user.entries],
                    function(err) {
                      if (err) {
                        console.error('Error seeding user', err.message);
                      } else {
                        console.log(`Seeded user ${user.name} with ID ${this.lastID}`);
                      }
                    }
                  );
                }
              });
            });
          }
        });
      }
    });
  }
});

// Routes
app.get('/', (req, res) => { home.handleHome(req, res, db) });
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.post('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/clarifai-face-detect', (req, res) => { image.handleApiCall(req, res) });

// Close database connection when server stops
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection');
    process.exit(0);
  });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
