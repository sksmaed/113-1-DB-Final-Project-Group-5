import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../helpers/appSettings';

const API_URL = AppSettings.API_URL + 'stats/';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor( private http: HttpClient ) { }

  getTransStats ( params: any ): Observable<any> {
    return this.http.get(API_URL + 'get-tran-stats', { params: params });
  }
}
