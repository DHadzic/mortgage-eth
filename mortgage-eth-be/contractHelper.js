const Web3 = require('web3');
const solc = require('solc');
const path = require('path');
const ganache = require('ganache-cli');
const utils = require('./utils.js');
const fs = require('fs');

const findImports = (p) => {
    const contractPath = path.resolve(__dirname, 'node_modules/' + p);
    return {
        contents:
          fs.readFileSync(contractPath, 'utf8')  
        };
}

const getContract = (contractData) => {
  const removeFlags = {
      proxy: contractData.byProxy === undefined,
      deposit: contractData.depositValue === undefined,
      paymentParts: contractData.paymentPartsNum === undefined,
      movingOut: contractData.movingOutDate === undefined,
      utilities: contractData.utilitiesPaid === undefined,
  };

  const contractPath = path.resolve(__dirname, 'Mortgage.sol');
  const source = utils.constructRequestedContract(fs.readFileSync(contractPath, 'utf8'), removeFlags);

  return source
}

const compileContract = (contractSource) => {
  const input = {
      language: 'Solidity',
      sources: {
          'Mortgage.sol': {
              content: contractSource,
          },
      },
      settings: {
          outputSelection: {
              '*': {
                  '*': ['*'],
              },
          },
      },
  };
  
  const tempFile = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
  const contractFile = tempFile.contracts['Mortgage.sol']['Mortgage'];
  return contractFile;
}

const deployContract = async (contract, contractData) => {
  const contractFile = compileContract(contract);
  const bytecode = contractFile.evm.bytecode.object;
  const abi = contractFile.abi;

  const privKey = process.env.PRIVATE_KEY; 
  const constructorArgs = utils.mapToArguments(contractData);

  let web3 = new Web3();
  web3.setProvider(ganache.provider());
  const accounts = await web3.eth.getAccounts();

  const deploy = async() => {

      console.log('Deploy from account:', accounts[0]);
      const incrementer = new web3.eth.Contract(abi);
      const contractTransaction = await incrementer.deploy({
          data: bytecode,
          arguments: constructorArgs,
      })

      const gasEst = await contractTransaction.estimateGas({from: accounts[0]});

      const contractInstance = await contractTransaction.send({
          from: accounts[0],
          data: contractTransaction.encodeABI(),
          gas: gasEst,
          gasPrice: 0,
      });

      console.log('Contract address -> ', contractInstance.options.address);
      return contractInstance.options.address;
  };

  // Set additional data
  return await deploy();
}

module.exports = {
  getContract,
  deployContract,
}