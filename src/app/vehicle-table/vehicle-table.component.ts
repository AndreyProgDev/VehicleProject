import { Component, ViewChild } from '@angular/core';
import { VehicleCode } from '../shared/interface';
import { VehicleService } from './vehicle-service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

const ELEMENT_DATA: VehicleCode[] = [];

@Component({
  selector: 'app-vehicle-table',
  templateUrl: './vehicle-table.component.html',
  styleUrls: ['./vehicle-table.component.scss']
})

export class VehicleTableComponent {
  displayedColumns: string[] = ['Vehicle.name','Vehicle.Organization.name','Vehicle.Department.name','Vehicle.Contragent.name','code1c','Aggregate.name','Drivers'];
  dataSource = new MatTableDataSource<VehicleCode>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  /** Constructor of VehicleTableComponent 
   *  @param vehicleCode declares dependency injection of VehicleService
   */
  constructor(private vehicleCode : VehicleService) {
    this.vehicleCode.getJSON().subscribe(data =>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sortingDataAccessor = vehicleCode.sortingVehiclesAccessor;
      this.dataSource.sortData = vehicleCode.sortVehicles; 
      this.dataSource.filterPredicate = vehicleCode.filterVehicles;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
   }

   /** Function which actives filtering of table
    *  @param event declares value with which filtering will be executed
    */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage();
  }

}
