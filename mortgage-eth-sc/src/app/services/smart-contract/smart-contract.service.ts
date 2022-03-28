import { Injectable } from '@angular/core';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class SmartContractService {  
  constructor() {
  }

  // Call deployment on BE
  public deployContract(): void {}

  // Call contract preview on BE
  public getContractPreview(): void {}

  // Call contract source preview on BE
  public getContractSourcePreview(): void {}

  // Call get contracts addresses on BE
  public getContractsAddresses(): void {}
}
