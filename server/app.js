const express = require('express');
const app = express();

const mongoose = require('mongoose');
const PORT = 5000
const {MONGOURI} = require('./config');

// Register DB Model
require('./models/user');

app.use(express.json())
app.use(require('./routes/auth'))

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log("MongoDB Connected");
})

mongoose.connection.on('error', (error) => {
    console.log('Error in connection', error);
})

app.listen(PORT, () => {
    console.log('server is running on', PORT);
})