import { Component, OnInit } from '@angular/core';
import { Country } from '../country';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  country: Country = {
    flag: 'Y',
    countryCode: 'USA',
    countryDescription: 'America',
    currencyISOCode: 'USD',
    postalCodeLength: 5,
    postalCodePosition: 'Before'
  };

  constructor() { }

  ngOnInit() {
  }

}
