import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BankBranchArrayDataModel,  BankBranchDataModel} from '../data/bankbranchtab-data-model';
import { BRANCHES } from '../mock-data/mock-bank-branches';
import { BankBranchService } from '../services/bankbranch.service';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { IndexKind } from "typescript";
import { Router } from '@angular/router';

@Component({
  selector: 'app-bankbranch',
  templateUrl: './bankbranch.component.html',
  styleUrls: ['./bankbranch.component.css']
})
export class BankBranchComponent implements OnInit {

  @Input() bankBranchArrayData: BankBranchArrayDataModel;

  bankBranchFormGroup : FormGroup;
  nameChangeLog: string[] = [];
 // bankBranchDataFromService : Observable<BankBranchArrayDataModel>;
  bankBranchDataFromService : BankBranchArrayDataModel;
  isLoading = false;
  showNewRow = false;

  constructor(
    private bankBranchFormBuilder : FormBuilder,
	private router: Router,
    private bankBranchService: BankBranchService) {
    this.createFormGroup();
  }

   createFormGroup() {
    this.bankBranchFormGroup = this.bankBranchFormBuilder.group({
      bankBranchesOnScreen : this.bankBranchFormBuilder.array([])
    });
  }

  ngOnInit() {
    this.getBankBranchesFromService();
  this.setBankBranches(this.bankBranchDataFromService.bankBranches);
  }

  getBankBranchesFromService() {
  this.isLoading = true;
  this.bankBranchDataFromService = this.bankBranchService.getBankBranches();
    //  .finally(() => this.isLoading = false);
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
//    this.bankBranchService.updateBankBranches(this.bankBranchArrayData).subscribe(/* error handling */);
        let updatedBankBranches = this.bankBranchService.updateBankBranches(this.bankBranchArrayData);
    this.ngOnChanges();
  }

    prepareForSubmit(): BankBranchArrayDataModel {
      const formModel = this.bankBranchFormGroup.value;
    const bankBranchesOnScreenDeepCopy: BankBranchDataModel[] = formModel.bankBranchesOnScreen.map(
          (bankBranch: BankBranchDataModel) => Object.assign({}, bankBranch));
    const saveBankBranchArrayDataModel : BankBranchArrayDataModel = {
      bankBranches : bankBranchesOnScreenDeepCopy
    }

    return saveBankBranchArrayDataModel;
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
    this.router.navigate(['/accounts']);
  }

  previousTab() {
  	this.router.navigate(['/banks']);
  }

  nextTab() {
    this.router.navigate(['/accounts']);
  }
}
