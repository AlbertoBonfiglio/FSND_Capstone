import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }


  getUser(userId: string) {
    return this.http.get<any>(`${env.apiUri}/users/${userId}`);
  }
  getUserWithAuth(authId: string) {
    return this.http.get<any>(`${env.apiUri}/users/auth/${authId}`);
  }

  getRobots(userId: string): Observable<[]> {
    return this.http.get<any>(`${env.apiUri}/robots/${userId}`);
  }
}
