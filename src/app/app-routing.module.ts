import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from './account/account.component';
import { BankComponent } from './bank/bank.component';
import { BankBranchComponent } from './bankbranch/bankbranch.component';
import { CountryComponent } from './country/country.component';
import { CurrencyComponent } from './currency/currency.component';
import { CompanyComponent } from './company/company.component';
import { CalendarComponent } from './calendar/calendar.component';

const routes: Routes = [
	{ path: '', redirectTo: '/countries/:userId', pathMatch: 'full' },
  	{ path: 'countries/:userId', component: CountryComponent },
  	{ path: 'currencies', component: CurrencyComponent },
  	{ path: 'currency/:countryCode', component: CurrencyComponent },
  	{ path: 'calendars', component: CalendarComponent },
   	{ path: 'companies', component: CompanyComponent },
  	{ path: 'banks', component: BankComponent },
    { path: 'bankbranches', component: BankBranchComponent },
    { path: 'accounts', component: AccountComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
