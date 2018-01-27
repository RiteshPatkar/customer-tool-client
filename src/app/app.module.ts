import {ReactiveFormsModule} from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './/app-routing.module';
import { AppComponent } from './app.component';

//import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
//import { InMemoryDataService } from './services/in-memory-data.service';

import { Ng2SmartTableModule } from 'ng2-smart-table';

import { CountryComponent } from './country/country.component';
import { CurrencyComponent } from './currency/currency.component';

import { CountryService } from './services/country.service';
import { CurrencyService } from './services/currency.service';
import { CalendarService } from './services/calendar.service';
import { CalendarComponent } from './calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    CountryComponent,
    CurrencyComponent,
    CalendarComponent
  ],
  //imports: [BrowserModule, HttpClientModule, HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false })],
  imports: [Ng2SmartTableModule, BrowserModule, AppRoutingModule, ReactiveFormsModule ],
  providers: [CountryService, CurrencyService, CalendarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
