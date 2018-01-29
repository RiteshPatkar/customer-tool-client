import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { AccountArrayDataModel,  AccountDataModel} from '../data/accounttab-data-model';
import { ACCOUNTS } from '../mock-data/mock-accounts';

@Injectable()
export class AccountService {

 constructor() { }

  getAccounts(): AccountArrayDataModel {
//     return of(ACCOUNTS);
  return ACCOUNTS;
  }

  updateAccounts(accounts : AccountArrayDataModel) : AccountArrayDataModel {
    //logic to update data
    return accounts;
  }

  removeAccount(account : AccountDataModel) : void {
  }

}