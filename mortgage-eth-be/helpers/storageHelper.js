const fs = require('fs');
const path = require('path');

const storagePath = path.resolve(__dirname, '../storedAddresses.txt');

const handleStorageFile = async (address) => {
    const createStorage = () => {
        const file = fs.writeFileSync(storagePath, address);
    }

    if (!fs.existsSync(storagePath)) {
        createStorage();
        return
    }

    const storageData = fs.readFileSync(storagePath, 'utf8').split(/\r?\n/);
    if (storageData.length && storageData[0] === address) {
        return
    }

    createStorage();
}

const storeAddress = (contractAddress) => {
    fs.appendFileSync(storagePath, '\n' + contractAddress);
}

const getAddresses = () => {
    const storageData = fs.readFileSync(storagePath, 'utf8').split(/\r?\n/);

    storageData.splice(0, 1);
    return storageData;
}

module.exports = {
    handleStorageFile,
    storeAddress,
    getAddresses,
}