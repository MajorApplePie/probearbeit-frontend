import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Address } from 'src/app/modules/shared/models';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnDestroy {

  @Input() address: Address;
  creation = false;
  realAddress = false;

  nameControl: FormControl;
  btcAddress: FormControl;
  balance: FormControl;

  @Output() addressCreated = new EventEmitter<Address>();
  @Output() addressChanged = new EventEmitter<AddressChanged>();
  @Output() deleted = new EventEmitter<Address>();

  subs: Subscription[] = [];

  constructor() {
    this.nameControl = new FormControl('', [Validators.required]);
    this.btcAddress = new FormControl(null, [addressValidator]);
    this.balance = new FormControl(null, [Validators.min(0)]);
  }
  ngOnDestroy(): void {
    this.subs.forEach(x => {
      if (!x.closed) {
        x.unsubscribe();
      }
    });
  }

  ngOnInit(): void {
    if (!this.address) {
      this.creation = true;

      // disable balance input if a real address is entered;
      this.subs.push(this.btcAddress.valueChanges.subscribe(
        _ => {
          if (this.btcAddress.valid) {
            this.balance.disable();
          } else {
            this.balance.enable();
          }
        }
      ));


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
    this.addressChanged.emit({
      address: this.address,
      value: this.balance.value
    });
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

function addressValidator(control: AbstractControl): { [key: string]: any } | null {
  console.log(environment.bitcoinRegex.test(control.value));
  return environment.bitcoinRegex.test(control.value) ? null : { invalid: { value: control.value } };
}

