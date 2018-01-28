import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { CompanyArrayDataModel,  CompanyDataModel} from '../data/companytab-data-model';
import { COMPANIES } from '../mock-data/mock-companies';

@Injectable()
export class CompanyService {

 constructor() { }

  getCompanies(): CompanyArrayDataModel {
//     return of(COMPANIES);
  return COMPANIES;
  }

  updateCompanies(companies : CompanyArrayDataModel) : CompanyArrayDataModel {
    //logic to update data
    return companies;
  }

  removeCompany(company : CompanyDataModel) : void {
  }

}