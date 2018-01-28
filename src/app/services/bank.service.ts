import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { BankArrayDataModel,  BankDataModel} from '../data/banktab-data-model';
import { BANKS } from '../mock-data/mock-banks';

@Injectable()
export class BankService {

 constructor() { }

  getBanks(): BankArrayDataModel {
//     return of(BANKS);
  return BANKS;
  }

  updateBanks(banks : BankArrayDataModel) : BankArrayDataModel {
    //logic to update data
    return banks;
  }

  removeBank(bank : BankDataModel) : void {
  }

}