const Web3 = require('web3');
const solc = require('solc');
const path = require('path');
const utils = require('./utils.js');
const storageHelper = require('./storageHelper.js');
const fs = require('fs');

const web3 = new Web3();

// For running new Ganache server with every server start
// const ganache = require('ganache-cli');
// web3.setProvider(ganache.provider());

// For connecting to already running Ganache server
web3.setProvider('http://localhost:8545');

const findImports = (p) => {
    const contractPath = path.resolve(__dirname, 'node_modules/' + p);
    return {
        contents:
          fs.readFileSync(contractPath, 'utf8')  
        };
}

const getContract = (contractData) => {
  const removeFlags = {
      proxy: contractData.proxyFullName === null,
      deposit: contractData.depositValue === null,
      paymentParts: contractData.paymentPartsNum === null,
      movingOut: contractData.movingOutDate === null,
      utilities: contractData.utilitiesPaid === null,
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

  const constructorArgs = utils.mapToArguments(contractData);
  const accounts = await web3.eth.getAccounts();

  const deploy = async() => {
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
      storageHelper.storeAddress(contractInstance.options.address);

      return contractInstance;
  };

  const optionalFlags = {
    proxy: contractData.proxyFullName !== undefined,
    deposit: contractData.depositValue !== undefined,
    paymentParts: contractData.paymentPartsNum !== undefined,
    movingOut: contractData.movingOutDate !== undefined,
    utilities: contractData.utilitiesPaid !== undefined,
  };

  const contractInstance = await deploy();

  try {
    if (optionalFlags.proxy) {
      await contractInstance.methods.setProxy(contractData.proxyFullName, contractData.proxyPersonalId).call();
    }
    if (optionalFlags.deposit) {
      await contractInstance.methods.setDeposit(contractData.depositValue, contractData.depositValueLabel).call();
    }
    if (optionalFlags.paymentParts) {
      await contractInstance.methods.setPaymentPartsNum(contractData.paymentPartsNum).call();
    }
    if (optionalFlags.movingOut) {
      await contractInstance.methods.setMovingOutDate(contractData.movingOutDate).call();
    }  
  } catch {
    console.error('Method invocation went wrong!');
  }

  return contractInstance.options.address;
}

const handleStorage = async () => {
  const accounts = await web3.eth.getAccounts();
  storageHelper.handleStorageFile(accounts[0]);
}

module.exports = {
  getContract,
  deployContract,
  handleStorage,
}