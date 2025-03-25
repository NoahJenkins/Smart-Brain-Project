const handleSignin = (req, res, db, bcrypt) => {
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
};

module.exports = {
  handleSignin
};