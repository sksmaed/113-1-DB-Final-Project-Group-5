import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../helpers/appSettings';

const API_URL = AppSettings.API_URL + 'auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private http: HttpClient) { }

  login(s_id: string, password: string): Observable<any> {
    return this.http.post(API_URL + 'signin', {
      s_id,
      password
    })
  }
  
  register(s_id: string, s_name: string, position: string, contract_start_date: string, password: string): Observable<any> {
    return this.http.post(API_URL + 'signup', { s_id, s_name, position, contract_start_date, password })
  }
}