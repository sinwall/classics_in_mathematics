const path = require('path');
const express = require('express');
const app = express();

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/module-three', express.static(path.join(__dirname, 'node_modules/three')));
// app.use('/module-three', express.static(path.join(__dirname, 'node_modules/three/src/Three.js')));
// app.use('/module-three-addons', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 8608;
app.listen(PORT, function() {
    console.log(`Application running on port ${PORT}`);
});