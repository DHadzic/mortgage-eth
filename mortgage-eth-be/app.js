const express = require('express');
const util = require('./util.js');


const app = express()
const port = 3000

app.get('/contract', (req, res) => {
    util.getContract();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})