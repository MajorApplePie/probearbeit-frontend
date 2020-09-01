import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { BlockchainService } from '../../shared/services/blockchain.service';
import { Observable, timer, merge, Subscription } from 'rxjs';
import { TickerEntry } from '../../shared/models';
import { tap, delay, switchMap, map } from 'rxjs/operators';
import { WalletService } from '../../shared/services/wallet.service';
import { FormArray, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  host: { 'class': 'dashboard-component' }
})
export class DashboardComponent implements OnInit, OnDestroy {
  bitcoinData: TickerEntry[];
  filteredData: TickerEntry[];
  currentBtc: number;
  currentBalance: number;
  loading = true;

  updateSubs: Subscription[] = [];
  selectedCurrencies = new FormControl([]);

  dataSource: MatTableDataSource<TickerEntry>;

  constructor(private blockService: BlockchainService, private addrService: WalletService) { }

  ngOnInit(): void {
    this.updateSubs.push(
      this.addrService.addresses$
        .subscribe(addresses => this.currentBtc = addresses.reduce((p, c) => p += c.amount, 0))
    );

    this.updateSubs.push(timer(0, 5 * 1000 * 60)
      .pipe(
        tap(() => this.loading = true),
        switchMap(() => this.blockService.getLatest()),
        delay(100)
      )
      .subscribe(response => {
        this.loading = false;
        this.updateBtc(response);
        this.updateBalance();
      }
      )
    );

    this.updateSubs.push(
      this.selectedCurrencies.valueChanges
        .subscribe((currencies: string[]) => {
          this.filteredData = this.bitcoinData.filter(btc => currencies.indexOf(btc.currencyCode) !== -1);
          this.dataSource.data = this.filteredData;

          localStorage.setItem('selectedCurrencies', JSON.stringify(currencies));
        })
    );

    this.dataSource = new MatTableDataSource();
  }

  ngOnDestroy(): void {
    this.updateSubs.forEach(x => {
      if (!x.closed) {
        x.unsubscribe();
      }
    });
  }

  updateBtc(updated: TickerEntry[]) {
    if (!this.bitcoinData) { // first time fetching data.
      this.bitcoinData = updated;

      const storedCurrencies = JSON.parse(localStorage.getItem('selectedCurrencies'));

      if (storedCurrencies) {
        this.selectedCurrencies.setValue(storedCurrencies);
      } else {
        this.selectedCurrencies.setValue(updated.map(x => x.currencyCode));
      }

    } else { // only update values, skipping checks for now missing and added currencies as I don't think that'll happen or be a problem during a session.
      this.bitcoinData = updated;
    }
  }



  updateBalance() {
    if (this.bitcoinData && this.currentBtc) {
      this.currentBalance = this.currentBtc * this.bitcoinData.find(curr => curr.currencyCode === 'EUR').last;
    }
  }

}
