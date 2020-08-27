import { Component, OnInit, HostBinding } from '@angular/core';
import { BlockchainService } from '../../shared/services/blockchain.service';
import { Observable, timer, merge } from 'rxjs';
import { TickerEntry } from '../../shared/models';
import { tap, delay, switchMap } from 'rxjs/operators';
import { WalletService } from '../../shared/services/wallet.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  host: { 'class': 'dashboard-component'}
})
export class DashboardComponent implements OnInit {
  bitcoinData$: Observable<TickerEntry[]>;
  currentBtc: number;
  currentBalance: number;
  loading = true;

  constructor(private blockService: BlockchainService, private addrService: WalletService) { }

  ngOnInit(): void {

    this.bitcoinData$ = timer(0, 5 * 1000 * 60).pipe(
      tap(() => this.loading = true),
      switchMap(() => this.blockService.getLatest()
        .pipe(
          delay(100),
          tap(a => {

            if (this.currentBtc) { // should have read all the tasks ahead of time, this is quite the botch.
              this.currentBalance = a.find(curr => curr.currencyCode === 'EUR').last * this.currentBtc;
            }

            this.loading = false;
          })
        ))
    );

    this.addrService.addresses$.subscribe(
      addresses => this.currentBtc = addresses.reduce((p, c) => p += c.amount, 0)
    );

  }

}
