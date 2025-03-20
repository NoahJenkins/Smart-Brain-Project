const handleHome = (req, res, db) => {
  db.all('SELECT id, name, email, entries, joined FROM users', [], (err, users) => {
    if (err) {
      return res.status(500).json('Error retrieving users');
    }
    res.json(users);
  });
};

module.exports = {
  handleHome
};