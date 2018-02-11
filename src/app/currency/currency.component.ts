import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { IndexKind } from "typescript";
import { Location } from '@angular/common';
import { CurrencyArrayDataModel,  CurrencyDataModel} from '../data/currencytab-data-model';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

@Input() currencyArrayData: CurrencyArrayDataModel;

currencyFormGroup : FormGroup;
nameChangeLog: string[] = [];
isLoading = false;
showNewRow = false;

constructor(
  private currencyFormBuilder : FormBuilder,
  private router: Router,
  private activatedRoute: ActivatedRoute,
  private currencyService: CurrencyService) {
  this.createFormGroup();
}

 createFormGroup() {
  this.currencyFormGroup = this.currencyFormBuilder.group({
	currenciesOnScreen : this.currencyFormBuilder.array([])
  });
}

ngOnInit() {
  this.getCurrenciesFromService();
}

getCurrenciesFromService() {
  this.isLoading = true;
  const userId = +this.activatedRoute.snapshot.paramMap.get('userId');
  const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');
  alert(selectCountryCodes)
  if(selectCountryCodes != null && selectCountryCodes != 'undefined' && selectCountryCodes.length > 0) {
//    var countryCodeArray = selectCountryCodes.split(',');
//    if(countryCodeArray.length > 0) {
    this.currencyService.getCurrenciesByCountry(userId, selectCountryCodes).subscribe(currencyArrayData => this.setCurrencies(currencyArrayData.currencies))
    return;
    }
    this.currencyService.getCurrencies(userId).subscribe(currencyArrayData => this.setCurrencies(currencyArrayData.currencies));
	  //	.finally(() => this.isLoading = false);
}

 ngOnChanges() {
  this.currencyFormGroup.reset({
  });
	this.setCurrencies(this.currencyArrayData.currencies);
}

get currenciesOnScreen(): FormArray {
  return this.currencyFormGroup.get('currenciesOnScreen') as FormArray
}

 setCurrencies(currencies : CurrencyDataModel[]) {
  alert('IN Currenty set');
  alert(JSON.stringify(currencies, null, 4));
  const currenciesFormGroups = currencies.map(currency => this.currencyFormBuilder.group(currency));
  const currencyFormArray = this.currencyFormBuilder.array(currenciesFormGroups);
  this.currencyFormGroup.setControl('currenciesOnScreen', currencyFormArray);
}

  add() {
  this.showNewRow = true;
  this.currenciesOnScreen.push(this.currencyFormBuilder.group(new CurrencyDataModel()));
}

  submit() {
	  this.showNewRow = false;
	  this.currencyArrayData = this.prepareForSubmit();
    this.currencyService.updateCurrencies(this.currencyArrayData).subscribe();
//	  let updatedCurrencies = this.currencyService.updateCurrencies(this.currencyArrayData);
	  this.ngOnChanges();
}

  prepareForSubmit(): CurrencyArrayDataModel {
	  const formModel = this.currencyFormGroup.value;
	  const currenciesOnScreenDeepCopy: CurrencyDataModel[] = formModel.currenciesOnScreen.map(
		  (currency: CurrencyDataModel) => Object.assign({}, currency));
    
    for(let currency of currenciesOnScreenDeepCopy) {
        alert(this.activatedRoute.snapshot.paramMap.get('userId'));
        currency.userId = this.activatedRoute.snapshot.paramMap.get('userId')
      }
    
	  const saveCurrencyArrayDataModel : CurrencyArrayDataModel = {
		  currencies : currenciesOnScreenDeepCopy
	  }

  return saveCurrencyArrayDataModel;
}

revert() {
  this.ngOnChanges();
  }

delete(i : number, currency : CurrencyDataModel) {
  this.currencyService.removeCurrency(currency);
  this.currenciesOnScreen.removeAt(i);
}

next() {
if(!this.currencyFormGroup.pristine){
  this.submit();
  }
  this.router.navigate(['/calendars/']);
}

previousTab() {
	this.router.navigate(['/countries/'+this.activatedRoute.snapshot.paramMap.get('userId')]);
}

nextTab() {
  this.router.navigate(['/calendars']);
}
}
