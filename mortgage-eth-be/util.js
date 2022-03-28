const Web3 = require('web3');
const solc = require('solc');
const path = require('path');
const fs = require('fs');

const findImports = (p) => {
    const contractPath = path.resolve(__dirname, 'node_modules/' + p);
    return {
        contents:
          fs.readFileSync(contractPath, 'utf8')  
        };
}

const updateContract = (source, flags) => {
    const contractLines = source.split('\n');
    let rowData, deleteCount;
    
    for(let i = contractLines.length; i >= 0; i--) {
        rowData = contractLines[i];
        if (!rowData.includes('// Option')) {
            continue;
        }

        deleteCount = 0;
        if (rowData.inclused('UTILITIES_PAYMENT') && flags.utilities) {
            deleteCount = i == 197 ? 5 : i == 133 ? 5 : 2;
        }

        if (rowData.inclused('MOVING_OUT_DATE') && flags.movingOut) {
            deleteCount = i == 182 ? 15 : i == 128 ? 5 : 3;
        }

        if (rowData.inclused('PAYMENT_PARTS_NUMBER') && flags.paymentParts) {
            deleteCount = i == 166 ? 16 : i == 123 ? 5 : 3;
        }

        if (rowData.inclused('DEPOSIT') && flags.deposit) {
            deleteCount = i == 151 ? 15 : i == 117 ? 6 : 3;
        }

        if (rowData.inclused('UTILITIES_PAYMENT') && flags.proxy) {
            deleteCount = i == 141 ? 10 : 2;
        }

        if (deleteCount) {
            contractLines.splice(i, deleteCount);
        }
    }

    return contractLines.join('\n');
}

const getContract = () => {
    const flags = {
        proxy: false,
        deposit: false,
        paymentParts: false,
        movingOut: false,
        utilities: false
    };

    const contractPath = path.resolve(__dirname, 'Mortgage.sol');
    const source = updateContract(fs.readFileSync(contractPath, 'utf8'), flags);

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

const deployContract = (contract) => {
    const contractFile = compileContract(contract);
    const bytecode = contractFile.evm.bytecode.object;
    const abi = contractFile.abi;

    // Generate and fill
    const privKey = '<private key>'; 
    const address = '<address>';

    let web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider('https://mainnet.infura.io/v3/bd18030e3088439ebd5f52eca3ab6d50:8545'));

    const deploy = async() => {

        console.log('Deploy from account:', address);
        const incrementer = new web3.eth.Contract(abi);

        const incrementerTx = incrementer.deploy({
            data: bytecode
            // Update data and send them
            // arguments: [],
        })
        const createTransaction = await web3.eth.accounts.signTransaction({
                from: address,
                data: incrementerTx.encodeABI(),
                gas: 3000000,
            },
            privKey
        )
        const createReceipt = web3.eth.sendSignedTransaction(createTransaction.rawTransaction).then((res) => {
            console.log('Contract deployed at address:', res.contractAddress);
        });
    };

    deploy();
}

module.exports = {
    getContract,
    deployContract,
}