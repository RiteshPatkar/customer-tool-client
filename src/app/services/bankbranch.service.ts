import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { BankBranchArrayDataModel,  BankBranchDataModel} from '../data/bankbranchtab-data-model';
import { BRANCHES } from '../mock-data/mock-bank-branches';

@Injectable()
export class BankBranchService {
  //private bankbranchUrl = 'api/bankbranch'; //URL to API

 // constructor(private http: HttpClient) { }

 constructor() { }

  getBankBranches(): BankBranchArrayDataModel {
//     return of(BRANCHES);
  return BRANCHES;
  }

  updateBankBranches(bankBranches : BankBranchArrayDataModel) : BankBranchArrayDataModel {
    //logic to update data
    return bankBranches;
  }

  removeBankBranch(bankbranch : BankBranchDataModel) : void {
  }

}