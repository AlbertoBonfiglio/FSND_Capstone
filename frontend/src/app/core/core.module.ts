import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, NgModule, Optional, SkipSelf, isDevMode } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";
import { env } from "process";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    
  ],
  providers: [
   /* {
      provide: APP_INITIALIZER, // delays the start of the application by 3 secs
      useValue: () =>
        new Promise((resolve) => setTimeout(resolve, env.splashDelay)),
        //new Promise((resolve) => setTimeout(resolve, 1)),
      multi: true,
    },
    */
  ],
  exports: [],
})

export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}