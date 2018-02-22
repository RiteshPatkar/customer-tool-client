import {ReactiveFormsModule, FormsModule} from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
//import { InMemoryDataService } from './services/in-memory-data.service';

import { Ng2SmartTableModule } from 'ng2-smart-table';

import { BankComponent } from './bank/bank.component';
import { BankBranchComponent } from './bankbranch/bankbranch.component';
import { CountryComponent } from './country/country.component';
import { CurrencyComponent } from './currency/currency.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CompanyComponent } from './company/company.component';
import { AccountComponent } from './account/account.component';
import { AlertComponent } from './directives/index';
import { AuthGuard } from './guards/index';
import { JwtInterceptor } from './helpers/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';

import { AccountService } from './services/account.service';
import { BankService } from './services/bank.service';
import { BankBranchService } from './services/bankbranch.service';
import { CountryService } from './services/country.service';
import { CurrencyService } from './services/currency.service';
import { CalendarService } from './services/calendar.service';
import { CompanyService } from './services/company.service';
import { MessageService } from './services/message.service';
import { AlertService, AuthenticationService, UserService } from './services/index';

// used to create fake backend
import { fakeBackendProvider } from './helpers/index';


@NgModule({
  declarations: [
    AppComponent,
    CountryComponent,
    CurrencyComponent,
    CalendarComponent,
    BankComponent,
    CompanyComponent,
    BankBranchComponent,
    AccountComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent
  ],
  //imports: [BrowserModule, HttpClientModule, HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false })],
  imports: [Ng2SmartTableModule, BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule, HttpClientModule ],
  providers: [
    CountryService,
    CurrencyService,
    CalendarService,
    BankService,
    CompanyService,
    BankBranchService,
    AccountService,
    MessageService,
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
      {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        },
// provider used to create fake backend
fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
