import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../../shared/services/blockchain.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  ready = false;
  chartData: ChartDataSets[];
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



  constructor(private btcService: BlockchainService) { }

  ngOnInit(): void {
    this.btcService.getChartData()
      .subscribe(data => {
        this.chartData = [{
          label: data.description,
          data: data.values
        }];
        this.ready = true;
      });
  }

}
