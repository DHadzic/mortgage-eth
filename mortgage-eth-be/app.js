require('dotenv').config();
const express = require('express');
const util = require('./util.js');


const app = express()
const port = 3000

app.get('/contract', (req, res) => {
    // const contractData = req.body;
    const contractData = {
        propertyId: 5,
        seller: {
            fullName: 'ASd',
            addressStreet: 'asd',
            addressCity: 'asd',
        },
        buyer: {
            fullName: 'asd2',
            addressStreet: 'asd2',
            addressCity: 'asd2',
        },
        totalPrice: 500,
        basePrice: 500,
        basePriceLabel: 'Pesto',
        conclusionDate: 'Datum',
        conclusionAddress: 'Adresa',
        taxPayer: 0,
        courtInJurisdiction: 'Sud',

    } 
    const contractSource = util.getContract();
    util.deployContract(contractSource, contractData);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})