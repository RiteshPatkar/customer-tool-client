import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BankArrayDataModel,  BankDataModel} from '../data/banktab-data-model';
import { BANKS } from '../mock-data/mock-banks';
import { BankService } from '../services/bank.service';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { IndexKind } from "typescript";
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {

  @Input() bankArrayData: BankArrayDataModel;

  bankFormGroup : FormGroup;
  nameChangeLog: string[] = [];
 // bankDataFromService : Observable<BankArrayDataModel>;
  bankDataFromService : BankArrayDataModel;
  isLoading = false;
  showNewRow = false;

  constructor(
    private bankFormBuilder : FormBuilder,
	private router: Router,
    private bankService: BankService) {
    this.createFormGroup();
  }

   createFormGroup() {
    this.bankFormGroup = this.bankFormBuilder.group({
      banksOnScreen : this.bankFormBuilder.array([])
    });
  }

  ngOnInit() {
    this.getBanksFromService();
  this.setBanks(this.bankDataFromService.banks);
  }

  getBanksFromService() {
  this.isLoading = true;
  this.bankDataFromService = this.bankService.getBanks();
    //  .finally(() => this.isLoading = false);
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
//    this.bankService.updateBanks(this.bankArrayData).subscribe(/* error handling */);
        let updatedBanks = this.bankService.updateBanks(this.bankArrayData);
    this.ngOnChanges();
  }

    prepareForSubmit(): BankArrayDataModel {
      const formModel = this.bankFormGroup.value;
    const banksOnScreenDeepCopy: BankDataModel[] = formModel.banksOnScreen.map(
          (bank: BankDataModel) => Object.assign({}, bank));
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
    this.router.navigate(['/bankbranches']);
  }

  previousTab() {
  	this.router.navigate(['/companies']);
  }

  nextTab() {
    this.router.navigate(['/bankbranches']);
  }
}
