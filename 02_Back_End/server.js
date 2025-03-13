const express = require('express');

const app = express();

app.get('/', (req,res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user


*/