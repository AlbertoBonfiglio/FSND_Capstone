import { Injectable } from "@angular/core";
import { AppState, AuthService } from "@auth0/auth0-angular";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, catchError, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { BackendService } from "../../../services/backend.service";
import { Store } from "@ngrx/store";
import { AppUser, UserPrefs } from "../../models/user.model";
import { Status } from "../../enums";
import { appUserDataLoaded, createDefaultAppUserData, editAppUserData, loadAppUserData, saveAppUserData } from "./user.actions";
import { allAuthActions } from "../auth/auth.actions";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions<any>,
    private dataService: BackendService,
    private store: Store<AppState>,
    private router: Router,
     private snack: MatSnackBar
  ) {}

  
  
  loadAppUserData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadAppUserData.type),
        tap ((response) => console.log("loadAppUserData effect", response)),
        switchMap((action) => (action.data)  
          ? this.dataService
            .getUserWithAuth(action.data.sub) //gets the user from the database
            .pipe( 
              tap ((response) => console.log("getUserWithAuth", response)),
              map((response) => this.store.dispatch(appUserDataLoaded({ data: response}))),
              catchError((err) => {
                if (err.status === 404) {
                  return of(this.store.dispatch(
                      createDefaultAppUserData({ 
                        data: {
                          auth_id: action.data.sub,
                          name: action.data.name,
                          email: action.data.email,
                          preferences: new UserPrefs(),
                          robots: -1, // doesn't matter, gets sanitized in the backend
                          status: Status.active
                        } 
                      })
                    )
                  );
                } else if (err.error === 'missing_refresh_token') {
                  return of(this.store.dispatch(allAuthActions.loginFlowInitiated()))
                } 
                console.log(err);
                return of(EMPTY); 
              }
            )) 
          : of(this.store.dispatch(appUserDataLoaded({ data: null}))) // on logOut clears the appUser data 
        ),        
      ),
    { dispatch: false }
  );


  createDefaultUserData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createDefaultAppUserData.type),
        tap((v)=> console.log("", v)),
        switchMap((action:any) => this.dataService
          .postUser(action.data as AppUser) //gets the user from the database
            .pipe( 
              tap ((response) => console.log("createDefaultAppUserData", response)),
              map((response) => this.store.dispatch(appUserDataLoaded({ data: response}))),
              catchError(
                (err) => of(console.log(err))
              ) 
            ) 
        ),        
      ),
    { dispatch: false }
  );  


  editUserData$ = createEffect(
    () => this.actions$.
      pipe(
        ofType(editAppUserData.type),
        tap((action)=> console.log(action)),
        map((action) => this.router.navigate(["/home/user", action.data.id,  "details"])),
       ),
    { dispatch: false }
  )


  saveUser$ = createEffect(
    () => this.actions$.
      pipe(
        ofType(saveAppUserData.type),
        map((user:AppUser) => this.snack.open(`Not implemented yet`, '',  { duration: 3000 } )),
      ),
    { dispatch: false }
  )

}
