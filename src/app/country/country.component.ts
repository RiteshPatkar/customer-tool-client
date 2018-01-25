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
  
  @Input() country: Country;
  @Input() updatedCountries: Country[];
  
//  countryArray: Observable<Country[]>;
   countryArray: Country[];
  countryFormGroup : FormGroup;
  isLoading = false;
  showNewRow = false;
  
  constructor(
    private countryFormBuilder : FormBuilder,
    private countryService: CountryService) {
    alert('constructor');
    this.createFormGroup();
  }
  
   createFormGroup() {
    alert('createFormGroup');
    this.countryFormGroup = this.countryFormBuilder.group({
      countries : this.countryFormBuilder.array([])
    });
  }
  
   ngOnChanges() {
    alert('onChange');
    this.countryFormGroup.reset({
    });
      this.setCountries(this.updatedCountries);
  }
  
  get countries(): FormArray {
    return this.countryFormGroup.get('countries') as FormArray
  }
  
  //compare again with example
   setCountries(countries : Country[]) {
    alert('setCountries');
    const countriesFormGroups = countries.map(country => this.countryFormBuilder.group(country));
    const countryFormArray = this.countryFormBuilder.array(countriesFormGroups);
    this.countryFormGroup.setControl('countries', countryFormArray);
  }
  
    add() {
    alert('in Add');
    this.showNewRow = true;
    this.countries.push(this.countryFormBuilder.group(new Country()));
  }
  
    submit() {
    alert('submit')
      this.showNewRow = false;
    this.updatedCountries = this.prepareForCRUD();
     alert(JSON.stringify(this.updatedCountries));
//    this.countryService.updateCountries(this.updatedCountries).subscribe(/* error handling */);
      let updatedCountries = this.countryService.updateCountries(this.updatedCountries);
       this.createFormGroup();
     alert(JSON.stringify(this.updatedCountries));
    this.setCountries(this.updatedCountries);
  }
  
    prepareForCRUD(): Country[] {
    const formModel = this.countryFormGroup.value;
      alert(JSON.stringify(formModel));
    const countriesDeepCopy: Country[] = formModel.countries.map(
      (country: Country) => Object.assign({}, country));
      alert(countriesDeepCopy.length);
    return countriesDeepCopy;
  }
  
  revert() { 
    this.createFormGroup();
    this.getCountriesFromService(); 
    this.setCountries(this.countryArray);
  }
  
  ngOnInit() { 
    alert('init');
    this.getCountriesFromService(); 
     this.setCountries(this.countryArray);
  }
  
  getCountriesFromService() {
    alert('getCountriesFromService');
    this.isLoading = true;
    this.countryArray = this.countryService.getCountries();
  }
  
  delete(i : number, country : Country) {
  
    //remove content from db
    this.countryService.removeCountry(country);
    
    this.updatedCountries = this.prepareForCRUD();
    this.updatedCountries.splice(i, 1);
    
    this.createFormGroup();
    this.setCountries(this.updatedCountries);
  }
  
  removeRow() {
    this.showNewRow = false;
    
     this.countryFormGroup.get('country.flag').setValue('');
     this.countryFormGroup.get('country.countryDescription').setValue('');
    this.countryFormGroup.get('country.countryCode').setValue('');
    this.countryFormGroup.get('country.postalCodeLength').setValue('');
  }
  
  next() {
  if(!this.countryFormGroup.pristine){
    this.submit();
    }
  }
  

  

}
