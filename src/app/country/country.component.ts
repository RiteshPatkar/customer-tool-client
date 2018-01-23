import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Country } from '../data/country';
import { COUNTRIES } from '../mock-data/mock-countries';
import { CountryService } from '../services/country.service';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { IndexKind } from "typescript";

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
  @Input() updatedCountries: Country[];
  isLoading = false;
  
  constructor(
    private countryFormBuilder : FormBuilder,
    private countryService: CountryService) {
    alert(1)
    this.createFormGroup();
  }
  
  ngOnInit() { 
    alert(2)
    this.getCountriesFromService(); 
     this.setCountries(this.countryArray);
  }
  
  getCountriesFromService() {
    this.isLoading = true;
    this.countryArray = this.countryService.getCountries();
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
//    this.setCountries(this.countryArray);
    this.createFormGroup();
    this.getCountriesFromService(); 
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
  
  revert() { 
    alert(3);
//    this.createFormGroup();
//    this.getCountriesFromService(); 
//    this.setCountries(this.countryArray);
    this.ngOnChanges(); 
  }
  
  add() {}
  
  delete(i : number, country : Country) {
  
    //remove content from db
    this.countryService.removeCountry(country);
    
    this.updatedCountries = this.prepareForCRUD();
    this.updatedCountries.splice(i, 1);
    
    this.createFormGroup();
    this.setCountries(this.updatedCountries);
  }
  
  next() {
  if(!this.countryFormGroup.pristine){
    this.submit();
    }
  }
  
   submit() {
    alert('submit')
    this.updatedCountries = this.prepareForCRUD();
//    this.countryService.updateCountries(this.updatedCountries).subscribe(/* error handling */);
      let updatedCountries = this.countryService.updateCountries(this.updatedCountries);
//    this.ngOnChanges();
       this.createFormGroup();
    this.setCountries(this.updatedCountries);
  }
  
    prepareForCRUD(): Country[] {
    const formModel = this.countryFormGroup.value;
    const countriesDeepCopy: Country[] = formModel.countries.map(
      (country: Country) => Object.assign({}, country)
    );
    return countriesDeepCopy;
  }

}
