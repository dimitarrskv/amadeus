import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './containers/navbar/navbar.component';
import { LayoutComponent } from './containers/layout/layout.component';
import { LoadingBarComponent } from './containers/loading-bar/loading-bar.component';
import { FooterComponent } from './containers/footer/footer.component';
import { ErrorNotFoundComponent } from './containers/errors/error-not-found/error-not-found.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';



@NgModule({
  declarations: [NavbarComponent, LayoutComponent, LoadingBarComponent, FooterComponent, ErrorNotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'customer-statement', pathMatch: 'full' },
      {
        path: '',
        component: LayoutComponent,
        children: [
          { path: 'customer-statement', loadChildren: () => import('../customer-statement/customer-statement.module').then(m => m.CustomerStatementModule),
            canActivate: [AuthGuard], data: { auth: false } }
        ]
      },

      { path: '404', component: ErrorNotFoundComponent },
      { path: '**', component: ErrorNotFoundComponent }

    ], { scrollPositionRestoration: 'enabled' }),
    NzLayoutModule,
    NzResultModule,
    NzButtonModule
  ]
})
export class CoreModule { }
