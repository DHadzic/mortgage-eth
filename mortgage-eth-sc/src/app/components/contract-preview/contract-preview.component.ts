import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
      console.log(_data?.contractSol);
      this.leftContent = _data?.contractSol ?? 'Empty';
      this.rightContent = {
        title: 'Some text title',
        header: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        acts: [{
          title: 'Clan 1',
          body: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
        }, {
          title: 'Clan 2',
          body: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
        }],
      } as ContractSourceData;
      // this.rightContent = _data?.contractSource;
  }

  public close(): void {
    this._dialogRef.close();
  }
}
