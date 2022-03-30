import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SmartContractService } from 'src/app/services/smart-contract/smart-contract.service';
import { ContractSourceData } from 'src/app/services/smart-contract/smart-contract.service.d';

@Component({
  selector: 'app-contract-preview',
  templateUrl: './contract-preview.component.html',
  styleUrls: ['./contract-preview.component.scss']
})
export class ContractPreviewComponent {
  public leftContent: string = '';
  public rightContent: ContractSourceData | undefined = undefined;

  constructor(
    private _dialogRef: MatDialogRef<ContractPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) _data: { contractSol: string, contractSource: ContractSourceData | undefined } | null
    ) {
    this.leftContent = _data?.contractSol ?? 'Empty';
    this.rightContent = _data?.contractSource;
  }

  public close(): void {
    this._dialogRef.close();
  }
}
