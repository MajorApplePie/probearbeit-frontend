import { Component, OnInit, HostBinding } from '@angular/core';
import { BlockchainService } from '../../shared/services/blockchain.service';
import { Observable, timer } from 'rxjs';
import { TickerEntry } from '../../shared/models';
import { tap, delay, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  host: { 'class': 'dashboard-component'}
})
export class DashboardComponent implements OnInit {
  bitcoinData$: Observable<TickerEntry[]>;
  loading = true;

  constructor(private blockService: BlockchainService) { }

  ngOnInit(): void {

    this.bitcoinData$ = timer(0, 1 * 1000 * 60).pipe(
      tap(() => this.loading = true),
      switchMap(() => this.blockService.getLatest()
        .pipe(
          delay(100),
          tap(a => {
            this.loading = false;
          })
        ))
    );
  }

}
