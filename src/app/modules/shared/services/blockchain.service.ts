import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, forkJoin, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { TickerEntry, BtcDetails, ChartData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private endpoint: string;
  private chartEndpoint: string;
  constructor(private http: HttpClient) {
    this.endpoint = environment.blockchainEndpoint;
    this.chartEndpoint = environment.blockchainApiEndpoint + '/charts';
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
  getDetails(): Observable<BtcDetails> {
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
          totalBtc: responses[1] / 100000000,
          transactionCount24h: responses[2],
          btcSent24h: responses[3],
          hashrate: responses[4],
          difficulty: responses[5]
        }))
      );
  }

  /**
   * Convert given amount of source currency into bitcoin.
   * @param amount Amount to convert.
   * @param currency Currency to convert.
   */
  convertToBtc(amount: number, currency: string): Observable<number> {
    const params = new HttpParams()
      .append('value', amount.toString())
      .append('currency', currency);

    return this.http.get<number>(`${this.endpoint}/tobtc`, { params });
  }

  getChartData(timespan?: number): Observable<ChartData> {
    let params = new HttpParams().append('cors', 'true');

    if (timespan) {
      params = params.append('timespan', timespan.toString());
    }

    return this.http.get<any>(`${this.chartEndpoint}/market-price`, { params })
      .pipe(map(response => {
        response.values.forEach(v => {
          v.x = new Date(v.x * 1000);
        });
        return response;
      }));
  }
}
