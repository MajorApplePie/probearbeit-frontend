import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../../shared/services/blockchain.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  ready = false;
  chartData: ChartDataSets[];
  chartLabels: Label[];
  lineChartColors: Color[] = [
    {
      borderColor: 'black'
    },
  ];

  options: ChartOptions = {
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'month'
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10
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
          label: 't',
          data: data.values
        }];
        this.ready = true;
      });
  }

}
