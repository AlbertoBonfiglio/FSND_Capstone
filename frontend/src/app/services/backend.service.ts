import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { Observable, map, tap } from 'rxjs';
import { AppUser } from '../core/models/user.model';
import { AppRobot } from '../core/models/robot.model';
import { Preference } from '../core/models/preferences.model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  private _buildUser(data: any, expanded: boolean = true) {
    let user = Object.assign(new AppUser, data);
          user.preferences = data.preferences
            .map((preference:any) => Preference.fromJson(JSON.stringify(preference)));
          user.robots = (!expanded) 
            ? data.robots
            : data.robots.map((bot :AppRobot) => AppRobot.fromJson(JSON.stringify(bot)))  
    return user;  
  }

  getUser(userId: string, expanded:boolean=true): Observable<AppUser> {
    return this.http
      .get<AppUser>(`${env.apiUri}/users/${userId}?expanded=${expanded}`)
      .pipe(
        map((res:any) => this._buildUser(res.data, expanded)),
      );
  }

  getUsers(expanded:boolean=true): Observable<AppUser[]> {
    return this.http
      .get<AppUser>(`${env.apiUri}/users?expanded=${expanded}`)
      .pipe(
        map((res:any) => this._buildUser(res.data, expanded)),
      );
  }

  getUserWithAuth(authId: string, expanded:boolean=true): Observable<AppUser> {
    return this.http
      .get<AppUser>(`${env.apiUri}/users/auth/${authId}?expanded=${expanded}`)
      .pipe(
        map((res:any) => this._buildUser(res.data, expanded)),
      );
  }

  postUser(user: AppUser): Observable<AppUser> {
    return this.http
    .post<AppUser>(`${env.apiUri}/users`, user)
    .pipe(
        map((res:any) => res.data)
      );;
  }

  patchUser(user: AppUser): Observable<AppUser> {
    //TODO [] Check that bad values are not passed
    return this.http
      .patch<AppUser>(`${env.apiUri}/users/${user.id}`, user)
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
