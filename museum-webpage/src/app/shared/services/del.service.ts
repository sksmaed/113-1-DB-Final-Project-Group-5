import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../helpers/appSettings';

const API_URL = AppSettings.API_URL + 'del/';

@Injectable({
  providedIn: 'root'
})
export class DelService {

  constructor( private http: HttpClient) { }

  deleteExh(exhibition: any): Observable<any> {
    return this.http.delete(API_URL + `del-exh/${exhibition.exh_id}`, exhibition)
  }

  deleteVolunteer(exh_id: any, volunteerId: string, startTime: any): Observable<any> {
    return this.http.delete(API_URL + `del-vol/${exh_id}`, {
      body: { volunteerId, startTime },
    });
  }

  deleteSponsor(exh_id: any, sponName: string): Observable<any> {
    return this.http.delete(API_URL + `del-spon/${exh_id}`, {
      body: { sponName },
    });
  }

  deleteStaffDuty(exh_id: any, s_id: string): Observable<any> {
    return this.http.delete(API_URL + `del-staff-duty/${exh_id}`, {
      body: { s_id },
    });
  }
}
