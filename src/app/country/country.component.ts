import { Component, OnInit } from '@angular/core';
import { Country } from '../data/country';
import { CountryService } from '../services/country.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  countries: Country[];
  selectedCountry: Country;
  settings = {
    columns: {
      flag: {
      title: 'Flag'
      },
      countryCode: {
      title: 'Country Code'
      },
      countryDescription: {
      title: 'Desciption'
      },
      postalCodeLength: {
      title: 'Postal Code Length'
      },
      postalCodePosition: {
      title: 'Position'
      }
    }
};

  constructor(private countryService: CountryService) { }

  ngOnInit() {
    this.getCountries();
  }

  getCountries(): void {
    this.countryService.getCountries().subscribe(countries => this.countries = countries);
  }

  onSelect(country: Country): void {
    this.selectedCountry = country;
  }
}
