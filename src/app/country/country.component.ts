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
  showNewRow = false;
  addRowCountArray = [];
  addRowCount = 0;
  
  constructor(
    private countryFormBuilder : FormBuilder,
    private countryService: CountryService) {
    alert('constructor');
    this.createFormGroup();
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
  
  
  createFormGroup() {
    alert('createFormGroup');
    this.countryFormGroup = this.countryFormBuilder.group({
      countries : this.countryFormBuilder.array([])
    });
  }
  
//  ngOnChanges() {
//    this.countryFormGroup.reset({
//      countryDescriptionFormControl: this.country.countryDescription,
//      countryCodeFormControl: this.country.countryCode,
//      postalCodeLengthFormControl: this.country.postalCodeLength,
//      countryFlagFormControl: this.country.flag
//    });
//    this.setCountries(this.countryArray);
//  }
  
    get countries(): FormArray {
    alert('getCountries');
    return this.countryFormGroup.get('countries') as FormArray
  }
  
  setCountries(countries : Country[]) {
    alert('setCountries');
    const countriesFormGroups = countries.map(country => this.countryFormBuilder.group(country));
    const countryFormArray = this.countryFormBuilder.array(countriesFormGroups);
    this.countryFormGroup.setControl('countries', countryFormArray);
  }
  
  revert() { 
    this.createFormGroup();
    this.getCountriesFromService(); 
    this.setCountries(this.countryArray);
  }
  
  add() {
    alert('add');
      this.showNewRow = true;
//      this.addRowCount++;
//    for(var i = 0; i<this.addRowCount; i++ ) {
//      this.addRowCountArray.concat([i]);
//    }
//    this.createItem();
  }
//  
//  createItem(): void {
//  this.countryFormBuilder.group({
//    name: '',
//    description: '',
//    price: ''
//  });
//}
  
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
