export interface Mortgage {
    propertyId: string
    basePrice: number
    basePriceLabel: string
    address: string
    area: number
    buyer: {
        fullName: string
        addressStreet: string
        addressCity: string
        personalId: string
        mupId: string
    }
    seller: {
        fullName: string
        addressStreet: string
        addressCity: string
        personalId: string
        mupId: string
    }
    conclusionDate: string
    conclusionAddress: string
    courtInJurisdiction: string
    taxPayer: 'BUYER' | 'SELLER'
    proxyFullName?: string
    proxyPersonalId?: string
    depositValue?: number
    depositValueLabel?: number
    paymentPartsNum?: number
    movingOutDate?: string
    utilitiesPaid?: boolean
}

export interface ContractSourceData {
    title: string
    header: string
    footer: string
    acts: { 
        title: string
        body: string
    }[]
}

export interface OptionalFields {
    proxyActive: boolean
    depositActive: boolean
    paymentPartsActive: boolean
    movingOutActive: boolean
    utilitiesActive: boolean
}

export interface DeployedContractResponse {
    contractAddress: string
}

export interface ContractSourceResponse {
    contractSol: string
}

export interface DeployedContractData {
    contractAddress: string
}
