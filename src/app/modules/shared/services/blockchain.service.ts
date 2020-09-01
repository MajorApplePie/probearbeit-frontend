import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, forkJoin, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { TickerEntry, BtcDetails, ChartData, ChartType } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private endpoint: string;
  private chartEndpoint: string;
  private readonly _chartTypes: ChartType[] = [
    {
      name: 'MarketCap',
      key: 'mktcap'
    },
    {
      name: 'Price',
      key: 'price'
    }, {
      name: 'TxSec',
      key: 'txSec'
    }, {
      name: 'HashRate',
      key: 'hashRate'
    }
  ];


    // this could be merged into the type directly, but it's information that's not needed for ui.
    private readonly typeMappings = new Map<string, string>([
      ['price', 'market-price'],
      ['mktcap', 'market-cap'],
      ['txSec', 'transactions-per-second'],
      ['hashRate', 'hash-rate']
    ]);

  get chartTypes(): ChartType[] {
    return this._chartTypes.map(x => x);
  }

  constructor(private http: HttpClient) {
    this.endpoint = environment.blockchainEndpoint;
    this.chartEndpoint = environment.blockchainApiEndpoint + '/charts';
  }

  /**
   * Get latest bitcoin value for available currencies.
   */
  getLatest(): Observable<TickerEntry[]> {

    return this.http.get(`${this.endpoint}/ticker`)
      .pipe(
        map<object, TickerEntry[]>(response => Object.entries(response).map(e => ({
          currencyCode: e[0],
          ...e[1]
        })).sort((a: TickerEntry, b: TickerEntry) => a.currencyCode.localeCompare(b.currencyCode))
        )
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
          totalBtc: responses[1] / 100000000, // Hope this is correct, I suspect they use large integers to not get problems with float precision.
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


  /**
   * Loads chart data for given type.
   * @param type type of chart to load
   * @param timespan Range to load, must be in format numberUnit e.g. 1weeks, 3months
   * @param start First dat to get.
   */
  getChartData(type: ChartType, timespan?: string, start?: Date): Observable<ChartData> {
    let params = new HttpParams().append('cors', 'true');


    if (timespan) {
      params = params.append('timespan', timespan);
    }

    if (start) {
      params = params.append('start', start.toUTCString());
    }

    return this.http.get<any>(`${this.chartEndpoint}/${this.typeMappings.get(type.key)}`, { params })
      .pipe(map(response => {
        response.values.forEach(v => {
          v.x = new Date(v.x * 1000);
        });
        return response;
      }));
  }
}
