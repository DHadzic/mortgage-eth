# Mortgage and ETH Smart Contracts

Project related to Faculty of Technical Sciences subject - Law informatics

### Node version

* v14.18.2

### Description

Angular/Express project with usage of [web3-eth](https://github.com/ChainSafe/web3.js/tree/1.x) library for comunication with blockchain network.
  
Local blockchain network is hosted by [ganache-cli](https://github.com/trufflesuite/ganache) package.

### Features

* Creating smart contract that represents mortgage contract through form
* Optional fields reflect on smart contract structure
* Previewing source code of smart contract and output document for mortgage contract before deployment
* Deploying smart contract to etherium network
* Previewing smart contracts fetched by address, that were previously deployed

### Usage

* Frontend application:
  * Positionate inside `/mortgage-eth-sc` and run `npm i`
  * To start application run `ng serve`
* Backend application:
  * Positionate inside `/mortgage-eth-be` and run `npm i`
  * To start application run `node app.js`
* Ganache-cli:
  * Run `npm i -g ganache-cli`
  * Opet terminal and run `ganache-cli -a 1 --allowUnlimitedContractSize true`
  * Local blockchain network server is started and running
