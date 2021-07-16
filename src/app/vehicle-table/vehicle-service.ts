import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleCode } from "../shared/interface";
import { MatSort } from '@angular/material/sort';

@Injectable({
    providedIn: 'root'
})


export class VehicleService {
    private _jsonURL = './assets/data.json';
    private allcoluns: string;
    private elem1: any;
    private elem2: any;
    
    constructor(private http: HttpClient) { }

    /**
     * Function which gets VehicleCode data from data.json file
     * @returns An Observable<VehicleCode[]> of the HttpResponse, with a response body
     */
    public getJSON(): Observable<VehicleCode[]> {
        return this.http.get<VehicleCode[]>(this._jsonURL)
    }

    /**
     * Delegate clarifies paths to VehicleCode fields which will be sorted 
     * @param elem object of VehicleCode type
     * @param path to field of VehicleCode
     * @returns Field of VehicleCode from declared path
     */
    public sortingVehiclesAccessor = (elem, path) => {
      switch (path) {
        case 'Vehicle.name': return elem.Vehicle.name;
        case 'Vehicle.Organization.name': return elem.Vehicle.Organization.name;
        case 'Vehicle.Department.name': return elem.Vehicle.Department.name;
        case 'Vehicle.Contragent.name': return elem.Vehicle.Contragent.name;
        case 'Aggregate.name': return elem.Aggregate.name;
        case 'Drivers': return elem.Drivers;

        default: return elem[path];
      }
    };

    /** Delegate which sorts VehicleCode data
     * @param data one instance of VehicleCode data
     * @param sort object of MatSort type which declares how to sort VehicleCode
     * @returns number which shows were data must be positioned in VehicleCode[]
     */
    public sortVehicles = (data, sort: MatSort) => {
        let sortedData = [];

        sortedData = data.sort((a, b) => {
          const direction = this.getSortingOrder(sort.direction, a, b);
          if(sort.active != undefined) {
            this.elem1 = this.resolve(sort.active, direction[0] as any);
            this.elem2 = this.resolve(sort.active, direction[1] as any);

            if(sort.active == 'Drivers') {   
                this.elem1 = this.elem1.map((val) => {return val['name']}).join(' ');
                this.elem2 = this.elem2.map((val) => {return val['name']}).join(' ');
            }

            if(sort.direction === '')
                return 1;

            return (this.elem1 || this.elem2) ? (!this.elem1 ? -1 : !this.elem2 ? 1 : this.elem1.localeCompare(this.elem2)) : 0
          }
          });
        return sortedData;
    };

    /** Filters VehicleCode data
     * @param data one instance of VehicleCode data
     * @param filter object of string type which declares how to filter VehicleCode
     * @returns number which shows were data must be positioned in VehicleCode[]  
     */
    public filterVehicles = (data, filter) => { 
        this.allcoluns = (data.Vehicle.name+
        data.Vehicle.Organization.name+
        (data.Vehicle.Department ? data.Vehicle.Department.name : "")+
        (data.Vehicle.Contragent ? data.Vehicle.Contragent.name : "")+
        data.code1c+
        (data.Aggregate ? data.Aggregate.name : "")+
        (data.Drivers ? data.Drivers.map((val) => {return val['name']}).join(' ') : ""))

        if(filter) {
          return this.allcoluns
          .toLowerCase()
          .indexOf(filter.trim().toLowerCase()) > -1
        }
        else{
          return false;
        }
    }
    
    /** Declares order direction of massive, whether it should be from a-z or z-a
     * @param order 'asc','desc,'' shows how a, d must be aligned
     * @param a objectA of VehicleCode
     * @param b objectB of VehicleCode
     * @returns const sorted: any[]; [a, b] or [b, a];
     */
    private getSortingOrder = (order, a, b) => {
        const sorted = order === "asc" ? [a, b] : [b, a];
        return sorted;
    }
    
    /** Gives field of VehicleCode
     *  @param path to to field of VehicleCode
     *  @param obj of VehicleCode
     *  @param separator shows how to split path
     *  @returns field at the end of the path or undefined if obj null
     */
    private resolve(path, obj=self, separator='.') {
        if(obj != null && obj != undefined) {
          var properties = Array.isArray(path) ? path : path.split(separator)
          return properties.reduce((prev, curr) => prev && prev[curr], obj)
        } else {
          return undefined;
        }
    }
  }