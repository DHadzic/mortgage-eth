import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MortgageCreateComponent } from './components/mortgage-create/mortgage-create.component';
import { MortgagePreviewComponent } from './components/mortgage-preview/mortgage-preview.component';

const routes: Routes = [
  {
    path: "",
    component: MortgagePreviewComponent,
  },
  {
    path: "create",
    component: MortgageCreateComponent,
  },
  {
    path: "**",
    redirectTo: "/",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
