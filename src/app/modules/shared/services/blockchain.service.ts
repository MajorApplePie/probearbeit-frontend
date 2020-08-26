import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TickerEntry } from '../models';

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
}
