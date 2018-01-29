import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AccountArrayDataModel,  AccountDataModel} from '../data/accounttab-data-model';
import { ACCOUNTS } from '../mock-data/mock-accounts';
import { AccountService } from '../services/account.service';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { IndexKind } from "typescript";
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  @Input() accountArrayData: AccountArrayDataModel;

  accountFormGroup : FormGroup;
  nameChangeLog: string[] = [];
 // accountDataFromService : Observable<AccountArrayDataModel>;
  accountDataFromService : AccountArrayDataModel;
  isLoading = false;
  showNewRow = false;

  constructor(
    private accountFormBuilder : FormBuilder,
	private router: Router,
    private accountService: AccountService) {
    this.createFormGroup();
  }

   createFormGroup() {
    this.accountFormGroup = this.accountFormBuilder.group({
      accountsOnScreen : this.accountFormBuilder.array([])
    });
  }

  ngOnInit() {
    this.getAccountsFromService();
  this.setAccounts(this.accountDataFromService.accounts);
  }

  getAccountsFromService() {
  this.isLoading = true;
  this.accountDataFromService = this.accountService.getAccounts();
    //  .finally(() => this.isLoading = false);
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
//    this.accountService.updateAccounts(this.accountArrayData).subscribe(/* error handling */);
        let updatedAccounts = this.accountService.updateAccounts(this.accountArrayData);
    this.ngOnChanges();
  }

    prepareForSubmit(): AccountArrayDataModel {
      const formModel = this.accountFormGroup.value;
    const accountsOnScreenDeepCopy: AccountDataModel[] = formModel.accountsOnScreen.map(
          (account: AccountDataModel) => Object.assign({}, account));
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
  	this.router.navigate(['/bankbranches']);
  }
}
