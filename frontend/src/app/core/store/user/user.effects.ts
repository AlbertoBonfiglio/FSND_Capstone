import { Injectable } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, tap } from "rxjs";
import * as UserActions from "./user.actions";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions<any>,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  // ✨ New 👇
  userChanged$ = createEffect(() =>
    this.authService.user$.pipe(
      map((user) =>
        UserActions.userChangedFromAuth0SDK({ user: user })
      )
    )
  );

  login$ = createEffect(
    () =>
      this.actions$.pipe(
        tap(() => console.log("login effect")),
        ofType(UserActions.allUserActions.loginFlowInitiated.type),
        /*
        tap(() =>  {
          const headers = {'Access-Control-Allow-Origin': '*'};

          const uri = `https://${environment.auth.domain}/authorize?response_type=token&client_id=${environment.auth.clientId}&redirect_uri=${'http://localhost:4200'}&state=${'xyzABC123'}`
          console.log("Call to http login", uri);        
          const value = this.http.post(uri,{ headers: headers })
            .pipe(
              tap((response) => {
                console.log(response);
                return response;
              })
            ).subscribe(
              (resp) => console.log(resp)
            );


          console.log(value);
          return value
        })
  //connection={connectionName}&
        */
       tap(() => this.authService.loginWithRedirect()),
       tap(() => this.authService.getAccessTokenSilently()),
       tap((value) => console.log(value)),
       
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
}