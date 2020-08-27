import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AddressResponse, Address } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private addresses: Address[];
  private _addresses$ = new ReplaySubject<Address[]>(1);
  addresses$ = this._addresses$.asObservable();
  private endpoint: string;
  constructor(private http: HttpClient) {
    this.endpoint = environment.blockchainEndpoint;

    this.loadFromStorage();
  }


  private loadFromStorage() {
    this.addresses = JSON.parse(localStorage.getItem('addresses')) || [];


    const realAddresses = this.addresses.filter(w => w.address);

    if (realAddresses.length > 0) {

      this.getAddressValue(realAddresses.map(w => w.address))
        .subscribe(response => this.updateAddressValues(realAddresses, response));
    }
  }

  private updateAddressValues(addresses: Address[], updatedAmounts: AddressResponse) {
    updatedAmounts.addresses.forEach(address => {
      const match = addresses.find(a => a.address === address.address);
      if (match) {
        match.amount = address.final_balance / 100000000;
      }
    });
    this.saveAddresses();
  }

  /**
   * Get current value of multiple addresses.
   * @param addresses Addresses to get.
   */
  private getAddressValue(addresses: string[]): Observable<AddressResponse> {
    const params = new HttpParams().append('active', addresses.join('|')).append('cors', 'true');

    return this.http.get<AddressResponse>(`${this.endpoint}/multiaddr`, { params });
  }

  /**
   * Set the balance of given account to new value.
   * @param address Address to update.
   * @param newAmount New balance of this account.
   */
  changeAmount(address: Address, newAmount: number) {
    const match = this.addresses.find(a => a.address === address.address);
    match.amount = newAmount;
    this.saveAddresses();
  }

  saveAddresses() {
    localStorage.setItem('addresses', JSON.stringify(this.addresses));
    this._addresses$.next(this.addresses);
  }

  removeAddress(address: Address) {
    const index = this.addresses.indexOf(address);
    this.addresses.splice(index, 1);

    this.saveAddresses();
  }

  addAddress(address: Address) {
    this.addresses.push(address);

    if (address.address) {
      this.getAddressValue([address.address])
        .subscribe(response => {
          if (response && response.addresses.length === 1) {
            address.amount = response.addresses[0].final_balance;
            this.saveAddresses();
          }
        });
    } else {
      this.saveAddresses();
    }
  }
}
