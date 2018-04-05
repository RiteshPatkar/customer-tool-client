import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { IndexKind } from "typescript";
import { Location } from '@angular/common';

import { CompanyArrayDataModel,  CompanyDataModel} from '../data/companytab-data-model';
import { CountryISOCodeArrayDataModel} from '../data/countrytab-data-model';
import { CompanyService } from '../services/company.service';
import { CountryService } from '../services/country.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  @Input() companyArrayData: CompanyArrayDataModel;

  companyFormGroup : FormGroup;
  nameChangeLog: string[] = [];
  isLoading = false;
  showNewRow = false;
  countryCodes : CountryISOCodeArrayDataModel;
   selectedCountryCodes : string[] = [];

  constructor(
    private companyFormBuilder : FormBuilder,
	  private router: Router,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private countryService: CountryService) {
    this.createFormGroup();
  }

   createFormGroup() {
    this.companyFormGroup = this.companyFormBuilder.group({
      companiesOnScreen : this.companyFormBuilder.array([])
    });
  }

  ngOnInit() {
  
     if(JSON.parse(localStorage.getItem('currentUser')) == null || JSON.parse(localStorage.getItem('currentUser')) == '') {
          this.router.navigate(['']);
      }
  
    this.getCompaniesFromService();
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

  getCompaniesFromService() {
  this.isLoading = true;
          let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
  const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');

  if(selectCountryCodes != null && selectCountryCodes != 'undefined' && selectCountryCodes.length > 0) {
    this.companyService.getCompaniesByCountry(userId, selectCountryCodes).subscribe(companyArrayData => this.setCompanies(companyArrayData.companies))
    return;
    }
    this.companyService.getCompanies(userId).subscribe(companyArrayData => this.setCompanies(companyArrayData.companies));
	  //	.finally(() => this.isLoading = false);
  }

   ngOnChanges() {
    this.companyFormGroup.reset({
    });
      this.setCompanies(this.companyArrayData.companies);
  }

  get companiesOnScreen(): FormArray {
    return this.companyFormGroup.get('companiesOnScreen') as FormArray
  }

   setCompanies(companies : CompanyDataModel[]) {
    const companiesFormGroups = companies.map(company => this.companyFormBuilder.group(company));
    const companyFormArray = this.companyFormBuilder.array(companiesFormGroups);
    this.companyFormGroup.setControl('companiesOnScreen', companyFormArray);
  }

    add() {
    this.showNewRow = true;
    this.companiesOnScreen.push(this.companyFormBuilder.group(new CompanyDataModel()));
  }

    submit() {
      this.showNewRow = false;
      this.companyArrayData = this.prepareForSubmit();
      this.companyService.updateCompanies(this.companyArrayData).subscribe();
    this.ngOnChanges();
  }

    prepareForSubmit(): CompanyArrayDataModel {
      const formModel = this.companyFormGroup.value;
    const companiesOnScreenDeepCopy: CompanyDataModel[] = formModel.companiesOnScreen.map(
          (company: CompanyDataModel) => Object.assign({}, company));

          for(let company of companiesOnScreenDeepCopy) {
              company.userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');

             //populate countrycode for next
       		 this.selectedCountryCodes.push(company.countryCode);
            }

    const saveCompanyArrayDataModel : CompanyArrayDataModel = {
      companies : companiesOnScreenDeepCopy
    }

    return saveCompanyArrayDataModel;
  }

 revert() {
  this.ngOnChanges();
  }

  delete(i : number, company : CompanyDataModel) {
    this.companyService.removeCompany(company);
  this.companiesOnScreen.removeAt(i);
  }

  next() {
  if(!this.companyFormGroup.pristine){
    this.submit();
    }

        //create unique set of country codes
    this.selectedCountryCodes = Array.from(new Set(this.selectedCountryCodes.map((itemInArray) => itemInArray)));
      
         let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
      
    this.router.navigate(['/banks/'+userId+'/'+this.selectedCountryCodes]);
  }

  previousTab() {
   let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
   if(this.selectedCountryCodes.length === 0) {
  	this.router.navigate(['/calendars/'+userId]);
  	} else {
  	this.selectedCountryCodes = Array.from(new Set(this.selectedCountryCodes.map((itemInArray) => itemInArray)));

    this.router.navigate(['/calendars/'+userId+'/'+this.selectedCountryCodes]);
  	}
  }

  nextTab() {
         let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
    this.router.navigate(['/banks/'+userId]);
  }
}
