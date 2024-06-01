import { Injectable } from "@angular/core";
import { AppState, AuthService } from "@auth0/auth0-angular";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, catchError, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import * as UserActions from "./auth.actions";
import { Store } from "@ngrx/store";
import { loadAppUserData } from "../user/user.actions";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions<any>,
    private authService: AuthService,
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
        switchMap(
          (data) => of(this.store.dispatch(loadAppUserData({data: data.user})))
        )
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