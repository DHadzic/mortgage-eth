import { Injectable } from '@angular/core';
import { DeployedContractResponse, ContractSourceResponse, Mortgage, DeployedContractData } from './smart-contract.service.d';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmartContractService {  
  private _url = 'http://localhost:3000';

  constructor(private _http: HttpClient) {
  }

  public deployContract(data: Mortgage): Observable<DeployedContractResponse> {
    return this._http.post<DeployedContractResponse>(this._url + '/contract', data);
  }

  public getContractPreview(data: Mortgage): Observable<ContractSourceResponse> {
    return this._http.post<ContractSourceResponse>(this._url + '/contract-preview', data);
  }

  // Interpolate and object with data
  public getContractSourcePreview(data: Mortgage): void {
    // Return new object with Clan 1, Clan 2 etc.
  }

  public getContractsAddresses(): Observable<DeployedContractData[]> {
    return this._http.get<DeployedContractData[]>(this._url + '/contracts');
  }
}
