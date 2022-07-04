require('dotenv').config();
const express = require('express');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const cors = require('cors');
const contractHelper = require('./helpers/contractHelper.js');
const storageHelper = require('./helpers/storageHelper.js');
const utils = require('./helpers/utils.js');

const app = express()
app.use(cors());
app.use(bodyParser.json());
const port = 3000;

contractHelper.handleStorage();

app.post('/contract', async (req, res) => {
    const isBodyValid = utils.validateBody(req.body);
    if (!isBodyValid) {
        res.status(400).send('Body must contain all fields');
    }

    let contractAddress;

    try {
        const mortgageData = utils.populateContractData(req.body);
        const contractSource = contractHelper.getContract(mortgageData);
        contractAddress = await contractHelper.deployContract(contractSource, mortgageData);    
    } catch {
        console.error('Error occured!');
        res.status(500).json( { error: 'Something went wrong' });
        return;
    }

    res.status(200).json({ contractAddress });
});

app.get('/contracts', (_, res) => {
    let addresses;
    try {
        addresses = storageHelper.getAddresses();
    } catch {
        console.error('Error occured!');
        res.status(500).json( { error: 'Something went wrong' });
        return;
    }

    res.status(200).json(addresses);
});

app.post('/contract-preview', (req, res) => {
    let contractSol

    try {
        contractSol = contractHelper.getContract(req.body);
    } catch {
        console.error('Error occured!');
        res.status(500).json( { error: 'Something went wrong' });
        return;
    }

    res.status(200).json({ contractSol });    
});

app.listen(port, () => {
    console.log(`INFO: Mortgage app - started on port : ${port}`);
});
