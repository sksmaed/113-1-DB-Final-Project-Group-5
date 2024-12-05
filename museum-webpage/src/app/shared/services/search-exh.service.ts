import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../helpers/appSettings';

const API_URL = AppSettings.API_URL + 'search/';

@Injectable({
  providedIn: 'root'
})
export class SearchExhService {

  constructor( private http: HttpClient) { }

  findAll( ): Observable<any> {
    return this.http.get(API_URL + 'findall', { })
  }
}
