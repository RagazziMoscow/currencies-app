import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CurrenciesComponent } from "./currencies/currencies.component";
import { AboutComponent } from "./about/about.component";

const routerConfig: Routes = [
  {
    path: "",
    component: CurrenciesComponent
  },
  {
    path: "about",
    component: AboutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routerConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
