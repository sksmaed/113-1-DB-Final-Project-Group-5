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

  filterExh( params: any ): Observable<any> {
    return this.http.get(API_URL + 'filter-exh', { params })
  }

  findAll( ): Observable<any> {
    return this.http.get(API_URL + 'findall', { })
  }

  getVolunteerByExhId( exh_id: any ): Observable<any> {
    return this.http.get(API_URL + `find-vol/${exh_id}`)
  }

  getSponsorByExhId( exh_id: any ): Observable<any> {
    return this.http.get(API_URL + `find-spon/${exh_id}`)
  }

  getStaffByExhId( exh_id: any ): Observable<any> {
    return this.http.get(API_URL + `find-staff-exh/${exh_id}`)
  }

  getStaffById( s_id: any ): Observable<any> {
    return this.http.get(API_URL + `find-staff/${s_id}`)
  }
}
