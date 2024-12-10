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

  addExhibition(exhbitionData: any): Observable<any> {
    return this.http.post(API_URL + 'add-exh', exhbitionData);
  }

  addVolunteerRecord(volunteerData: any): Observable<any> {
    return this.http.post(API_URL + 'add-vol', volunteerData);
  }

  addSponsorRecord(sponsorData: any): Observable<any> {
    return this.http.post(API_URL + 'add-spon', sponsorData);
  }

  addStaffDutyRecord(staffDutyData: any): Observable<any> {
    return this.http.post(API_URL + 'add-staff-duty', staffDutyData);
  }

  addTransaction(tranData: any): Observable<any> {
    return this.http.post(API_URL + 'add-tran', tranData);
  }

  addTicket(ticketData: any): Observable<any> {
    return this.http.post(API_URL + 'add-ticket', ticketData);
  }
}
