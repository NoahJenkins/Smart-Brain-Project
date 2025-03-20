const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const fetch = require('node-fetch');
const path = require('path');
const register = require('./controllers/register');

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

app.get('/', (req, res) => {
  db.all('SELECT id, name, email, entries, joined FROM users', [], (err, users) => {
    if (err) {
      return res.status(500).json('Error retrieving users');
    }
    res.json(users);
  });
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  
  // Input validation
  if (!email || !password) {
    return res.status(400).json('fail');
  }
  
  // Find user by email
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) {
      return res.status(400).json('fail');
    }
    
    // Compare password with stored hash
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json('fail');
      }
      
      if (result) {
        // Create a new object without the password
        const userResponse = {
          id: user.id,
          name: user.name,
          email: user.email,
          entries: user.entries,
          joined: user.joined
        };
        return res.json(userResponse);
      } else {
        // Passwords don't match
        return res.status(400).json('fail');
      }
    });
  });
});

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(
    'SELECT id, name, email, entries, joined FROM users WHERE id = ?',
    [id],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json('User not found');
      }
      res.json(user);
    }
  );
});

app.post('/image', (req, res) => {
  const { id } = req.body;
  
  // Increment entries and return the new value
  db.run(
    'UPDATE users SET entries = entries + 1 WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        return res.status(500).json('Error updating entries');
      }
      
      if (this.changes === 0) {
        return res.status(404).json('User not found');
      }
      
      // Get the new entries count
      db.get('SELECT entries FROM users WHERE id = ?', [id], (err, user) => {
        if (err || !user) {
          return res.status(500).json('Error retrieving entries count');
        }
        res.json(user.entries);
      });
    }
  );
});

app.post('/clarifai-face-detect', (req, res) => {
  const { imageUrl } = req.body;
  
  // Clarifai API configuration
  const PAT = '2cec7c9fc6be46a4a114a85bbb74d9b0';
  const USER_ID = 'xvjbvkg3apmd';
  const APP_ID = 'my-first-application-4yrkpc';
  const MODEL_ID = 'face-detection';
  
  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": imageUrl
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  
  fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, requestOptions)
    .then(clarifaiResponse => clarifaiResponse.json())
    .then(data => res.json(data))
    .catch(err => res.status(500).json('Error calling Clarifai API'));
});

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
