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
  	{ path: 'currencies/:userId/:selectedCountryCodes', component: CurrencyComponent },
  	{ path: 'currencies/:userId', component: CurrencyComponent },
		{ path: 'calendars/:userId/:selectedCountryCodes', component: CalendarComponent },
		{ path: 'calendars/:userId', component: CalendarComponent },
		{ path: 'companies/:userId/:selectedCountryCodes', component: CompanyComponent },
		{ path: 'companies/:userId', component: CompanyComponent },
		{ path: 'banks/:userId/:selectedCountryCodes', component: BankComponent },
		{ path: 'banks/:userId', component: BankComponent },
		{ path: 'bankbranches/:userId/:selectedCountryCodes', component: BankBranchComponent },
		{ path: 'bankbranches/:userId', component: BankBranchComponent },
		{ path: 'accounts/:userId/:selectedCountryCodes', component: AccountComponent },
		{ path: 'accounts/:userId', component: AccountComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
