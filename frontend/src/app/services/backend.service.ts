import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AppUser } from '../core/models/user.model';

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

  postUser(user: AppUser){
    return this.http.post<any>(`${env.apiUri}/users`, user);
  }

  patchUser(id: string, values:any = {}){
    //TODO [] Check that bad values are not passed
    return this.http.patch<any>(`${env.apiUri}/users/${id}`, values);
  }

  getRobots(userId: string): Observable<[]> {
    return this.http.get<any>(`${env.apiUri}/robots/${userId}`);
  }
}
