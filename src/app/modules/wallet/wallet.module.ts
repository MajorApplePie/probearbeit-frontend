import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './smart-components/wallet.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddressComponent } from './components/address/address.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [WalletComponent, AddressComponent],
  imports: [
    CommonModule,
    WalletRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule.forChild({
      extend: true
    })
  ]
})
export class WalletModule { }
