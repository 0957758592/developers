const express = require('express');
const app = express();
const mongoose = require('mongoose');

const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const users = require('./routes/api/users');

const port = process.env.PORT || 5000;

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(()=> console.log('MongoBD Connected'))
    .catch(err => console.log(err));

app.get('/', (req,res) => res.send('Hello!'));

//Use Routes
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

app.listen(port, () => console.log(`Server runnin on port ${port}`));