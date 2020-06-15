import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterEvent, RouteConfigLoadStart, RouteConfigLoadEnd, NavigationEnd } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingBarComponent implements OnInit, OnDestroy {
  
  show = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    let asyncLoadCount = 0;
    this.router.events
      .pipe(untilDestroyed(this)).subscribe(
        (event: RouterEvent): void => {
          if (event instanceof RouteConfigLoadStart) {
            asyncLoadCount++;
          } else if (event instanceof RouteConfigLoadEnd || event instanceof NavigationEnd) {
            asyncLoadCount--;
          }

          asyncLoadCount = Math.max(0, asyncLoadCount);
          this.show = Boolean(asyncLoadCount);
          this.cdr.detectChanges();
        }
      );
  }

  ngOnDestroy() {}

}
