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
   selectedCountryCodes : string[] = [];

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
    
  if(JSON.parse(localStorage.getItem('currentUser')) == null || JSON.parse(localStorage.getItem('currentUser')) == '') {
          this.router.navigate(['']);
      }
    
  this.getAccountsFromService();
  this.getCountryCodes();
}

  getCountryCodes() {
  const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');
  let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
    if(selectCountryCodes != null && selectCountryCodes != 'undefined' && selectCountryCodes.length > 0) {
 	   this.countryCodes = new CountryISOCodeArrayDataModel();
 	   this.countryCodes.countryCodes = selectCountryCodes.split(',');
       return;
    } else {
    this.countryService.getCountryCodesForUser(userId).subscribe(result => this.countryCodes = result)
  }
  }

getAccountsFromService() {
  this.isLoading = true;
          let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
  const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');
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
        account.userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId')
                     //populate countrycode for next
       		 this.selectedCountryCodes.push(account.countryCode);
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

 next() {
  if(!this.accountFormGroup.pristine){
    this.submit();
    }
  }

previousTab() {
    let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId')
    
    
   if(this.selectedCountryCodes.length === 0) {
  	this.router.navigate(['/bankbranches/'+userId]);
  	}
  	else {
  	this.selectedCountryCodes = Array.from(new Set(this.selectedCountryCodes.map((itemInArray) => itemInArray)));

    this.router.navigate(['/bankbranches/'+userId+'/'+this.selectedCountryCodes]);
  	}
}
}
