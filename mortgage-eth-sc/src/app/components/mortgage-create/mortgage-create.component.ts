import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OptionalFields, Mortgage, DeployedContractResponse } from 'src/app/services/smart-contract/smart-contract.service.d';
import { SmartContractService } from 'src/app/services/smart-contract/smart-contract.service';
import { ContractPreviewComponent } from '../contract-preview/contract-preview.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mortgage-create',
  templateUrl: './mortgage-create.component.html',
  styleUrls: ['./mortgage-create.component.scss']
})
export class MortgageCreateComponent {
  public mortgageForm: FormGroup = new FormGroup({
    property: new FormGroup({
      propertyId: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),  
      area: new FormControl(null, Validators.required),
      basePrice: new FormControl(null, Validators.required),
      basePriceLabel: new FormControl(null, Validators.required),
    }),
    buyer: new FormGroup({
      fullName: new FormControl(null, Validators.required),
      addressStreet: new FormControl(null, Validators.required),
      addressCity: new FormControl(null, Validators.required),
      personalId: new FormControl(null, Validators.required),
      mupId: new FormControl(null, Validators.required),
    }),
    seller: new FormGroup({
      fullName: new FormControl(null, Validators.required),
      addressStreet: new FormControl(null, Validators.required),
      addressCity: new FormControl(null, Validators.required),
      personalId: new FormControl(null, Validators.required),
      mupId: new FormControl(null, Validators.required),
    }),
    conclusionDate: new FormControl(null, Validators.required),
    conclusionAddress: new FormControl(null, Validators.required),
    courtInJurisdiction: new FormControl(null, Validators.required),
    taxPayer: new FormControl("Buyer", Validators.required),
    proxyFullName: new FormControl(null),
    proxyPersonalId: new FormControl(null),
    depositValue: new FormControl(null),
    depositValueLabel: new FormControl(null),
    paymentPartsNum: new FormControl(null),
    movingOutDate: new FormControl(null),
    utilitiesPaid: new FormControl(null),
  })
  public conditionalFields: OptionalFields = {
    proxyActive: false,
    depositActive: false,
    paymentPartsActive: false,
    movingOutActive: false,
    utilitiesActive: false,
  }

  constructor(
    private _smartContractService: SmartContractService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _router: Router,
    ) {}

  public toggle(key: 'proxyActive' | 'depositActive' | 'paymentPartsActive' | 'movingOutActive' | 'utilitiesActive'): void {
    if (key === 'utilitiesActive') {
      this.mortgageForm.get('utilitiesPaid')?.setValue(this.conditionalFields[key] ? null : true);
    }

    if (this.conditionalFields[key]) {
      switch (key) {
        case 'proxyActive':
          this.mortgageForm.get('proxyFullName')?.setValue(null);
          this.mortgageForm.get('proxyPersonalId')?.setValue(null);
          break;
        case 'depositActive':
          this.mortgageForm.get('depositValue')?.setValue(null);
          this.mortgageForm.get('depositValueLabel')?.setValue(null);
          break;
        case 'paymentPartsActive':
          this.mortgageForm.get('paymentPartsNum')?.setValue(null);
          break;
        case 'movingOutActive':
          this.mortgageForm.get('movingOutDate')?.setValue(null);
          break;
      }
    }

    this.conditionalFields[key] = !this.conditionalFields[key]
  }

  public isOptionalValid(): boolean {
    const mortgage = this.mortgageForm.value;
    let valid = true;
  
    if (this.conditionalFields.proxyActive) {
      valid = valid && mortgage.proxyFullName && mortgage.proxyFullName.trim().length > 0;
      valid = valid && mortgage.proxyPersonalId && mortgage.proxyPersonalId.trim().length > 0;
    }

    if (this.conditionalFields.depositActive) {
      valid = valid && mortgage.depositValue !== null && mortgage.depositValue > 0;
      valid = valid && mortgage.depositValueLabel !== null && mortgage.depositValueLabel.trim().length > 0;
    }

    if (this.conditionalFields.paymentPartsActive) {
      valid = valid && mortgage.paymentPartsNum !== null && mortgage.paymentPartsNum > 0;
    }

    if (this.conditionalFields.movingOutActive) {
      valid = valid && mortgage.movingOutDate !== null && mortgage.movingOutDate.trim().length > 0;
    }

    if (this.conditionalFields.utilitiesActive) {
      valid = valid && mortgage.utilitiesPaid !== null;
    }

    return valid;
  }

  public onSubmit(): void {
    if (!this.mortgageForm.valid) {
      return;
    }

    if (!this.isOptionalValid()) {
      return;
    }

    const mortgageData = this.mortgageForm.value as Mortgage;
    this._smartContractService.deployContract(mortgageData).subscribe({
      next: (data: DeployedContractResponse) => {
        this._showSnackBar(`Contract deployed at address: ${data.contractAddress}`);
        this._router.navigateByUrl('/');
      },
      error: () => {
        this._showSnackBar('Deploy was not successful');
      }
    });
  }

  public preview(): void {
    const mortgageData = this.mortgageForm.value as Mortgage;
    this._smartContractService.getContractPreview(mortgageData).subscribe((previewData) => {
      this._dialog.open(ContractPreviewComponent, {
        width: '1100px',
        data: {
          contractSol: previewData.contractSol,
          contractSource: this._smartContractService.getContractSourcePreview(mortgageData)
        },
      });
    });
  }

  private _showSnackBar(message: string): void {
    this._snackBar.open(message, 'Close', { duration: 3500 });
  }
}
