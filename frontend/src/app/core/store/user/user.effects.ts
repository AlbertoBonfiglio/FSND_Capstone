import { Injectable } from "@angular/core";
import { AppState } from "@auth0/auth0-angular";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, catchError, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { BackendService } from "../../../services/backend.service";
import { Store } from "@ngrx/store";
import { AppUser } from "../../models/user.model";
import * as actions from "./user.actions";
import { allAuthActions } from "../auth/auth.actions";
import { Router } from "@angular/router";
import { selectAuthUser } from "../auth/auth.selectors";
import { SnackbarService } from "../../../services/snackbar.service";


@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions<any>,
    private dataService: BackendService,
    private store: Store<AppState>,
    private router: Router,
     private snack: SnackbarService
  ) {}

  
  
  loadAppUserData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.loadAppUserData.type),
        switchMap((action) => (action.data)  
          ? this.dataService
            .getUserWithAuth(action.data.sub) //gets the user from the database
            .pipe( 
              map((response) => this.store.dispatch(actions.appUserDataLoaded({ data: response}))),
              catchError((err) => {
                if (err.status === 404) {
                  return of(this.store.dispatch(
                      actions.createDefaultAppUserData({ 
                        data: AppUser.UserFactory(action.data.sub, action.data.name, action.data.email) 
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
          : of(this.store.dispatch(actions.appUserDataLoaded({ data: null}))) // on logOut clears the appUser data 
        ),        
      ),
    { dispatch: false }
  );


  createDefaultUserData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.createDefaultAppUserData.type),
        tap((v)=> console.log("", v)),
        switchMap((action:any) => this.dataService
          .postUser(action.data as AppUser) //gets the user from the database
            .pipe( 
              map((response) => this.store.dispatch(actions.appUserDataLoaded({ data: response}))),
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
        ofType(actions.editAppUserData.type),
        map((action) => this.router.navigate(["/home/user", action.data.id,  "details"])),
       ),
    { dispatch: false }
  );

  cancelEditUserData$ = createEffect(
    () => this.actions$.
      pipe(
        ofType(actions.cancelEditAppUserData),
        map(() => this.router.navigate(["/home"])),
       ),
    { dispatch: false }
  );


  saveUser$ = createEffect(
    () => this.actions$.
      pipe(
        ofType(actions.saveAppUserData.type),
        switchMap((action: any) => 
            this.dataService
            .patchUser(action.data as AppUser)
            .pipe( 
              map((response) => this.store.dispatch(actions.saveAppUserDataSuccess({ data: response}))),
              catchError((err) => of(this.store.dispatch(actions.databaseError({error: err}))))
          )
      )
    ),
    { dispatch: false }
  );

  generateNewApiKey$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.createAppUserAPIKey.type),
        switchMap((action:any) => this.dataService.generateNewApiKey(action.userId) 
          .pipe( 
              map((response) => this.store.dispatch(actions.createAppUserAPIKeySuccess({ data: response}))),
              catchError((err) => of(this.store.dispatch(actions.databaseError({error: err}))))
          ),
        )
      ),
    { dispatch: false }
  );


  saveAppUserDataSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.saveAppUserDataSuccess.type),
        withLatestFrom(this.store.select(selectAuthUser)),
        map(([action, user]) => this.store.dispatch(actions.loadAppUserData({data: user}))),
        tap(() => this.snack.info('Operation completed successfully')),
      ),
    { dispatch: false }
  );


  newApiKeySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.createAppUserAPIKeySuccess.type),
        map((action:any) => this.store.dispatch(actions.appUserDataLoaded({ data: action.data}))),
      ),
    { dispatch: false }
  );

}
