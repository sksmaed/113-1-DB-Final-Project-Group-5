import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../helpers/appSettings';

const API_URL = AppSettings.API_URL + 'search/';

@Injectable({
  providedIn: 'root'
})
export class SearchExhService {

  constructor( private http: HttpClient) { }

  findAll ( ): Observable<any> {
    return this.http.get(API_URL + 'find-all', { })
  }

  filterExh( params: any ): Observable<any> {
    return this.http.get(API_URL + 'filter-exh', { params })
  }

  findExhUser( params: any ): Observable<any> {
    return this.http.get(API_URL + 'find-exh-user', { params })
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

  getTicket( params: any ):  Observable<any> {
    return this.http.get(API_URL + 'find-ticket', { params: params });
  }

  getTicketAdmin( params: any ):  Observable<any> {
    return this.http.get(API_URL + 'find-ticket-admin', { params: params });
  }

  getTransaction( params: any ):  Observable<any> {
    return this.http.get(API_URL + 'find-transaction', { params: params });
  }

  getTransactionCustomer( params: any ):  Observable<any> {
    return this.http.get(API_URL + 'find-transaction-customer', { params: params });
  }
}
