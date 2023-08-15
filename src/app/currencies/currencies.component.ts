import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject } from "rxjs";
import { map, startWith } from 'rxjs/operators';

import { Currency } from "../currency";
import { CurrenciesService } from "../currencies.service";

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {
  leftFilteredCurrencies!: Observable<Currency[]>;
  rightFilteredCurrencies!: Observable<Currency[]>;
  readonly leftCurrencyControl = new FormControl<string | Currency>("");
  readonly rightCurrencyControl = new FormControl<string | Currency>("");
  readonly leftQuantityControl = new FormControl<number>(1);
  readonly rightQuantityControl = new FormControl<number>(1);

  private readonly leftDefaultCurrencyCode = "EUR";
  private readonly rightDefaultCurrencyCode = "USD";
  private readonly rate = new BehaviorSubject<number>(0);
  private currencies: Currency[] = [];

  constructor(private currenciesService: CurrenciesService) {}

  async ngOnInit(): Promise<void> {
    await this.setCurrencies();
    this.setFilteredCurrencies();
    this.setDefaultValues();
    await this.setExchangeRate();
    this.onLeftQuantityChanged();
    this.setSubscriptions();
  }

  currencyGetter(currency: Currency): string {
    return currency.name;
  }

  swap(): void {
    const buffer = this.leftCurrencyControl.value;
    this.leftCurrencyControl.setValue(this.rightCurrencyControl.value);
    this.rightCurrencyControl.setValue(buffer);
    this.setExchangeRate();
  }

  onLeftQuantityChanged(): void {
    this.rightQuantityControl.setValue(this.leftQuantityControl.value as number * this.rate.getValue());
  }

  onRightQuantityChanged(): void {
    this.leftQuantityControl.setValue(this.rightQuantityControl.value as number / this.rate.getValue());
  }

  async setExchangeRate(): Promise<void> {
    const rate = await this.currenciesService.getLatestExchangeData(
      (this.leftCurrencyControl.value as Currency).code,
      (this.rightCurrencyControl.value as Currency).code
    );

    this.rate.next(rate);
  }

  private async setCurrencies(): Promise<void> {
    this.currencies = await this.currenciesService.getCurrencies();
  }

  private setFilteredCurrencies(): void {
    this.leftFilteredCurrencies = this.leftCurrencyControl.valueChanges.pipe(
      startWith(""),
      map(value => this._mapper(value as string | Currency))
    );

    this.rightFilteredCurrencies = this.rightCurrencyControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._mapper(value as string | Currency))
    );
  }

  private setDefaultValues(): void {
    const leftCurrency = this.currencies.find(curr => curr.code === this.leftDefaultCurrencyCode) || this.currencies[0];
    const rightCurrency = this.currencies.find(curr => curr.code === this.rightDefaultCurrencyCode) || this.currencies[1];

    this.leftCurrencyControl.setValue(leftCurrency);
    this.rightCurrencyControl.setValue(rightCurrency);
  }

  private setSubscriptions(): void {
    this.rate.subscribe(() => this.onLeftQuantityChanged());
  }

  private _mapper(value: string | Currency): Currency[] {
    const searchString = typeof value === 'string' ? value : value?.name?.concat(value?.code || "");
    return searchString ? this._filter(searchString) : this.currencies.slice();
  }

  private _filter(searchString: string): Currency[] {
    const filterValue = searchString.toLowerCase();
    return this.currencies.filter(option => option.name.concat(option.code).toLowerCase().includes(filterValue));
  }
}
