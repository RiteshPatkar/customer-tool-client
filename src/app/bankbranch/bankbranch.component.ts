import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { IndexKind } from "typescript";
import { Location } from '@angular/common';
import { BankBranchArrayDataModel,  BankBranchDataModel} from '../data/bankbranchtab-data-model';
import { CountryISOCodeArrayDataModel} from '../data/countrytab-data-model';
import { BankBranchService } from '../services/bankbranch.service';
import { CountryService } from '../services/country.service';

@Component({
  selector: 'app-bankbranch',
  templateUrl: './bankbranch.component.html',
  styleUrls: ['./bankbranch.component.css']
})
export class BankBranchComponent implements OnInit {

@Input() bankBranchArrayData: BankBranchArrayDataModel;

bankBranchFormGroup : FormGroup;
nameChangeLog: string[] = [];
isLoading = false;
showNewRow = false;
countryCodes : CountryISOCodeArrayDataModel;
   selectedCountryCodes : string[] = [];

constructor(
  private bankBranchFormBuilder : FormBuilder,
  private router: Router,
  private activatedRoute: ActivatedRoute,
  private bankBranchService: BankBranchService,
  private countryService: CountryService) {
  this.createFormGroup();
}

 createFormGroup() {
  this.bankBranchFormGroup = this.bankBranchFormBuilder.group({
	bankBranchesOnScreen : this.bankBranchFormBuilder.array([])
  });
}

ngOnInit() {
  this.getBankBranchesFromService();
  this.getCountryCodes();
}

  getCountryCodes() {
  alert('populate country codes for bankBranch');
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

getBankBranchesFromService() {
  this.isLoading = true;
  const userId = +this.activatedRoute.snapshot.paramMap.get('userId');
  const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');
  alert(selectCountryCodes)
  if(selectCountryCodes != null && selectCountryCodes != 'undefined' && selectCountryCodes.length > 0) {
//    var countryCodeArray = selectCountryCodes.split(',');
//    if(countryCodeArray.length > 0) {
    this.bankBranchService.getBankBranchesByCountry(userId, selectCountryCodes).subscribe(bankBranchArrayData => this.setBankBranches(bankBranchArrayData.bankBranches))
    return;
    }
    this.bankBranchService.getBankBranches(userId).subscribe(bankBranchArrayData => this.setBankBranches(bankBranchArrayData.bankBranches));
	  //	.finally(() => this.isLoading = false);
}

 ngOnChanges() {
  this.bankBranchFormGroup.reset({
  });
	this.setBankBranches(this.bankBranchArrayData.bankBranches);
}

get bankBranchesOnScreen(): FormArray {
  return this.bankBranchFormGroup.get('bankBranchesOnScreen') as FormArray
}

 setBankBranches(bankBranches : BankBranchDataModel[]) {
  alert('IN Currenty set');
  alert(JSON.stringify(bankBranches, null, 4));
  const bankBranchesFormGroups = bankBranches.map(bankBranch => this.bankBranchFormBuilder.group(bankBranch));
  const bankBranchFormArray = this.bankBranchFormBuilder.array(bankBranchesFormGroups);
  this.bankBranchFormGroup.setControl('bankBranchesOnScreen', bankBranchFormArray);
}

  add() {
  this.showNewRow = true;
  this.bankBranchesOnScreen.push(this.bankBranchFormBuilder.group(new BankBranchDataModel()));
}

  submit() {
	  this.showNewRow = false;
	  this.bankBranchArrayData = this.prepareForSubmit();
    this.bankBranchService.updateBankBranches(this.bankBranchArrayData).subscribe();
//	  let updatedBankBranches = this.bankBranchService.updateBankBranches(this.bankBranchArrayData);
	  this.ngOnChanges();
}

  prepareForSubmit(): BankBranchArrayDataModel {
	  const formModel = this.bankBranchFormGroup.value;
	  const bankBranchesOnScreenDeepCopy: BankBranchDataModel[] = formModel.bankBranchesOnScreen.map(
		  (bankBranch: BankBranchDataModel) => Object.assign({}, bankBranch));

    for(let bankBranch of bankBranchesOnScreenDeepCopy) {
        alert(this.activatedRoute.snapshot.paramMap.get('userId'));
        bankBranch.userId = this.activatedRoute.snapshot.paramMap.get('userId');
                     //populate countrycode for next
       		 this.selectedCountryCodes.push(bankBranch.country);
      }

	  const saveBankArrayDataModel : BankBranchArrayDataModel = {
		  bankBranches : bankBranchesOnScreenDeepCopy
	  }

  return saveBankArrayDataModel;
}

revert() {
  this.ngOnChanges();
  }

delete(i : number, bankBranch : BankBranchDataModel) {
  this.bankBranchService.removeBankBranch(bankBranch);
  this.bankBranchesOnScreen.removeAt(i);
}

next() {
if(!this.bankBranchFormGroup.pristine){
  this.submit();
  }
         //create unique set of country codes
    this.selectedCountryCodes = Array.from(new Set(this.selectedCountryCodes.map((itemInArray) => itemInArray)));
    this.router.navigate(['/accounts/'+this.activatedRoute.snapshot.paramMap.get('userId')+'/'+this.selectedCountryCodes]);
}

previousTab() {

   if(this.selectedCountryCodes.length === 0) {
  	this.router.navigate(['/banks/'+this.activatedRoute.snapshot.paramMap.get('userId')]);
  	} else {
  	this.selectedCountryCodes = Array.from(new Set(this.selectedCountryCodes.map((itemInArray) => itemInArray)));
    
    this.router.navigate(['/banks/'+this.activatedRoute.snapshot.paramMap.get('userId')+'/'+this.selectedCountryCodes]);
  	}
}

nextTab() {
  this.router.navigate(['/accounts/'+this.activatedRoute.snapshot.paramMap.get('userId')]);
}
}
