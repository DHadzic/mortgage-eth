require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const contractHelper = require('./helpers/contractHelper.js');
const storageHelper = require('./helpers/storageHelper.js');
const utils = require('./helpers/utils.js');

const app = express()
app.use(cors());
app.use(bodyParser.json());
// Test - doesn't log anything  
// app.use((err, _1, res, _2) => {
//     res.locals.message = err.message;
//     res.locals.error = err;
//     res.status(err.status || 500);
//     res.render('error');
// });
const port = 3000;

contractHelper.handleStorage();

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
    const addresses = storageHelper.getAddresses();

    res.status(200).json(addresses);
});

app.post('/contract-preview', (req, res) => {
    const contractSol = contractHelper.getContract(req.body);
    res.status(200).json({ contractSol });    
});

app.listen(port, () => {
    console.log(`INFO: Mortgage app - started on port : ${port}`);
})