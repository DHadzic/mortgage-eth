import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OptionalFields, Mortgage } from 'src/app/services/smart-contract/smart-contract.service.d';
import { SmartContractService } from 'src/app/services/smart-contract/smart-contract.service';
import { ContractPreviewComponent } from '../contract-preview/contract-preview.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mortgage-create',
  templateUrl: './mortgage-create.component.html',
  styleUrls: ['./mortgage-create.component.scss']
})
export class MortgageCreateComponent implements OnInit {
  public mortgageForm: FormGroup = new FormGroup({
    propertyId: new FormControl(null, Validators.required),
    basePrice: new FormControl(null, Validators.required),
    basePriceLabel: new FormControl(null, Validators.required),
    area: new FormControl(null, Validators.required),
    buyer: new FormGroup({
      fullName: new FormControl(null, Validators.required),
      addressStreet: new FormControl(null, Validators.required),
      addressCity: new FormControl(null, Validators.required),
    }),
    seller: new FormGroup({
      fullName: new FormControl(null, Validators.required),
      addressStreet: new FormControl(null, Validators.required),
      addressCity: new FormControl(null, Validators.required),
    }),
    conclusionDate: new FormControl(null, Validators.required),
    conclusionAddress: new FormControl(null, Validators.required),
    courtInJurisdiction: new FormControl(null, Validators.required),
    taxPayer: new FormControl(null, Validators.required),
    byProxy: new FormControl(null),
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
    private _dialog: MatDialog
    ) {}

  public ngOnInit(): void {
  }

  public toggle(key: 'proxyActive' | 'depositActive' | 'paymentPartsActive' | 'movingOutActive' | 'utilitiesActive'): void {
    if (key === 'proxyActive') {
      this.mortgageForm.get('byProxy')?.setValue(this.conditionalFields[key] ? null : true);
    }

    if (key === 'utilitiesActive') {
      this.mortgageForm.get('utilitiesPaid')?.setValue(this.conditionalFields[key] ? null : true);
    }

    if (this.conditionalFields[key]) {
      switch (key) {
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
      valid = valid && mortgage.byProxy !== null;
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
    this._smartContractService.deployContract(mortgageData).subscribe(console.log);
  }

  public preview(): void {
    const mortgageData = this.mortgageForm.value as Mortgage;
    this._smartContractService.getContractPreview(mortgageData).subscribe((previewData) => {
      this._dialog.open(ContractPreviewComponent, {
        width: '1100px',
        data: { contractSol: previewData.contractSource, contractSource: ''},
      });
    });
  }
}
