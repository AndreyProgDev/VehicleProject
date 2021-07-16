import { MainComponent } from './main/main.component';
import { VehicleTableComponent } from './vehicle-table/vehicle-table.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'vehicle',
    component: VehicleTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
