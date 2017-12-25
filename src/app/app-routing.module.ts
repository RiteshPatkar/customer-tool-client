import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CountryComponent } from './country/country.component';
import { CurrencyComponent } from './currency/currency.component';

const routes: Routes = [
{ path: '', redirectTo: '/countries', pathMatch: 'full' },
  { path: 'countries', component: CountryComponent },
  { path: 'currencies', component: CurrencyComponent },
  { path: 'currency/:countryCode', component: CurrencyComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }