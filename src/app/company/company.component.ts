import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CompanyArrayDataModel,  CompanyDataModel} from '../data/companytab-data-model';
import { COMPANIES } from '../mock-data/mock-companies';
import { CompanyService } from '../services/company.service';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { IndexKind } from "typescript";
import { Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  @Input() companyArrayData: CompanyArrayDataModel;

  companyFormGroup : FormGroup;
  nameChangeLog: string[] = [];
 // companyDataFromService : Observable<CompanyArrayDataModel>;
  companyDataFromService : CompanyArrayDataModel;
  isLoading = false;
  showNewRow = false;

  constructor(
    private companyFormBuilder : FormBuilder,
	private router: Router,
    private companyService: CompanyService) {
    this.createFormGroup();
  }

   createFormGroup() {
    this.companyFormGroup = this.companyFormBuilder.group({
      companiesOnScreen : this.companyFormBuilder.array([])
    });
  }

  ngOnInit() {
    this.getCompaniesFromService();
  this.setCompanies(this.companyDataFromService.companies);
  }

  getCompaniesFromService() {
  this.isLoading = true;
  this.companyDataFromService = this.companyService.getCompanies();
    //  .finally(() => this.isLoading = false);
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
//    this.companyService.updateCompanies(this.companyArrayData).subscribe(/* error handling */);
        let updatedCompanies = this.companyService.updateCompanies(this.companyArrayData);
    this.ngOnChanges();
  }

    prepareForSubmit(): CompanyArrayDataModel {
      const formModel = this.companyFormGroup.value;
    const companiesOnScreenDeepCopy: CompanyDataModel[] = formModel.companiesOnScreen.map(
          (company: CompanyDataModel) => Object.assign({}, company));
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
    this.router.navigate(['/banks']);
  }

  previousTab() {
  	this.router.navigate(['/calendars']);
  }

  nextTab() {
    this.router.navigate(['/banks']);
  }
}
