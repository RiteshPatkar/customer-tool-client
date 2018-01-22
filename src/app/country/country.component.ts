import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Country } from '../data/country';
import { COUNTRIES } from '../mock-data/mock-countries';
import { CountryService } from '../services/country.service';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})

export class CountryComponent implements OnInit {
  
//  countryArray: Observable<Country[]>;
   countryArray: Country[];
  countryFormGroup : FormGroup;
  @Input() country: Country;
  isLoading = false;
  
  constructor(
    private countryFormBuilder : FormBuilder,
    private countryService: CountryService) {
    this.createFormGroup();
  }
  
  ngOnInit() { 
    this.getCountriesFromService(); 
    this.ngOnChanges();
  }
  
  getCountriesFromService() {
//    this.isLoading = true;
//    this.countryArray = this.countryService.getCountries()
//                      .finally(() => this.isLoading = false);
    
     this.countryArray = COUNTRIES;
  }
  
  
  createFormGroup() {
    this.countryFormGroup = this.countryFormBuilder.group({
      countries : this.countryFormBuilder.array([])
    });
  }
  
  ngOnChanges() {
//    this.countryFormGroup.reset({
//      countryDescriptionFormControl: this.country.countryDescription,
//      countryCodeFormControl: this.country.countryCode,
//      postalCodeLengthFormControl: this.country.postalCodeLength,
//      countryFlagFormControl: this.country.flag
//    });
    this.setCountries(this.countryArray);
  }
  
    get countries(): FormArray {
    return this.countryFormGroup.get('countries') as FormArray
  }
  
  setCountries(countries : Country[]) {
    const countriesFormGroups = countries.map(country => this.countryFormBuilder.group(country));
    const countryFormArray = this.countryFormBuilder.array(countriesFormGroups);
    this.countryFormGroup.setControl('countries', countryFormArray);
  }
  
  revert() { this.ngOnChanges(); }
  

}
