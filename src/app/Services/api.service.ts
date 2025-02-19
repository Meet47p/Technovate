import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }
  http=inject(HttpClient);

  GetTableApi(){
    return this.http.get("http://192.168.1.76:5300/api/Database/tables");
  }
  GetColumnApi(selectedTable:string){
    return this.http.get(`http://192.168.1.76:5300/api/Database/fields/${selectedTable}`);
  }
}
