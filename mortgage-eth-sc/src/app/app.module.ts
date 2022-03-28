import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MortgageCreateComponent } from './components/mortgage-create/mortgage-create.component';
import { MortgagePreviewComponent } from './components/mortgage-preview/mortgage-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    MortgageCreateComponent,
    MortgagePreviewComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
