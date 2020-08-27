import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { TickerEntry, BtcDetails } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private endpoint: string;
  constructor(private http: HttpClient) {
    this.endpoint = environment.blockchainEndpoint
  }

  getLatest(): Observable<TickerEntry[]> {

    return this.http.get(`${this.endpoint}/ticker`)
      .pipe(
        map(response => Object.entries(response).map(e => ({
          currencyCode: e[0],
          ...e[1]
        })))
      );
  }

  /**
   * Could also directly call each endpoint in the view.
   * As I know I'll only ever need them grouped I'll merge them here.
   * The stats endpoint gives most of this in one request, but I saw that later and you'd have to calculate the cap yourself, or merge it in here.
   */
  getDetails(): Observable<BtcDetails>{
    return forkJoin(
      this.http.get<number>(`${this.endpoint}/q/marketcap`),
      this.http.get<number>(`${this.endpoint}/q/totalbc`),
      this.http.get<number>(`${this.endpoint}/q/24hrtransactioncount`),
      this.http.get<number>(`${this.endpoint}/q/24hrbtcsent`),
      this.http.get<number>(`${this.endpoint}/q/hashrate`),
      this.http.get<number>(`${this.endpoint}/q/getdifficulty`)
    )
      .pipe(
        map(responses => ({
          marketcap: responses[0],
          totalBtc: responses[1],
          transactionCount24h: responses[2],
          btcSent24h: responses[3],
          hashrate: responses[4],
          difficulty: responses[5]
        }))
      );
  }
}
