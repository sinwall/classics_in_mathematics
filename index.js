const path = require('path');
const express = require('express');
const app = express();

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 8608;
app.listen(PORT, function() {
    console.log(`Application running on port ${PORT}`);
});