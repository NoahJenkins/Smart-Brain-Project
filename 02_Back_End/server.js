const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: "sally@gmail.com",
      password: 'bananas',
      entries: 0,
      joined: new Date()
    },
    {
      id: '987',
      hash: '',
      email: "john@gmail.com"
    }
  ]};

// Hash existing passwords
database.users.forEach(user => {
  if (user.password && typeof user.password === 'string' && !user.password.startsWith('$2')) {
    const plainTextPassword = user.password;
    bcrypt.hash(plainTextPassword, 10, (err, hash) => {
      if (!err) {
        user.password = hash;
      }
    });
  }
});

app.get('/', (req,res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  
  // Input validation
  if (!email || !password) {
    return res.status(400).json('fail');
  }
  
  // Find user by email
  const user = database.users.find(user => user.email === email);
  
  if (!user) {
    return res.status(400).json('fail');
  }
  
  // Compare password with stored hash
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      return res.status(500).json('fail');
    }
    
    if (result) {
      // Passwords match!
      return res.json('success');
    } else {
      // Passwords don't match
      return res.json('fail');
    }
  });
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  
  // Input validation
  if (!email || !name || !password) {
    return res.status(400).json('Incorrect form submission');
  }
  
  // Hash password properly with bcrypt
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json('Error during registration');
    }
    
    const newUser = {
      id: '125', // In a real app, generate a unique ID
      name: name,
      email: email,
      password: hash, // Store the hash, not plaintext
      entries: 0,
      joined: new Date()
    };
    
    database.users.push(newUser);
    
    // Return user without exposing password hash
    const { password, ...userWithoutPassword } = newUser;
    return res.json(userWithoutPassword);
  });
});

app.get('/profile/:id', (req,res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  
  if (!found) {
    res.status(404).json('not found');
  }
});

app.post('/image', (req,res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true
      user.entries++
      return res.json(user.entries);
    }
  })
});



app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
