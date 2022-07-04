import { Injectable } from '@angular/core';
import { DeployedContractResponse, ContractSourceResponse, Mortgage, ContractSourceData, MortgageMethods } from './smart-contract.service.d';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MortgageABI } from './smart-contract.service.data'
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class SmartContractService {  
  private _url = 'http://localhost:3000';
  private _mortgageData$: Subject<Mortgage | null>;
  public mortgageData$: Observable<Mortgage | null>;

  constructor(private _http: HttpClient) {
    this._mortgageData$ = new Subject<Mortgage | null>();
    this.mortgageData$ = this._mortgageData$.asObservable();
  }

  public deployContract(data: Mortgage): Observable<DeployedContractResponse> {
    return this._http.post<DeployedContractResponse>(this._url + '/contract', data);
  }

  public getContractPreview(data: Mortgage): Observable<ContractSourceResponse> {
    return this._http.post<ContractSourceResponse>(this._url + '/contract-preview', data);
  }

  public getContractSourcePreview(data: Mortgage): ContractSourceData {
    const proxyActive = +(data.proxyFullName !== null);
    const depositActive = +(data.depositValue !== null);
    const paymentPartsActive = +(data.paymentPartsNum !== null);
    const movingOutActive = +(data.movingOutDate !== null);
    const utilitiesActive = +(data.utilitiesPaid !== null);

    let additionalActStart = 8;
    const ADDITIONAL_ACT_END = additionalActStart + proxyActive + depositActive + paymentPartsActive + movingOutActive + utilitiesActive + 1;

    let acts = [
      {
        title: 'Član 1.',
        body: `Prodavac je jedini vlasnik nepokretnosti koja se nalazi na adresi ${ data.property.address }, površine ${ data.property.area } m2, upisane u listu nepokretnosti br. ${ data.property.propertyId }.`
      },
      {
        title: 'Član 2.',
        body: `Prodavac prodaje, a kupac kupuje nepokretnost iz člana 1. ovog ugovora, po međusobno ugovorenoj ceni od ${ data.property.basePrice } (slovima: ${ data.property.basePriceLabel }) dinara.`
      },
      {
        title: 'Član 3.',
        body: `Zaključenjem ovog ugovora, ugovorne strane potvrđuju da je kupcu predata u posed nepokretnost iz člana 1. ovog ugovora, ispražnjena od lica i stvari.`
      },
      {
        title: 'Član 4.',
        body: `Prodavac garantuje kupcu da danom overe ovog ugovora kod Suda, na predmetnoj nepokretnosti nema
          nikakvih tereta, da nepokretnost nije predmet nikakvog spora, ni drugog pravnog posla i da prema istoj
          treća lica nemaju nikakvih prava ni potraživanja, te se obavezuje da kupcu pruži zaštitu od evikcije.
          Prodavac garantuje kupcu da predmetna nepokretnost nema nikakvih skrivenih nedostataka, a kupuje se
          u viđenom stanju.`
      },
      {
        title: 'Član 5.',
        body: `Ugovorne strane su se sporazumele da ${ data.taxPayer === 'BUYER' ? 'kupac' : 'prodavac' } snosi troškove overe ovog ugovora i porez na
          prenos apsolutnih prava po ovom ugovoru.`
      },
      {
        title: 'Član 6.',
        body: `Prilikom predaje predmetne nepokretnosti u posed, prodavac je dužan predati kupcu svu
          dokumentaciju koja se odnosi na pravo svojine na nepokretnosti, priznanice o plaćenim uslugama, naknadama i 
          porezima koje se odnose na korišćenje predmetne nepokretnosti, zaključno sa danom predaje nepokretnosti.`
      },
      {
        title: 'Član 7.',
        body: `Prodavac je saglasan da na osnovu ovog ugovora kupac može upisati pravo svojine u zemljišnim knjigama
          na svoje ime, kao novi vlasnik i držalac te nepokretnosti, bez davanja posebne izjave i prisustva
          prodavca.\n Ova izjava je "clausula intabulandi".`
      },
      {
        title: 'Član 8.',
        body: `Ugovorne strane su saglasne da će uzajamne sporove rešavati mirnim putem a ako ne postignu
          sporazum, spor će rešavati nadležni sud u ${ data.courtInJurisdiction }.`
      },
      {
        title: `Član ${ ADDITIONAL_ACT_END }.`,
        body: `Ugovorne strane su ovaj ugovor pročitale i razumele, te ga u znak saglasnosti i pristanka svojeručno potpisuju.`
      },
      {
        title: `Član ${ ADDITIONAL_ACT_END + 1 }.`,
        body: `Ovaj ugovor je sačinjen u pet istovetnih primeraka, od kojih tri pripadaju kupcu, a 
          jedan primerak pripada prodavcu, dok je jedan primerak za Sud.`
      },
    ]

    if (proxyActive) {
      additionalActStart += proxyActive;

      let act = {
        title: `Član ${ additionalActStart }.`,
        body: `Ugovorne strane su saglasne da će se kupoprodaja nepokretnosti vršiti uz pomoć posrednika ${ data.proxyFullName }, JMBG ${ data.proxyPersonalId }`,
      };

      acts.splice(additionalActStart - 1, 0, act);
    }

    if (depositActive) {
      additionalActStart += depositActive;

      let act = {
        title: `Član ${ additionalActStart }.`,
        body: `Prilikom realizacije potpisivanja ugovora, kupac je isplatio depozit u iznosu od ${ data.depositValue } (slovima: ${ data.depositValueLabel }).`,
      };

      acts.splice(additionalActStart - 1, 0, act);
    }

    if (paymentPartsActive) {
      additionalActStart += paymentPartsActive;

      let act = {
        title: `Član ${ additionalActStart }.`,
        body: `Radi olakšanog isplaćivanja predmetne nepokretnosti, kupcu je omogucena isplata u ${ data.paymentPartsNum } delova.`,
      };

      acts.splice(additionalActStart - 1, 0, act);
    }

    if (movingOutActive) {
      additionalActStart += movingOutActive;

      let act = {
        title: `Član ${ additionalActStart }.`,
        body: `Prodavac je dužan da predmetnu nepokretnost napusti najkasnije do ${ data.movingOutDate }.`,
      };

      acts.splice(additionalActStart - 1, 0, act);
    }

    if (utilitiesActive) {
      additionalActStart += utilitiesActive;

      let act = {
        title: `Član ${ additionalActStart }.`,
        body: `Nakon iseljavanja, prodavca je odgovoran da reguliše sve zaostatke plaćanja rezija.`,
      };

      acts.splice(additionalActStart - 1, 0, act);
    }


    const contractSourceData = {
      title: 'UGOVOR O KUPOPRODAJI',
      header: `Zaključen u ${ data.conclusionAddress } dana ${ data.conclusionDate } godine, između ugovornih strana:\n
        1. ${ data.seller.fullName } iz ${ data.seller.addressCity }, ul. ${ data.seller.addressStreet }, JMBG ${ data.seller.personalId } iz MUP ${ data.seller.mupId },\n
        kao prodavca, s jedne strane i\n
        2. ${ data.buyer.fullName } iz ${ data.buyer.addressCity }, ul. ${ data.buyer.addressStreet }, JMBG ${ data.buyer.personalId } iz MUP ${ data.buyer.mupId },\n
        kao kupca, s druge strane.`,
      footer: `U ${ data.conclusionAddress }, dana ${ data.conclusionDate } godine.`,      
      acts: [...acts],
    } as ContractSourceData;

    return contractSourceData;
  }

  public getContractsAddresses(): Observable<string[]> {
    return this._http.get<string[]>(this._url + '/contracts');
  }

  public async getContractData(address: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!address) {
        return
      }
  
      try{
        const web3 = new Web3();
        web3.setProvider('http://localhost:8545');
        const contract = new web3.eth.Contract(MortgageABI as AbiItem[], address);
    
        const buyerInfoFn =  await (contract.methods as MortgageMethods).getBuyerInfo();
        const sellerInfoFn =  await (contract.methods as MortgageMethods).getSellerInfo();
        const propertyInfoFn =  await (contract.methods as MortgageMethods).getPropertyDetails();
        const conclusionDateFn =  await (contract.methods as MortgageMethods).getConclusionDate();
        const conclusionAddressFn =  await (contract.methods as MortgageMethods).getConclusionAddress();
        const taxPayerFn =  await (contract.methods as MortgageMethods).getTaxPayer();
        const courtInJurisdictionFn =  await (contract.methods as MortgageMethods).getCourtInJurisdiction();
        const proxyFn =  await (contract.methods as MortgageMethods).getProxy();
        const depositValueFn =  await (contract.methods as MortgageMethods).getDepositValue();
        const paymentPartsNumFn =  await (contract.methods as MortgageMethods).getPaymentPartsNum();
        const movingOutDateFn =  await (contract.methods as MortgageMethods).getMovingOutDate();
        const sattleUtilitiesPaymentFn =  await (contract.methods as MortgageMethods).sattleUtilitiesPayment();
        
        // To get data
        const buyerInfo = await buyerInfoFn.call(null);
        const sellerInfo = await sellerInfoFn.call(null);
        const propertyInfo = await propertyInfoFn.call(null);
        const conclusionDate  = await conclusionDateFn.call(null);
        const conclusionAddress = await conclusionAddressFn.call(null);
        const taxPayer = await taxPayerFn.call(null);
        const courtInJurisdiction = await courtInJurisdictionFn.call(null);
    
        let proxy = undefined,
          depositValue = undefined,
          paymentPartsNum = undefined,
          movingOutDate = undefined,
          utilities = undefined;
    
        try {
          proxy = await proxyFn.call(null);
        } catch {}
        try {
          depositValue = await depositValueFn.call(null);
        } catch {}
        try {
          paymentPartsNum = await paymentPartsNumFn.call(null);
        } catch {}
        try {
          movingOutDate = await movingOutDateFn.call(null);
        } catch {}
        try {
          utilities = await sattleUtilitiesPaymentFn.call(null);
        } catch {}
    
        const buyerInfoList = (buyerInfo as string).split('-');
        const sellerInfoList = (sellerInfo as string).split('-');
        const propertyInfoList = (propertyInfo as string).split('-');

        if (buyerInfoList.length !== 5 || sellerInfoList.length !== 5 || propertyInfoList.length !== 5) {
          console.error('Error parsing lists');
          reject();
        }

        const contractData: Mortgage = {
          buyer: {
              fullName: buyerInfoList[0].trim(),
              addressStreet: buyerInfoList[1].trim(),
              addressCity: buyerInfoList[2].trim(),
              personalId: buyerInfoList[3].trim(),
              mupId: buyerInfoList[4].trim(),
          },
          seller: {
            fullName: sellerInfoList[0].trim(),
            addressStreet: sellerInfoList[1].trim(),
            addressCity: sellerInfoList[2].trim(),
            personalId: sellerInfoList[3].trim(),
            mupId: sellerInfoList[4].trim(),
        },
          property: {
            propertyId: propertyInfoList[0].trim(),
            address: propertyInfoList[0].trim(),
            area: +propertyInfoList[0].trim(),
            basePrice: +propertyInfoList[0].trim(),
            basePriceLabel: propertyInfoList[0].trim(),
          },
          conclusionDate,
          conclusionAddress,
          courtInJurisdiction,
          taxPayer: taxPayer === 'buyer' ? 'BUYER' : 'SELLER',
        }

        if (proxy) {
          const proxyList = proxy.split('-');
          contractData.proxyFullName = proxyList[0].trim();
          contractData.proxyPersonalId = proxyList[1].trim();
        }

        if (depositValue) {
          const depositValueList = depositValue.split('-');
          contractData.depositValue = depositValueList[0].trim();
          contractData.depositValueLabel = depositValueList[1].trim();          
        }

        if (paymentPartsNum) {
          contractData.paymentPartsNum = +paymentPartsNum;
        }

        if (movingOutDate) {
          contractData.movingOutDate = movingOutDate;
        }

        if (utilities) {
          contractData.utilitiesPaid = false;
        }

        this._mortgageData$.next(contractData);
  
        resolve();  
      } catch (err) {
        console.error(err);
        reject();
      }
    })
  }
}
