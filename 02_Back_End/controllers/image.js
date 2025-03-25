const handleImage = (req, res, db) => {
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
};

const handleApiCall = (req, res) => {
  const { imageUrl } = req.body;
  
  // Clarifai API configuration using environment variables
  const PAT = process.env.CLARIFAI_PAT;
  const USER_ID = process.env.CLARIFAI_USER_ID;
  const APP_ID = process.env.CLARIFAI_APP_ID;
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
};

module.exports = {
  handleImage,
  handleApiCall
};