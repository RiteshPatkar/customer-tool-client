import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { IndexKind } from "typescript";
import { Location } from '@angular/common';
import { AccountArrayDataModel,  AccountDataModel} from '../data/accounttab-data-model';
import { CountryISOCodeArrayDataModel} from '../data/countrytab-data-model';
import { AccountService } from '../services/account.service';
import { CountryService } from '../services/country.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

@Input() accountArrayData: AccountArrayDataModel;

accountFormGroup : FormGroup;
nameChangeLog: string[] = [];
isLoading = false;
showNewRow = false;
countryCodes : CountryISOCodeArrayDataModel;

constructor(
  private accountFormBuilder : FormBuilder,
  private router: Router,
  private activatedRoute: ActivatedRoute,
  private accountService: AccountService,
  private countryService: CountryService) {
  this.createFormGroup();
}

 createFormGroup() {
  this.accountFormGroup = this.accountFormBuilder.group({
	accountsOnScreen : this.accountFormBuilder.array([])
  });
}

ngOnInit() {
  this.getAccountsFromService();
  this.getCountryCodes();
}

  getCountryCodes() {
  alert('populate country codes for account');
  const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');
  const userId = +this.activatedRoute.snapshot.paramMap.get('userId');
  alert(selectCountryCodes);
    if(selectCountryCodes != null && selectCountryCodes != 'undefined' && selectCountryCodes.length > 0) {
 	   alert(JSON.stringify(this.countryCodes, null, 4));
 	   alert(selectCountryCodes.split(','));
 	   this.countryCodes = new CountryISOCodeArrayDataModel();
 	   this.countryCodes.countryCodes = selectCountryCodes.split(',');
       return;
    } else {
    this.countryService.getCountryCodesForUser(userId).subscribe(result => this.countryCodes = result)
  }
  }

getAccountsFromService() {
  this.isLoading = true;
  const userId = +this.activatedRoute.snapshot.paramMap.get('userId');
  const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');
  alert(selectCountryCodes)
  if(selectCountryCodes != null && selectCountryCodes != 'undefined' && selectCountryCodes.length > 0) {
//    var countryCodeArray = selectCountryCodes.split(',');
//    if(countryCodeArray.length > 0) {
    this.accountService.getAccountsByCountry(userId, selectCountryCodes).subscribe(accountArrayData => this.setAccounts(accountArrayData.accounts))
    return;
    }
    this.accountService.getAccounts(userId).subscribe(accountArrayData => this.setAccounts(accountArrayData.accounts));
	  //	.finally(() => this.isLoading = false);
}

 ngOnChanges() {
  this.accountFormGroup.reset({
  });
	this.setAccounts(this.accountArrayData.accounts);
}

get accountsOnScreen(): FormArray {
  return this.accountFormGroup.get('accountsOnScreen') as FormArray
}

 setAccounts(accounts : AccountDataModel[]) {
  alert('IN Currenty set');
  alert(JSON.stringify(accounts, null, 4));
  const accountsFormGroups = accounts.map(account => this.accountFormBuilder.group(account));
  const accountFormArray = this.accountFormBuilder.array(accountsFormGroups);
  this.accountFormGroup.setControl('accountsOnScreen', accountFormArray);
}

  add() {
  this.showNewRow = true;
  this.accountsOnScreen.push(this.accountFormBuilder.group(new AccountDataModel()));
}

  submit() {
	  this.showNewRow = false;
	  this.accountArrayData = this.prepareForSubmit();
    this.accountService.updateAccounts(this.accountArrayData).subscribe();
//	  let updatedAccounts = this.accountService.updateAccounts(this.accountArrayData);
	  this.ngOnChanges();
}

  prepareForSubmit(): AccountArrayDataModel {
	  const formModel = this.accountFormGroup.value;
	  const accountsOnScreenDeepCopy: AccountDataModel[] = formModel.accountsOnScreen.map(
		  (account: AccountDataModel) => Object.assign({}, account));

    for(let account of accountsOnScreenDeepCopy) {
        alert(this.activatedRoute.snapshot.paramMap.get('userId'));
        account.userId = this.activatedRoute.snapshot.paramMap.get('userId')
      }

	  const saveAccountArrayDataModel : AccountArrayDataModel = {
		  accounts : accountsOnScreenDeepCopy
	  }

  return saveAccountArrayDataModel;
}

revert() {
  this.ngOnChanges();
  }

delete(i : number, account : AccountDataModel) {
  this.accountService.removeAccount(account);
  this.accountsOnScreen.removeAt(i);
}

previousTab() {
	this.router.navigate(['/bankBranches/'+this.activatedRoute.snapshot.paramMap.get('userId')]);
}
}
