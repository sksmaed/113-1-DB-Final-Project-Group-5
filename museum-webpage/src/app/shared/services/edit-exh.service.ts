import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../helpers/appSettings';

const API_URL = AppSettings.API_URL + 'edit/';

@Injectable({
  providedIn: 'root'
})
export class EditExhService {

  constructor( private http: HttpClient) { }

  updateExh(exhibition: any): Observable<any> {
    return this.http.put(API_URL + `update-exh/${exhibition.exh_id}`, exhibition)
  }

  updateVolunteer(exh_id: any, volunteerId: string, startTime: any, record: any): Observable<any> {
    return this.http.put(API_URL + `update-vol/${exh_id}`, {volunteerId, startTime, record})
  }
}
