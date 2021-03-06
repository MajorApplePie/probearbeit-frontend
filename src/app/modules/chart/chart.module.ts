import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartRoutingModule } from './chart-routing.module';
import { ChartComponent } from './smart-components/chart.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ChartComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChartRoutingModule,
    SharedModule,
    TranslateModule.forChild({
      extend: true
    }),
    ChartsModule
  ]
})
export class ChartModule { }
