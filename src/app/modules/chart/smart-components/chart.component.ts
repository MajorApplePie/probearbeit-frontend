import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../../shared/services/blockchain.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { ChartType } from '../../shared/models';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, mapTo, switchMap, tap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  chartData$: Observable<ChartDataSets[]>;
  lineChartColors: Color[] = [
    {
      borderColor: 'black'
    },
  ];

  // Switch x axis to months
  options: ChartOptions = {
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'month'
          },
          ticks: {
            autoSkip: true
          }
        }
      ]
    }
  }

  availableTypes: ChartType[];
  selectedType: FormControl;


  constructor(private btcService: BlockchainService) {
    this.availableTypes = this.btcService.chartTypes;
    this.selectedType = new FormControl(this.availableTypes[0]);
  }

  ngOnInit(): void {
    this.chartData$ = this.selectedType.valueChanges
      .pipe(
        startWith(''),
        switchMap(_ => this.loadData())
      );
  }

  private loadData(): Observable<ChartDataSets[]> {
    return this.btcService.getChartData(this.selectedType.value)
      .pipe(
        map(response => {
          return [
            {
              label: response.description,
              data: response.values
            }
          ]
        })
      )
  }

}
