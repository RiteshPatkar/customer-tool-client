import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { IndexKind } from "typescript";
import { Location } from '@angular/common';
import { BankArrayDataModel,  BankDataModel} from '../data/bankbranchtab-data-model';
import { CountryISOCodeArrayDataModel} from '../data/countrytab-data-model';
import { BankService } from '../services/bankbranch.service';
import { CountryService } from '../services/country.service';

@Component({
  selector: 'app-bankbranch',
  templateUrl: './bankbranch.component.html',
  styleUrls: ['./bankbranch.component.css']
})
export class BankComponent implements OnInit {

@Input() bankbranchArrayData: BankArrayDataModel;

bankbranchFormGroup : FormGroup;
nameChangeLog: string[] = [];
isLoading = false;
showNewRow = false;
countryCodes : CountryISOCodeArrayDataModel;

constructor(
  private bankbranchFormBuilder : FormBuilder,
  private router: Router,
  private activatedRoute: ActivatedRoute,
  private bankbranchService: BankService,
  private countryService: CountryService) {
  this.createFormGroup();
}

 createFormGroup() {
  this.bankbranchFormGroup = this.bankbranchFormBuilder.group({
	bankbranchsOnScreen : this.bankbranchFormBuilder.array([])
  });
}

ngOnInit() {
  this.getBankBranchesFromService();
  this.getCountryCodes();
}

  getCountryCodes() {
  alert('populate country codes for bankbranch');
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
    this.bankbranchService.getBankBranchesByCountry(userId, selectCountryCodes).subscribe(bankbranchArrayData => this.setBankBranches(bankbranchArrayData.bankbranchs))
    return;
    }
    this.bankbranchService.getBankBranches(userId).subscribe(bankbranchArrayData => this.setBankBranches(bankbranchArrayData.bankbranchs));
	  //	.finally(() => this.isLoading = false);
}

 ngOnChanges() {
  this.bankbranchFormGroup.reset({
  });
	this.setBankBranches(this.bankbranchArrayData.bankbranchs);
}

get bankbranchsOnScreen(): FormArray {
  return this.bankbranchFormGroup.get('bankbranchsOnScreen') as FormArray
}

 setBankBranches(bankbranchs : BankDataModel[]) {
  alert('IN Currenty set');
  alert(JSON.stringify(bankbranchs, null, 4));
  const bankbranchsFormGroups = bankbranchs.map(bankbranch => this.bankbranchFormBuilder.group(bankbranch));
  const bankbranchFormArray = this.bankbranchFormBuilder.array(bankbranchsFormGroups);
  this.bankbranchFormGroup.setControl('bankbranchsOnScreen', bankbranchFormArray);
}

  add() {
  this.showNewRow = true;
  this.bankbranchsOnScreen.push(this.bankbranchFormBuilder.group(new BankDataModel()));
}

  submit() {
	  this.showNewRow = false;
	  this.bankbranchArrayData = this.prepareForSubmit();
    this.bankbranchService.updateBankBranches(this.bankbranchArrayData).subscribe();
//	  let updatedBankBranches = this.bankbranchService.updateBankBranches(this.bankbranchArrayData);
	  this.ngOnChanges();
}

  prepareForSubmit(): BankArrayDataModel {
	  const formModel = this.bankbranchFormGroup.value;
	  const bankbranchsOnScreenDeepCopy: BankDataModel[] = formModel.bankbranchsOnScreen.map(
		  (bankbranch: BankDataModel) => Object.assign({}, bankbranch));

    for(let bankbranch of bankbranchsOnScreenDeepCopy) {
        alert(this.activatedRoute.snapshot.paramMap.get('userId'));
        bankbranch.userId = this.activatedRoute.snapshot.paramMap.get('userId')
      }

	  const saveBankArrayDataModel : BankArrayDataModel = {
		  bankbranchs : bankbranchsOnScreenDeepCopy
	  }

  return saveBankArrayDataModel;
}

revert() {
  this.ngOnChanges();
  }

delete(i : number, bankbranch : BankDataModel) {
  this.bankbranchService.removeBank(bankbranch);
  this.bankbranchsOnScreen.removeAt(i);
}

next() {
if(!this.bankbranchFormGroup.pristine){
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
