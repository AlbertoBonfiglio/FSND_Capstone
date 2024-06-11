import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, of, switchMap, tap} from "rxjs";
import * as RobotActions from "./robot.actions";
import { BackendService } from "../../../services/backend.service";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppRobot } from "../../models/robot.model";
import { AppState } from "../core.state";


@Injectable()
export class RobotEffects {
  constructor(
    private actions$: Actions<any>,
    private dataService: BackendService,
    private router: Router,
    private store: Store<AppState>,
    private snack: MatSnackBar
  ) {}

  
  addUserRobot$ = createEffect(
    () => this.actions$.
      pipe(
        ofType(RobotActions.addUserRobot.type),
        switchMap(() => of(this.store
          .dispatch(RobotActions.setSelectedRobot({
            data: new AppRobot()
          })))),
        map(() => this.router.navigate(["/home/robots/details"])),
      ),
    { dispatch: false }
  );

  editUserRobot$ = createEffect(
    () => this.actions$.
      pipe(
        ofType(RobotActions.editUserRobot.type),
        switchMap((action) => {
          this.store.dispatch(RobotActions.setSelectedRobot({data: action.robot}));
          return of(action.robot);
        }),
        map((robot) => this.router.navigate(["/home/robots", robot.id, "details" ])),
      ),
    { dispatch: false }
  );


  deleteUserRobot$ = createEffect(
    () => this.actions$.
      pipe(
        ofType(RobotActions.deleteUserRobot.type),
        switchMap((action) => {
          this.store.dispatch(RobotActions.setSelectedRobot({data: action.robot}));
          return of(action.robot);
        }),
        map(() => this.snack.open(`Not implemented yet`, '',  { duration: 3000 } )),
      ),
    { dispatch: false }
  );


  saveUserRobot$ = createEffect(
    () => this.actions$.
      pipe(
        ofType(RobotActions.saveUserRobot.type),
        map((robot:AppRobot) => this.snack.open(`Not implemented yet`, '',  { duration: 3000 } )),
      ),
    { dispatch: false }
  )
}