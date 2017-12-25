import { Component, OnInit } from '@angular/core';
import { Currency } from '../data/currency';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

currencies: Currency[];
selectedCurrency: Currency;

settings = {
    columns: {
      flag: {
      title: 'Flag'
      },
      currencyCode: {
      title: 'Currency Code'
      },
      currencyDescription: {
      title: 'Desciption'
      },
      numberOfDecimals: {
      title: 'Decimal Length'
      }
    }
};

  constructor(private currencyService: CurrencyService) { }

  ngOnInit() {
  this.getCurrencies();
  }

  getCurrencies(): void {
    this.currencyService.getCurrencies().subscribe(currencies => this.currencies = currencies);
  }

  onSelect(currency: Currency): void {
    this.selectedCurrency = currency;
  }



}
