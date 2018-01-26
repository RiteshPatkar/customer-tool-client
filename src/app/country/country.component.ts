import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CountryArrayDataModel,  CountryDataModel} from '../data/countrytab-data-model';
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

  @Input() countryArrayData: CountryArrayDataModel;

  countryFormGroup : FormGroup;
  nameChangeLog: string[] = [];
 // countryDataFromService : Observable<CountryArrayDataModel>;
  countryDataFromService : CountryArrayDataModel;
  isLoading = false;
  showNewRow = false;

  constructor(
    private countryFormBuilder : FormBuilder,
    private countryService: CountryService) {
    this.createFormGroup();
  }

   createFormGroup() {
    this.countryFormGroup = this.countryFormBuilder.group({
      countriesOnScreen : this.countryFormBuilder.array([])
    });
  }

  ngOnInit() {
    this.getCountriesFromService();
	this.setCountries(this.countryDataFromService.countries);
  }

  getCountriesFromService() {
	this.isLoading = true;
	this.countryDataFromService = this.countryService.getCountries();
		//	.finally(() => this.isLoading = false);
  }

   ngOnChanges() {
    this.countryFormGroup.reset({
    });
      this.setCountries(this.countryArrayData.countries);
  }

  get countriesOnScreen(): FormArray {
    return this.countryFormGroup.get('countriesOnScreen') as FormArray
  }

   setCountries(countries : CountryDataModel[]) {
    const countriesFormGroups = countries.map(country => this.countryFormBuilder.group(country));
    const countryFormArray = this.countryFormBuilder.array(countriesFormGroups);
    this.countryFormGroup.setControl('countriesOnScreen', countryFormArray);
  }

    add() {
    this.showNewRow = true;
    this.countriesOnScreen.push(this.countryFormBuilder.group(new CountryDataModel()));
  }

    submit() {
    	this.showNewRow = false;
    	this.countryArrayData = this.prepareForSubmit();
//    this.countryService.updateCountries(this.countryArrayData).subscribe(/* error handling */);
      	let updatedCountries = this.countryService.updateCountries(this.countryArrayData);
		this.ngOnChanges();
  }

    prepareForSubmit(): CountryArrayDataModel {
    	const formModel = this.countryFormGroup.value;
		const countriesOnScreenDeepCopy: CountryDataModel[] = formModel.countriesOnScreen.map(
      		(country: CountryDataModel) => Object.assign({}, country));
		const saveCountryArrayDataModel : CountryArrayDataModel = {
			countries : countriesOnScreenDeepCopy
		}

    return saveCountryArrayDataModel;
  }

 revert() {
	this.ngOnChanges();
	}

  delete(i : number, country : CountryDataModel) {
    this.countryService.removeCountry(country);
	this.countriesOnScreen.removeAt(i);
  }

//Not used Yet
  next() {
  if(!this.countryFormGroup.pristine){
    this.submit();
    }
  }
}
