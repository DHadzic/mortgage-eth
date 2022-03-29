import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OptionalFields, Mortgage } from 'src/app/services/smart-contract/smart-contract.service.d';
import { SmartContractService } from 'src/app/services/smart-contract/smart-contract.service';

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

  constructor(private _smartContractService: SmartContractService) {}

  public ngOnInit(): void {
  }

  public toggle(key: 'proxyActive' | 'depositActive' | 'paymentPartsActive' | 'movingOutActive' | 'utilitiesActive'): void {
    this.conditionalFields[key] = !this.conditionalFields[key]
  }

  public onSubmit(): void {
    console.log(this.mortgageForm.value);
    console.log(this.mortgageForm.valid);

    if (!this.mortgageForm.valid) {
      return;
    }

    const mortgageDate = this.mortgageForm.value as Mortgage;
    this._smartContractService.deployContract(mortgageDate).subscribe(console.log);
  }

  public preview(): void {
  }
}
