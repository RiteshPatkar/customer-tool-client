import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from './account/account.component';
import { BankComponent } from './bank/bank.component';
import { BankBranchComponent } from './bankbranch/bankbranch.component';
import { CountryComponent } from './country/country.component';
import { CurrencyComponent } from './currency/currency.component';
import { CompanyComponent } from './company/company.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { AuthGuard } from './guards/index';

const routes: Routes = [
    // { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: '', component: LoginComponent },
    // otherwise redirect to home
    // { path: '**', redirectTo: 'login' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'countries/:userId', component: CountryComponent },
    { path: 'countries', component: CountryComponent },
    { path: 'currencies/:userId/:selectedCountryCodes', component: CurrencyComponent },
    { path: 'currencies/:userId', component: CurrencyComponent },
    { path: 'currencies', component: CurrencyComponent },
    { path: 'calendars/:userId/:selectedCountryCodes', component: CalendarComponent },
    { path: 'calendars/:userId', component: CalendarComponent },
    { path: 'calendars', component: CalendarComponent },
    { path: 'companies/:userId/:selectedCountryCodes', component: CompanyComponent },
    { path: 'companies/:userId', component: CompanyComponent },
    { path: 'companies', component: CompanyComponent },
    { path: 'banks/:userId/:selectedCountryCodes', component: BankComponent },
    { path: 'banks/:userId', component: BankComponent },
    { path: 'banks', component: BankComponent },
    { path: 'bankbranches/:userId/:selectedCountryCodes', component: BankBranchComponent },
    { path: 'bankbranches/:userId', component: BankBranchComponent },
    { path: 'bankbranches', component: BankBranchComponent },
    { path: 'accounts/:userId/:selectedCountryCodes', component: AccountComponent },
    { path: 'accounts/:userId', component: AccountComponent },
    { path: 'accounts', component: AccountComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

export const routing = RouterModule.forRoot(routes);

 