import { Injectable } from "@angular/core";
import { AppState, AuthService } from "@auth0/auth0-angular";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import * as UserActions from "./user.actions";
import { BackendService } from "../../../services/backend.service";
import { Store } from "@ngrx/store";
import { selectAuthUser } from "./user.selectors";

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
        withLatestFrom(this.store.select(selectAuthUser)),
        // TODO [] check if the user is null as it means it was logged out 
        // TODO [] put here check for token forceRefresh 
        // tap(() => this.authService.getAccessTokenSilently()),       
 
        switchMap((obs:any) => (obs[1]) 
          ? this.dataService.getUserWithAuth(obs[1].sub)
            .pipe( map((response) => response.data) ) 
            // TODO [] if no user is retrieved from the API create a user in the database                 
          : of(null)
        ),
        map((response) => this.store
          .dispatch(UserActions.userAppDataLoaded({ data: response ?? null }))
        ),
      ),
    { dispatch: false }
  );


  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.allUserActions.loginFlowInitiated.type),
        tap(() => this.authService.loginWithRedirect()),
      ),
    { dispatch: false }
  );


  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.allUserActions.logoutFlowInitiated.type),
        tap(() => this.authService.logout())
      ),
    { dispatch: false }
  );


  loadUserData$ = createEffect(
    () => this.actions$.pipe(
      ofType(UserActions.allUserActions.loginFlowLoadAppUserData.type),
      withLatestFrom(this.store.select(selectAuthUser)),
      switchMap((obs:any) => (obs[1]) 
          ? this.dataService.getUserWithAuth(obs[1].sub)
          : EMPTY
      ),
      tap((res) => console.log("Refreshing dataset", res)),
      
      
    ),
    { dispatch: false }
  );
}