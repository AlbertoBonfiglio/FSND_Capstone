import { Component, HostListener, Input, OnDestroy, OnInit, input } from '@angular/core';
import { speedDialFabAnimations } from '../speed-dial/speed-dial.animations';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, filter, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

//** Speed dial component
// * Shows fab buttons toaid in site navigation.
// * Can hide a button if the route matched the current route
// */

// TODO [X] Add hostlistener to show component only when scroll is past a certain distance
// TODO [ ] Add animation when shown
const dependencies = [
  CommonModule, 
  MatButtonModule, 
  MatIconModule,
];

export interface IFabButton {
  icon: string;
  action: string;
  type: fabType;
}

export const enum fabType {
  rlink = 0,
  scrollUp = 1,
  scrollDown = 2,
}

@Component({
  standalone: true,
  selector: 'app-speed-dial',
  templateUrl: './speed-dial.component.html',
  styleUrls: ['./speed-dial.component.scss'],
  imports: dependencies,
  animations: speedDialFabAnimations,
})
export class SpeedDialComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  @Input() hideCurrentRoute: boolean = false;
  @Input() showOnlyOnScroll: boolean = false;
  @Input() buttons: IFabButton[] = [];
  @Input() icon: string = 'add';

  public button$: BehaviorSubject<IFabButton[]> = new BehaviorSubject<IFabButton[]>(
    []
  );
  public fabTogglerState = 'inactive';
  public isVisible: boolean = false;
  
  private currentRoute: string = 'home';
  private onScroll$: BehaviorSubject<number> = new BehaviorSubject<number>(
    window.scrollY
  );

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.subscribeToNavEvents();

    (this.showOnlyOnScroll) 
      ? this.subscribeToScrollEvents()
      : this.isVisible = true;
    
    console.log(this.icon);
  }

  @HostListener('window:scroll', ['$event'])
  private onScroll(event: any): void {
    this.onScroll$.next(window.scrollY);
  }

  private subscribeToNavEvents(): void {
    this.router.events
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe((e: any) => {
        this.currentRoute = e.url.replace('/', '');
        console.log(this.currentRoute);
      });
  }

  private subscribeToScrollEvents(): void {
    this.onScroll$
      .pipe(
        takeUntil(this.ngUnsubscribe), 
        distinctUntilChanged(),
      )
      .subscribe((scrollPos: number) => {
        this.isVisible = scrollPos > 100;
      });
  }

  private showItems(): void {
    this.fabTogglerState = 'active';
    if (this.hideCurrentRoute) {
      this.button$.next(
        this.buttons.filter((i) => i.action !== this.currentRoute)
      );
    }
  }

  private hideItems(): void {
    this.fabTogglerState = 'inactive';
    this.button$.next([]);
  }

  public onToggleFab(): void {
    this.button$.value.length ? this.hideItems() : this.showItems();
  }

  public onButtonClick(btn: { type: fabType; action: string }): void {
    this.onToggleFab(); // closes the dialler
    switch (btn.type) {
      case fabType.scrollUp:
        window.scrollTo(0, 0);
        break;

      case fabType.scrollDown:
        //TODO Implement this
        break;

      default:
        // rlink
        this.router.navigate([btn.action]);
        break;
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
