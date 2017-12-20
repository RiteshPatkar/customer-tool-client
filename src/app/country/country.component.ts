import { Component, OnInit } from '@angular/core';
import { Country } from '../data/country';
import { CountryService } from '../services/country.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  template: `<ng2-smart-table [settings]="settings" [source] = "countries"></ng2-smart-table>`,
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  countries: Country[];
  selectedCountry: Country;

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

}
