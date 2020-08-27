import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../../shared/services/blockchain.service';
import { Observable } from 'rxjs';
import { BtcDetails } from '../../shared/models';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  host: { 'class': 'details-component'}
})
export class DetailsComponent implements OnInit {
  details$: Observable<BtcDetails>;
  constructor(private blockService: BlockchainService) { }

  ngOnInit(): void {
    this.details$ = this.blockService.getDetails();
  }

}
