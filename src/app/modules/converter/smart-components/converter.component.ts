import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BlockchainService } from '../../shared/services/blockchain.service';
import { map, filter, debounceTime, distinctUntilChanged, switchMap, tap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
  host: { 'class': 'converter-component'}
})
export class ConverterComponent implements OnInit {
  // Use a static array to limit selection to the ones given in task.
  currencyOptions$: Observable<string[]>;
  convertedAmount$: Observable<number>;
  inputForm: FormGroup;
  constructor(private btcService: BlockchainService) {
    this.inputForm = new FormGroup({
      amount: new FormControl(0, [Validators.min(0), Validators.required]),
      currency: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.currencyOptions$ = this.btcService.getLatest()
      .pipe(
        map(response => response.map(r => r.currencyCode).sort()),
        tap(response => this.currency = response[0])
      );

    this.convertedAmount$ = this.inputForm.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        filter(_ => this.inputForm.valid),
        switchMap(_ => this.btcService.convertToBtc(this.amount, this.currency))
      );

  }

  // Maybe I'm daft, but the scroll increment only works after listening to the event.
  // Might as well fix scrolling into negatives while I'm at it.
  onWheel(event: WheelEvent) {
    event.preventDefault();

    if (event.deltaY < 0) {
      this.inputForm.patchValue({ 'amount': this.amount + 1 });
    } else if (this.amount > 0) {
      this.inputForm.patchValue({ 'amount': this.amount - 1 });
    }
  }

  get amount(): number {
    return this.inputForm.get('amount').value;
  }

  get currency(): string {
    return this.inputForm.get('currency').value;
  }

  set currency(currency: string) {
    this.inputForm.patchValue({ 'currency': currency });
  }

}
