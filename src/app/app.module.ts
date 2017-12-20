import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

//import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
//import { InMemoryDataService } from './services/in-memory-data.service';

import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AppComponent } from './app.component';
import { CountryComponent } from './country/country.component';
import { CountryService } from './services/country.service';


@NgModule({
  declarations: [
    AppComponent,
    CountryComponent
  ],
  //imports: [BrowserModule, HttpClientModule, HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false })],
  imports: [Ng2SmartTableModule, BrowserModule],
  providers: [CountryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
