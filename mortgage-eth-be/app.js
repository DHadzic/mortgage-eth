require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const contractHelper = require('./contractHelper.js');
const utils = require('./utils.js');


const app = express()
app.use(cors());
app.use(bodyParser.json());
const port = 3000

app.post('/contract', async (req, res) => {
    const isBodyValid = utils.validateBody(req.body);
    if (!isBodyValid) {
        res.status(400).send('Body must contain all fields');
    }

    const mortgageData = utils.populateContractData(req.body);
    const contractSource = contractHelper.getContract(mortgageData);
    const contractAddress = await contractHelper.deployContract(contractSource, mortgageData);

    res.status(200).json({ contractAddress });
});

app.get('/contracts', (req, res) => {
    // Return all stored addresses
});

app.post('/contract-preview', (req, res) => {
    const contractSol = contractHelper.getContract(req.body);
    res.status(200).json({ contractSol });    
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})