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
            deleteCount = i == 199 ? 5 : i == 134 ? 5 : 2;
        }

        if (rowData.includes('MOVING_OUT_DATE') && removeFlags.movingOut) {
            deleteCount = i == 184 ? 15 : i == 129 ? 5 : 3;
        }

        if (rowData.includes('PAYMENT_PARTS_NUMBER') && removeFlags.paymentParts) {
            deleteCount = i == 168 ? 16 : i == 124 ? 5 : 3;
        }

        if (rowData.includes('DEPOSIT') && removeFlags.deposit) {
            deleteCount = i == 152 ? 15 : i == 118 ? 6 : 4;
        }

        if (rowData.includes('PROXY') && removeFlags.proxy) {
            deleteCount = i == 142 ? 10 : 2;
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

const validateBody = (contractData) => {
    const keys = [
        'propertyId',
        'seller',
        'buyer',
        'totalPrice',
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
        },
        buyer: {
            fullName: requestBody.buyer.fullName,
            addressStreet: requestBody.buyer.addressStreet,
            addressCity: requestBody.buyer.addressCity,
        },
        totalPrice: requestBody.basePrice,
        basePrice: requestBody.basePrice,
        basePriceLabel: requestBody.basePriceLabel,
        conclusionDate: requestBody.conclusionDate,
        conclusionAddress: requestBody.conclusionAddress,
        taxPayer: requestBody.taxPayer,
        courtInJurisdiction: requestBody.courtInJurisdiction,
    };

    if (requestBody.byProxy !== undefined) {
        contractData['byProxy'] = byProxy;
    }

    if (requestBody.depositValue !== undefined && requestBody.depositValueLabel !== undefined) {
        contractData['depositValue'] = depositValue;
        contractSource.totalPrice += depositValue;
        contractData['depositValueLabel'] = depositValueLabel;
    }

    if (requestBody.paymentPartsNum !== undefined) {
        contractData['paymentPartsNum'] = paymentPartsNum;
    }

    if (requestBody.movingOutDate !== undefined) {
        contractData['movingOutDate'] = movingOutDate;
    }

    if (requestBody.utilitiesPaid !== undefined) {
        contractData['utilitiesPaid'] = utilitiesPaid;
    }

    return contractData;
}

module.exports = {
    constructRequestedContract,
    mapToArguments,
    populateContractData,
    validateBody,
}