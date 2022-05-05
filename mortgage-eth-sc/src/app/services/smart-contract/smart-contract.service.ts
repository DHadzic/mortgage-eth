import { Injectable } from '@angular/core';
import { DeployedContractResponse, ContractSourceResponse, Mortgage, ContractSourceData, MortgageMethods } from './smart-contract.service.d';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MortgageABI } from './smart-contract.service.data'
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class SmartContractService {  
  private _url = 'http://localhost:3000';

  constructor(private _http: HttpClient) {}

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
        body: `Prodavac je jedini vlasnik nepokretnosti koja se nalazi na adresi ${ data.address }, površine ${ data.area } m2, upisane u listu nepokretnosti br. ${ data.propertyId }.`
      },
      {
        title: 'Član 2.',
        body: `Prodavac prodaje, a kupac kupuje nepokretnost iz člana 1. ovog ugovora, po međusobno ugovorenoj ceni od ${ data.basePrice } (slovima: ${ data.basePriceLabel }) dinara.`
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
        body: `Proxy text`,
      };

      acts.splice(additionalActStart - 1, 0, act);
    }

    if (depositActive) {
      additionalActStart += depositActive;

      let act = {
        title: `Član ${ additionalActStart }.`,
        body: `Deposit text`,
      };

      acts.splice(additionalActStart - 1, 0, act);
    }

    if (paymentPartsActive) {
      additionalActStart += paymentPartsActive;

      let act = {
        title: `Član ${ additionalActStart }.`,
        body: `Payment parts text`,
      };

      acts.splice(additionalActStart - 1, 0, act);
    }

    if (movingOutActive) {
      additionalActStart += movingOutActive;

      let act = {
        title: `Član ${ additionalActStart }.`,
        body: `Moving out date text`,
      };

      acts.splice(additionalActStart - 1, 0, act);
    }

    if (utilitiesActive) {
      additionalActStart += utilitiesActive;

      let act = {
        title: `Član ${ additionalActStart }.`,
        body: `Utilities text`,
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

  public async getContractData(address: string): Promise<any> {
    if (!address) {
      return
    }

    const web3 = new Web3();
    web3.setProvider('http://localhost:8545');
    const contract = new web3.eth.Contract(MortgageABI as AbiItem[], address);

    console.log(contract.methods)
    const buyerInfoCall =  await (contract.methods as MortgageMethods).getBuyerInfo();
    console.log(buyerInfoCall);

    // To get data
    const buyerInfo = await buyerInfoCall.call(null);
    console.log(buyerInfo);
  }
}
