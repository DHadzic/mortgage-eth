import { Component, OnDestroy } from '@angular/core';
import { Mortgage, OptionalFields } from 'src/app/services/smart-contract/smart-contract.service.d';
import { SmartContractService } from 'src/app/services/smart-contract/smart-contract.service';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mortgage-preview',
  templateUrl: './mortgage-preview.component.html',
  styleUrls: ['./mortgage-preview.component.scss']
})
export class MortgagePreviewComponent {
  public mortgageData$: Observable<Mortgage | null>;
  public addresses: string[] = [];

  constructor(
    private _smartContractService: SmartContractService,
    private _snackBar: MatSnackBar,
  ) {
    this.mortgageData$ = this._smartContractService.mortgageData$
    lastValueFrom(this._smartContractService.getContractsAddresses()).then((data: string[]) => {
      this.addresses = data;
    });
   }

  public loadContract(address: string): void {
    this._smartContractService.getContractData(address).catch(
      () => {
        this._snackBar.open('Something went wrong while fetching data', 'Close', { duration: 3500 });
      }
    );
  }
}
