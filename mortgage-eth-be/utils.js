const constructRequestedContract = (source, removeFlags) => {
    const contractLines = source.split('\n');
    let rowData, deleteCount;

    for(let i = contractLines.length - 1; i >= 0; i--) {
        rowData = contractLines[i];
        if (!rowData.includes('// Option')) {
            continue;
        }

        deleteCount = 0;
        if (rowData.includes('UTILITIES_PAYMENT') && removeFlags.utilities) {
            deleteCount = i == 228 ? 5 : i == 159 ? 5 : 2;
        }

        if (rowData.includes('MOVING_OUT_DATE') && removeFlags.movingOut) {
            deleteCount = i == 213 ? 15 : i == 154 ? 5 : 3;
        }

        if (rowData.includes('PAYMENT_PARTS_NUMBER') && removeFlags.paymentParts) {
            deleteCount = i == 197 ? 16 : i == 149 ? 5 : 3;
        }

        if (rowData.includes('DEPOSIT') && removeFlags.deposit) {
            deleteCount = i == 181 ? 16 : i == 143 ? 6 : 4;
        }

        if (rowData.includes('PROXY') && removeFlags.proxy) {
            deleteCount = i == 167 ? 14 : 3;
        }

        if (deleteCount) {
            contractLines.splice(i, deleteCount);
        }
    }

    for(let i = contractLines.length - 1; i >= 0; i--) {
        if (contractLines[i].includes('// Option')) {
            contractLines.splice(i,1);
        }
    }

    return contractLines.join('\n');
}

const mapToArguments = (contractData) => {
    return [
        contractData.propertyId,
        [
            contractData.seller.fullName,
            contractData.seller.addressStreet,
            contractData.seller.addressCity,
            contractData.seller.personalId,
            contractData.seller.mupId,
        ],
        [
            contractData.buyer.fullName,
            contractData.buyer.addressStreet,
            contractData.buyer.addressCity,
            contractData.buyer.personalId,
            contractData.buyer.mupId,
        ],
        contractData.totalPrice,
        contractData.basePrice,
        contractData.basePriceLabel,
        contractData.address,
        contractData.conclusionDate,
        contractData.conclusionAddress,
        +(contractData.taxPayer === 'BUYER'),
        contractData.courtInJurisdiction
    ];
}

const validateBody = (contractData) => {
    const keys = [
        'propertyId',
        'seller',
        'buyer',
        'totalPrice',
        'address',
        'basePrice',
        'basePriceLabel',
        'conclusionDate',
        'conclusionAddress',
        'taxPayer',
        'courtInJurisdiction',
    ];

    const personKeys = [
        'fullName',
        'addressStreet',
        'addressCity',
        'personalId',
        'mupId',
    ];

    Object.keys(contractData).forEach((key) => {
        if (!keys.includes(key)) {
            return false;
        }
    });

    Object.keys(contractData.buyer).forEach((key) => {
        if (!personKeys.includes(key)) {
            return false;
        }
    });

    Object.keys(contractData.seller).forEach((key) => {
        if (!personKeys.includes(key)) {
            return false;
        }
    });

    return true;
}

const populateContractData = (requestBody) => {
    const contractData = {
        propertyId: requestBody.propertyId,
        seller: {
            fullName: requestBody.seller.fullName,
            addressStreet: requestBody.seller.addressStreet,
            addressCity: requestBody.seller.addressCity,
            personalId: requestBody.seller.personalId,
            mupId: requestBody.seller.mupId,
        },
        buyer: {
            fullName: requestBody.buyer.fullName,
            addressStreet: requestBody.buyer.addressStreet,
            addressCity: requestBody.buyer.addressCity,
            personalId: requestBody.buyer.personalId,
            mupId: requestBody.buyer.mupId,
        },
        totalPrice: requestBody.basePrice,
        basePrice: requestBody.basePrice,
        basePriceLabel: requestBody.basePriceLabel,
        address: requestBody.address,
        conclusionDate: requestBody.conclusionDate,
        conclusionAddress: requestBody.conclusionAddress,
        taxPayer: requestBody.taxPayer === 'Seller' ? 0 : 1,
        courtInJurisdiction: requestBody.courtInJurisdiction,
    };

    if (requestBody.proxyFullName !== null) {
        contractData['proxyFullName'] = requestBody.proxyFullName;
        contractData['proxyPersonalId'] = requestBody.proxyPersonalId;
    }

    if (requestBody.depositValue !== null && requestBody.depositValueLabel !== null) {
        contractData['depositValue'] = requestBody.depositValue;
        contractData['totalPrice'] += requestBody.depositValue;
        contractData['depositValueLabel'] = requestBody.depositValueLabel;
    }

    if (requestBody.paymentPartsNum !== null) {
        contractData['paymentPartsNum'] = requestBody.paymentPartsNum;
    }

    if (requestBody.movingOutDate !== null) {
        contractData['movingOutDate'] = requestBody.movingOutDate;
    }

    if (requestBody.utilitiesPaid !== null) {
        contractData['utilitiesPaid'] = requestBody.utilitiesPaid;
    }

    return contractData;
}

module.exports = {
    constructRequestedContract,
    mapToArguments,
    populateContractData,
    validateBody,
}