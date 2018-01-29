import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CurrencyArrayDataModel,  CurrencyDataModel} from '../data/currencytab-data-model';
import { CURRENCIES } from '../mock-data/mock-currencies';
import { CurrencyService } from '../services/currency.service';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { IndexKind } from "typescript";
import { Router } from '@angular/router';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

@Input() currencyArrayData: CurrencyArrayDataModel;

currencyFormGroup : FormGroup;
nameChangeLog: string[] = [];
// currencyDataFromService : Observable<CurrencyArrayDataModel>;
currencyDataFromService : CurrencyArrayDataModel;
isLoading = false;
showNewRow = false;

constructor(
  private currencyFormBuilder : FormBuilder,
  private router: Router,
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
  this.setCurrencies(this.currencyDataFromService.currencies);
}

getCurrenciesFromService() {
  this.isLoading = true;
  this.currencyDataFromService = this.currencyService.getCurrenciesByCountry([]);
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
//    this.currencyService.updateCurrencies(this.currencyArrayData).subscribe(/* error handling */);
	  let updatedCurrencies = this.currencyService.updateCurrencies(this.currencyArrayData);
	  this.ngOnChanges();
}

  prepareForSubmit(): CurrencyArrayDataModel {
	  const formModel = this.currencyFormGroup.value;
	  const currenciesOnScreenDeepCopy: CurrencyDataModel[] = formModel.currenciesOnScreen.map(
		  (currency: CurrencyDataModel) => Object.assign({}, currency));
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
  this.router.navigate(['/calendars']);
}

previousTab() {
	this.router.navigate(['/countries']);
}

nextTab() {
  this.router.navigate(['/calendars']);
}
}
