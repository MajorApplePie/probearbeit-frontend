import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../shared/services/wallet.service';
import { Observable } from 'rxjs';
import { Address } from '../../shared/models';
import { AddressChanged } from '../components/address/address.component';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  myAddresses$: Observable<Address[]>;

  creatingAddress = false;

  constructor(private addressService: WalletService) { }

  ngOnInit(): void {
    this.myAddresses$ = this.addressService.addresses$;

  }

  onWalletCreated(address: Address) {
    this.addressService.addAddress(address);

    this.creatingAddress = false;
  }

  onDelete(address: Address) {
    this.addressService.removeAddress(address);
  }

  startNewAddress() {
    this.creatingAddress = true;
  }

  addressChanged(event: AddressChanged) {
    this.addressService.changeAmount(event.address, event.value);
  }
}
