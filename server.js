
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

const port = 3000;

app.get('/', (req,res) => {
    res.sendFile('index.html', { root: path.join(__dirname) });
});


app.get('/api', async (req,res) => {
    console.log(req._parsedUrl.query.split("&")[0]);
    const apiKey = process.env.NEWS_API_KEY;
    let url = `https://newsapi.org/v2/everything?${req._parsedUrl.query}&apiKey=${apiKey}`;
    try {
        const response = await axios.get(url);
        const responseData = response.data;
        res.json(responseData);
    } catch (error) {
        console.error('Error fetching news data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Endpoint to fetch API key
app.get('/api-key', (req, res) => {
    const apiKey = process.env.NEWS_API_KEY;
    res.json({ apiKey });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

