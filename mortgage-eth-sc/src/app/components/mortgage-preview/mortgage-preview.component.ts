import { Component } from '@angular/core';
import { Mortgage, OptionalFields } from 'src/app/services/smart-contract/smart-contract.service.d';
import { SmartContractService } from 'src/app/services/smart-contract/smart-contract.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-mortgage-preview',
  templateUrl: './mortgage-preview.component.html',
  styleUrls: ['./mortgage-preview.component.scss']
})
export class MortgagePreviewComponent {
  public mortgageData: Mortgage = {
    propertyId: 'asd',
    basePrice: +'1',
    basePriceLabel: 'asd',
    area: +'1',
    address: 'asd',
    buyer: {
      fullName: 'asd',
      addressStreet: 'asd',
      addressCity: 'asd',
      personalId: 'asd',
      mupId: 'asd',
    },
    seller: {
      fullName: 'asd',
      addressStreet: 'asd',
      addressCity: 'asd',
      personalId: 'asd',
      mupId: 'asd',
    },
    conclusionDate: 'asd',
    conclusionAddress: 'asd',
    courtInJurisdiction: 'asd',
    taxPayer: 'BUYER',
    proxyFullName: 'asd',
    proxyPersonalId: 'asd',
    depositValue: +'1',
    depositValueLabel: 'asd',
    paymentPartsNum: +'1',
    movingOutDate: 'asd',
    utilitiesPaid: true,
  };
  public conditionalFields: OptionalFields = {
    proxyActive: false,
    depositActive: false,
    paymentPartsActive: false,
    movingOutActive: false,
    utilitiesActive: false,
  }
  public isLoading = true;
  public addresses: string[] = [];

  constructor(private _smartContractService: SmartContractService) {
    lastValueFrom(this._smartContractService.getContractsAddresses()).then((data: string[]) => {
      this.addresses = data;
    });
   }

   public loadContract(address: string): void {
    this._smartContractService.getContractData(address);
   }
}
