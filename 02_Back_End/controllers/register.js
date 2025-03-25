const handleRegister = (req, res, db, bcrypt) => {

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
    
    // Insert the new user
    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash],
      function(err) {
        if (err) {
          console.error(err.message);
          // Check for unique constraint violation (email already exists)
          if (err.message.includes('UNIQUE constraint failed: users.email')) {
            return res.status(409).json('User with this email already exists');
          }
          return res.status(500).json('Error during registration');
        }
        
        // Get the newly created user without the password
        db.get(
          'SELECT id, name, email, entries, joined FROM users WHERE id = ?',
          [this.lastID],
          (err, newUser) => {
            if (err) {
              return res.status(500).json('Error retrieving new user');
            }
            return res.json(newUser);
          }
        );
      }
    );
  });
};

module.exports = {
    handleRegister: handleRegister
    };