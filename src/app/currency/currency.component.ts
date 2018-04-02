import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { IndexKind } from "typescript";
import { Location } from '@angular/common';
import { CurrencyArrayDataModel, CurrencyDataModel} from '../data/currencytab-data-model';
import { CountryISOCodeArrayDataModel} from '../data/countrytab-data-model';
import { CurrencyService } from '../services/currency.service';
import { CountryService } from '../services/country.service';

@Component({
    selector: 'app-currency',
    templateUrl: './currency.component.html',
    styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

    @Input() currencyArrayData: CurrencyArrayDataModel;

    currencyFormGroup: FormGroup;
    nameChangeLog: string[] = [];
    isLoading = false;
    showNewRow = false;
    countryCodes: CountryISOCodeArrayDataModel;
    selectedCountryCodes: string[] = [];

    constructor(
        private currencyFormBuilder: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private currencyService: CurrencyService,
        private countryService: CountryService) {
        this.createFormGroup();
    }

    createFormGroup() {
        this.currencyFormGroup = this.currencyFormBuilder.group({
            currenciesOnScreen: this.currencyFormBuilder.array([])
        });
    }

    ngOnInit() {
       if(JSON.parse(localStorage.getItem('currentUser')) == null || JSON.parse(localStorage.getItem('currentUser')) == '') {
          this.router.navigate(['']);
      }
        
        this.getCurrenciesFromService();
        this.getCountryCodes();
    }

    getCountryCodes() {
        const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');
        let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
        if (selectCountryCodes != null && selectCountryCodes != 'undefined' && selectCountryCodes.length > 0) {
            this.countryCodes = new CountryISOCodeArrayDataModel();
            this.countryCodes.countryCodes = selectCountryCodes.split(',');
            return;
        } else {
            this.countryService.getCountryCodesForUser(userId).subscribe(result => this.countryCodes = result)
        }
    }

    getCurrenciesFromService() {
        this.isLoading = true;
        let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
        const selectCountryCodes = this.activatedRoute.snapshot.paramMap.get('selectedCountryCodes');
        if (selectCountryCodes != null && selectCountryCodes != 'undefined' && selectCountryCodes.length > 0) {
            //    var countryCodeArray = selectCountryCodes.split(',');
            //    if(countryCodeArray.length > 0) {
            this.currencyService.getCurrenciesByCountry(userId, selectCountryCodes).subscribe(currencyArrayData => this.setCurrencies(currencyArrayData.currencies))
            return;
        }
        this.currencyService.getCurrencies(userId).subscribe(currencyArrayData => this.setCurrencies(currencyArrayData.currencies));
        //	.finally(() => this.isLoading = false);
    }

    ngOnChanges() {
        this.currencyFormGroup.reset({
        });
        this.setCurrencies(this.currencyArrayData.currencies);
    }

    get currenciesOnScreen(): FormArray {
        return this.currencyFormGroup.get('currenciesOnScreen') as FormArray
    }

    setCurrencies(currencies: CurrencyDataModel[]) {
        const currenciesFormGroups = currencies.map(currency => this.currencyFormBuilder.group(currency));
        const currencyFormArray = this.currencyFormBuilder.array(currenciesFormGroups);
        this.currencyFormGroup.setControl('currenciesOnScreen', currencyFormArray);
    }

    add() {
        this.showNewRow = true;
        this.currenciesOnScreen.push(this.currencyFormBuilder.group(new CurrencyDataModel()));
    }

    submit() {
        this.showNewRow = false;
        this.currencyArrayData = this.prepareForSubmit();
        this.currencyService.updateCurrencies(this.currencyArrayData).subscribe();
        //	  let updatedCurrencies = this.currencyService.updateCurrencies(this.currencyArrayData);
        this.ngOnChanges();
    }

    prepareForSubmit(): CurrencyArrayDataModel {
        const formModel = this.currencyFormGroup.value;
        const currenciesOnScreenDeepCopy: CurrencyDataModel[] = formModel.currenciesOnScreen.map(
            (currency: CurrencyDataModel) => Object.assign({}, currency));

        for (let currency of currenciesOnScreenDeepCopy) {
            currency.userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
            this.selectedCountryCodes.push(currency.countryCode);
        }

        const saveCurrencyArrayDataModel: CurrencyArrayDataModel = {
            currencies: currenciesOnScreenDeepCopy
        }

        return saveCurrencyArrayDataModel;
    }

    revert() {
        this.ngOnChanges();
    }

    delete(i: number, currency: CurrencyDataModel) {
        this.currencyService.removeCurrency(currency).subscribe();
        this.currenciesOnScreen.removeAt(i);
    }

    next() {
        if (!this.currencyFormGroup.pristine) {
            this.submit();
        }

        //create unique set of country codes
        this.selectedCountryCodes = Array.from(new Set(this.selectedCountryCodes.map((itemInArray) => itemInArray)));

            let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
        
        this.router.navigate(['/calendars/' + userId + '/' + this.selectedCountryCodes]);
    }

    previousTab() {
        
            let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
        
        this.router.navigate(['/countries/' + userId]);
    }

    nextTab() {
        
            let userId = (this.activatedRoute.snapshot.paramMap.get('userId') == null) 
                    ? JSON.parse(localStorage.getItem('currentUser')).userId 
                    : +this.activatedRoute.snapshot.paramMap.get('userId');
        this.router.navigate(['/calendars/' + userId]);
    }
}
