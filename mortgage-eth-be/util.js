const Web3 = require('web3');
const solc = require('solc');
const path = require('path');
const ganache = require('ganache-cli');
const fs = require('fs');

const findImports = (p) => {
    const contractPath = path.resolve(__dirname, 'node_modules/' + p);
    return {
        contents:
          fs.readFileSync(contractPath, 'utf8')  
        };
}

const constructContract = (source, flags) => {
    const contractLines = source.split('\n');
    let rowData, deleteCount;
    
    for(let i = contractLines.length - 1; i >= 0; i--) {
        rowData = contractLines[i];
        if (!rowData.includes('// Option')) {
            continue;
        }

        deleteCount = 0;
        if (rowData.includes('UTILITIES_PAYMENT') && flags.utilities) {
            deleteCount = i == 199 ? 5 : i == 134 ? 5 : 2;
        }

        if (rowData.includes('MOVING_OUT_DATE') && flags.movingOut) {
            deleteCount = i == 184 ? 15 : i == 129 ? 5 : 3;
        }

        if (rowData.includes('PAYMENT_PARTS_NUMBER') && flags.paymentParts) {
            deleteCount = i == 168 ? 16 : i == 124 ? 5 : 3;
        }

        if (rowData.includes('DEPOSIT') && flags.deposit) {
            deleteCount = i == 152 ? 15 : i == 118 ? 6 : 4;
        }

        if (rowData.includes('UTILITIES_PAYMENT') && flags.proxy) {
            deleteCount = i == 142 ? 10 : 2;
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
    const source = constructContract(fs.readFileSync(contractPath, 'utf8'), flags);

    return source
}

const mapToArguments = (contractData) => {
    return [
        contractData.propertyId,
        [
            contractData.seller.fullName,
            contractData.seller.addressStreet,
            contractData.seller.addressCity
        ],
        [
            contractData.buyer.fullName,
            contractData.buyer.addressStreet,
            contractData.buyer.addressCity
        ],
        contractData.totalPrice,
        contractData.basePrice,
        contractData.basePriceLabel,
        contractData.conclusionDate,
        contractData.conclusionAddress,
        contractData.taxPayer,
        contractData.courtInJurisdiction
    ];
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
    const constructorArgs = mapToArguments(contractData);

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
    };

    deploy();
}

module.exports = {
    getContract,
    deployContract,
}