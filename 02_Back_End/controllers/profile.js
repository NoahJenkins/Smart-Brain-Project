const handleProfileGet = (req, res, db) => {
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
};

module.exports = {
  handleProfileGet
};