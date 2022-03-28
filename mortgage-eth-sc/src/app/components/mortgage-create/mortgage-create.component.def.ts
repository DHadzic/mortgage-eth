export interface Mortgage {
    propertyId: string
    basePrice: number
    basePriceLabel: string
    area: number
    buyer: {
        fullName: string
        addressStreet: string
        addressCity: string
    }
    seller: {
        fullName: string
        addressStreet: string
        addressCity: string
    }
    conclusionDate: string
    conclusionAddress: string
    courtInJurisdiction: string
    taxPayer: 'BUYER' | 'SELLER'
    byProxy: boolean
    depositValue: number
    depositValueLabel: number
    paymentPartsNum: number
    movingOutDate: string
    utilitiesPaid: boolean
}

export interface OptionalFields {
    proxyActive: boolean
    depositActive: boolean
    paymentPartsActive: boolean
    movingOutActive: boolean
    utilitiesActive: boolean
}