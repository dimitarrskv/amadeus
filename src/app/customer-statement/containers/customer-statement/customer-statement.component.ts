import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { FetchTransactions, SwitchTab, UpdateFilter } from '../../actions/customer-statement.actions';
import { Observable } from 'rxjs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomerStatementState } from '../../state/customer-statement.state';
import { debounceTime } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-customer-statement',
  templateUrl: './customer-statement.component.html',
  styleUrls: ['./customer-statement.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerStatementComponent implements OnInit, OnDestroy {

  @Select((state: any) => state.CustomerStatement.tab)
  tab$: Observable<'valid-transactions' | 'invalid-transactions'>;
  @Select((state: any) => state.CustomerStatement.filter)
  filter$: Observable<string>;

  @Select(CustomerStatementState.transactions)
  transactions$: Observable<Array<Transaction>>;

  form: FormGroup = this.fb.group({
    filter: [null]
  });
  
  constructor(private store: Store, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.store.dispatch([ new FetchTransactions() ]);

    this.form.get('filter').valueChanges
      .pipe(
        debounceTime(500),
        untilDestroyed(this)
      )
      .subscribe(newFilter => {
        this.store.dispatch(new UpdateFilter(newFilter));
      })
  }

  trackByReference(index, item){
    return item.reference;
 }

 toggleTab(tab: { index: number; }) {
   const tabKeys = {
     0: 'valid-transactions',
     1: 'invalid-transactions'
   }
   
   this.store.dispatch(new SwitchTab(tabKeys[tab.index]))
 }

 ngOnDestroy() { }

}
