import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'converter',
    loadChildren: () => import('./modules/converter/converter.module').then(m => m.ConverterModule)
  },
  {
    path: 'chart',
    loadChildren: () => import('./modules/chart/chart.module').then(m => m.ChartModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./modules/wallet/wallet.module').then(m => m.WalletModule)
  },
  {
    path: 'details',
    loadChildren: () => import('./modules/details/details.module').then(m => m.DetailsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
