import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Address } from 'src/app/modules/shared/models';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  @Input() address: Address;
  creation = false;
  realAddress = false;

  nameControl: FormControl;
  btcAddress: FormControl;
  balance: FormControl;

  @Output() addressCreated = new EventEmitter<Address>();
  @Output() addressChanged = new EventEmitter<AddressChanged>();
  @Output() deleted = new EventEmitter<Address>();
  constructor() {
    this.nameControl = new FormControl('', [Validators.required]);
    this.btcAddress = new FormControl();
    this.balance = new FormControl(null, [Validators.min(0)]);
   }

  ngOnInit(): void {
    if (!this.address) {
      this.creation = true;
    } else if (this.address.address) {
      this.realAddress = true;
    } else {
      this.balance.setValue(this.address.amount);
    }
  }

  save() {
    // can't change a real address
    if (this.creation) {
      this.create();
    } else if (!this.realAddress) {
      this.update();
    }
  }
  // Emit new address event.
  create() {
    this.addressCreated.emit({
      amount: this.balance.value,
      name: this.nameControl.value,
      address: this.btcAddress.value
    });
  }

  // update existing address.
  update() {

  }

  delete() {
    if (this.creation) {
      return;
    }

    this.deleted.emit(this.address);
  }

}


export interface AddressChanged {
  address: Address;
  value: number;
}
