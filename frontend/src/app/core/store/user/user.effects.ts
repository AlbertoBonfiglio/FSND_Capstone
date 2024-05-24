import { Injectable } from "@angular/core";
import { AppState, AuthService } from "@auth0/auth0-angular";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, catchError, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import * as UserActions from "./user.actions";
import { BackendService } from "../../../services/backend.service";
import { Store } from "@ngrx/store";
import { selectAuthUser } from "./user.selectors";
import { AppUser } from "../../models/user.model";
import { Theme } from "../settings/settings.state";

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions<any>,
    private authService: AuthService,
    private dataService: BackendService,
    private store: Store<AppState>,
  ) {}

  
  userChanged$ = createEffect(() =>
    this.authService.user$.pipe(
      map((user) =>
        UserActions.userChangedFromAuth0SDK({ user: user ?? null })
      ),
    )
  );

  
  afterUserChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.userChangedFromAuth0SDK.type),
        withLatestFrom(this.store.select(selectAuthUser)), //returns an array of results with selectAuthuser as the last
        // TODO [] check if the user is null as it means it was logged out 
        // TODO [] put here check for token forceRefresh 
        // tap(() => this.authService.getAccessTokenSilently()),       
        switchMap((obs:any) => (obs[1])  
          ? this.dataService
            .getUserWithAuth(obs[1].sub) //gets the user from the database
            .pipe( 
              tap ((response) => console.log("getUserWithAuth", response)),
              map((response) => this.store.dispatch(UserActions.userAppDataLoaded({ data: response.data}))),
              catchError((err) => (err.status === 404)
                ? of(this.store.dispatch(
                      UserActions.createDefaultAppUserData({ 
                        data: {
                          auth_id: obs[1].sub,
                          name: obs[1].name,
                          email: obs[1].email,
                          preferences: {theme: Theme.system }
                        } 
                      })
                    )
                  )
                : of(console.log(err))) 
            ) 
          : of(this.store.dispatch(UserActions.userAppDataLoaded({ data: null}))) // on logOut clears the appUser data 
        ),        
      ),
    { dispatch: false }
  );


  createDefaultUserData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.createDefaultAppUserData.type),
        tap((v)=> console.log("", v)),
        switchMap((action:any) => this.dataService
          .postUser(action.data as AppUser) //gets the user from the database
            .pipe( 
              tap ((response) => console.log("createDefaultAppUserData", response)),
              map((response) => this.store.dispatch(UserActions.userAppDataLoaded({ data: response.data}))),
              catchError(
                (err) => of(console.log(err))
              ) 
            ) 
        ),        
      ),
    { dispatch: false }
  );  


  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.allAuthActions.loginFlowInitiated.type),
        tap(() => this.authService.loginWithRedirect()),
      ),
    { dispatch: false }
  );


  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.allAuthActions.logoutFlowInitiated.type),
        tap(() => this.authService.logout())
      ),
    { dispatch: false }
  );

}