const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;
const router = require('./router.js');

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {
    console.log('server is working on ' + PORT);
});