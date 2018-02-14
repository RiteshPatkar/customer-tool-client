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
    this.getCompaniesFromService();
    this.getCountryCodes();
    }

    getCountryCodes() {
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

  getCompaniesFromService() {
  this.isLoading = true;
  const userId = +this.activatedRoute.snapshot.paramMap.get('userId');
  const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');
  alert(selectCountryCodes)

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
              alert(this.activatedRoute.snapshot.paramMap.get('userId'));
              company.userId = this.activatedRoute.snapshot.paramMap.get('userId')
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
    this.router.navigate(['/banks/'+this.activatedRoute.snapshot.paramMap.get('userId')]);
  }

  previousTab() {
  	this.router.navigate(['/calendars/'+this.activatedRoute.snapshot.paramMap.get('userId')]);
  }

  nextTab() {
    this.router.navigate(['/banks/'+this.activatedRoute.snapshot.paramMap.get('userId')]);
  }
}
