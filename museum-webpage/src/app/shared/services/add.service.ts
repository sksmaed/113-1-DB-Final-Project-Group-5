import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../helpers/appSettings';

const API_URL = AppSettings.API_URL + 'add/';

@Injectable({
  providedIn: 'root'
})
export class AddService {

  constructor(private http: HttpClient) { }

  addVolunteerRecord(volunteerData: any): Observable<any> {
    return this.http.post(API_URL + 'add-vol', volunteerData);
  }
}
