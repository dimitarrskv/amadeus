import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerStatementComponent } from './containers/customer-statement/customer-statement.component';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { CustomerStatementState } from './state/customer-statement.state';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CustomerStatementComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([CustomerStatementState]),

    RouterModule.forChild([
      {
        path: '',
        component: CustomerStatementComponent,
        children: []
      }
    ]),

    NzCardModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
    NzTabsModule,
    NzEmptyModule
  ]
})
export class CustomerStatementModule { }
