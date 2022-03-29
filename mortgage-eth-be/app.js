require('dotenv').config();
const express = require('express');
const contractHelper = require('./contractHelper.js');


const app = express()
const port = 3000

app.post('/contract', async (req, res) => {
    const isBodyValid = validateBody(req.body);
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

app.get('/contract-preview', (req, res) => {
    const contractSource = contractHelper.getContract(req.body);
    res.status(200).json({ contractSource });    
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})