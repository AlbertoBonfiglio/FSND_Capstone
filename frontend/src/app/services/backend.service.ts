import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { AppUser } from '../core/models/user.model';
import { AppRobot } from '../core/models/robot.model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }


  getUser(userId: string, expanded:boolean=true): Observable<AppUser> {
    return this.http
      .get<AppUser>(`${env.apiUri}/users/${userId}?expanded=${expanded}`)
      .pipe(
        map((res:any) => res.data)
      );;
  }

  getUsers(expanded:boolean=true): Observable<AppUser[]> {
    return this.http
      .get<AppUser>(`${env.apiUri}/users?expanded=${expanded}`)
      .pipe(
        map((res:any) => res.data)
      );;
  }

  getUserWithAuth(authId: string, expanded:boolean=true): Observable<AppUser> {
    return this.http
      .get<AppUser>(`${env.apiUri}/users/auth/${authId}?expanded=${expanded}`)
      .pipe(
        map((res:any) => res.data)
      );;
  }

  postUser(user: AppUser): Observable<AppUser> {
    return this.http
    .post<AppUser>(`${env.apiUri}/users`, user)
    .pipe(
        map((res:any) => res.data)
      );;
  }

  patchUser(id: string, values:any = {}): Observable<AppUser> {
    //TODO [] Check that bad values are not passed
    return this.http
      .patch<AppUser>(`${env.apiUri}/users/${id}`, values)
      .pipe(
        map((res:any) => res.data)
      );
  }

  generateNewApiKey(id: string): Observable<AppUser> {
    //TODO [] Check that bad values are not passed
    return this.http
      .patch<AppUser>(`${env.apiUri}/users/${id}/changeApiKey`, {})
      .pipe(
        map((res:any) => res.data)
      );
  }

  deleteUser(id: string): Observable<boolean> {
    return this.http
      .delete<AppUser>(`${env.apiUri}/users/${id}`)
      .pipe(
        map((res:any) => res.success)
      );
  }

  getRobots(userId: string): Observable<AppRobot[]> {
    return this.http
      .get<AppRobot[]>(`${env.apiUri}/robots/${userId}`)
      .pipe(
        map((res:any) => res.data)
      );
  }
}
