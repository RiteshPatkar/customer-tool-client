import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { IndexKind } from "typescript";
import { Location } from '@angular/common';
import { BankArrayDataModel,  BankDataModel} from '../data/banktab-data-model';
import { CountryISOCodeArrayDataModel} from '../data/countrytab-data-model';
import { BankService } from '../services/bank.service';
import { CountryService } from '../services/country.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {

@Input() bankArrayData: BankArrayDataModel;

bankFormGroup : FormGroup;
nameChangeLog: string[] = [];
selectedCountryCodes : string[] = [];
isLoading = false;
showNewRow = false;
countryCodes : CountryISOCodeArrayDataModel;

constructor(
  private bankFormBuilder : FormBuilder,
  private router: Router,
  private activatedRoute: ActivatedRoute,
  private bankService: BankService,
  private countryService: CountryService) {
  this.createFormGroup();
}

 createFormGroup() {
  this.bankFormGroup = this.bankFormBuilder.group({
	banksOnScreen : this.bankFormBuilder.array([])
  });
}

ngOnInit() {
    
       if(JSON.parse(localStorage.getItem('currentUser')) == null || JSON.parse(localStorage.getItem('currentUser')) == '') {
          this.router.navigate(['']);
      }
    
  this.getBanksFromService();
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

getBanksFromService() {
  this.isLoading = true;
          let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
  const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');
  if(selectCountryCodes != null && selectCountryCodes != 'undefined' && selectCountryCodes.length > 0) {
//    var countryCodeArray = selectCountryCodes.split(',');
//    if(countryCodeArray.length > 0) {
    this.bankService.getBanksByCountry(userId, selectCountryCodes).subscribe(bankArrayData => this.setBanks(bankArrayData.banks))
    return;
    }
    this.bankService.getBanks(userId).subscribe(bankArrayData => this.setBanks(bankArrayData.banks));
	  //	.finally(() => this.isLoading = false);
}

 ngOnChanges() {
  this.bankFormGroup.reset({
  });
	this.setBanks(this.bankArrayData.banks);
}

get banksOnScreen(): FormArray {
  return this.bankFormGroup.get('banksOnScreen') as FormArray
}

 setBanks(banks : BankDataModel[]) {
  const banksFormGroups = banks.map(bank => this.bankFormBuilder.group(bank));
  const bankFormArray = this.bankFormBuilder.array(banksFormGroups);
  this.bankFormGroup.setControl('banksOnScreen', bankFormArray);
}

  add() {
  this.showNewRow = true;
  this.banksOnScreen.push(this.bankFormBuilder.group(new BankDataModel()));
}

  submit() {
	  this.showNewRow = false;
	  this.bankArrayData = this.prepareForSubmit();
    this.bankService.updateBanks(this.bankArrayData).subscribe();
//	  let updatedBanks = this.bankService.updateBanks(this.bankArrayData);
	  this.ngOnChanges();
}

  prepareForSubmit(): BankArrayDataModel {
	  const formModel = this.bankFormGroup.value;
	  const banksOnScreenDeepCopy: BankDataModel[] = formModel.banksOnScreen.map(
		  (bank: BankDataModel) => Object.assign({}, bank));

    for(let bank of banksOnScreenDeepCopy) {
        bank.userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');

             //populate countrycode for next
       		 this.selectedCountryCodes.push(bank.countryCode);
      }

	  const saveBankArrayDataModel : BankArrayDataModel = {
		  banks : banksOnScreenDeepCopy
	  }

  return saveBankArrayDataModel;
}

revert() {
  this.ngOnChanges();
  }

delete(i : number, bank : BankDataModel) {
  this.bankService.removeBank(bank);
  this.banksOnScreen.removeAt(i);
}

next() {
if(!this.bankFormGroup.pristine){
  this.submit();
  }

          //create unique set of country codes
    this.selectedCountryCodes = Array.from(new Set(this.selectedCountryCodes.map((itemInArray) => itemInArray)));
    
       let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
    
    this.router.navigate(['/bankbranches/'+userId+'/'+this.selectedCountryCodes]);
}

previousTab() {
    
       let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');

   if(this.selectedCountryCodes.length === 0) {
  	this.router.navigate(['/companies/'+userId]);
  	} else {
  	this.selectedCountryCodes = Array.from(new Set(this.selectedCountryCodes.map((itemInArray) => itemInArray)));

    this.router.navigate(['/companies/'+userId+'/'+this.selectedCountryCodes]);
  	}
}

nextTab() {
    
       let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
this.router.navigate(['/bankbranches/'+userId]);
}
}
