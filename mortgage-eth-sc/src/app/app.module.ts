import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MortgageCreateComponent } from './components/mortgage-create/mortgage-create.component';
import { MortgagePreviewComponent } from './components/mortgage-preview/mortgage-preview.component';
import { SmartContractService } from './services/smart-contract/smart-contract.service';
import { ContractPreviewComponent } from './components/contract-preview/contract-preview.component';
import { MatCommonModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    MortgageCreateComponent,
    MortgagePreviewComponent,
    ContractPreviewComponent,
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatCommonModule,
    FormsModule,
  ],
  providers: [
    SmartContractService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
