import { State, Store, Action, StateContext, Selector } from '@ngxs/store';

import { Injectable } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CustomerStatementService } from '../services/customer-statement.service';
import { FetchTransactions, FetchTransactionsSuccess, FetchTransactionsFailure, ClearTransactions, RestoreCustomerStatementState, SwitchTab, UpdateFilter } from '../actions/customer-statement.actions';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CustomerStatementStateModel {
    tab: 'valid-transactions' | 'invalid-transactions';
    filter: string;

    transactions: Transaction[];
    invalidTransactions: Transaction[];

    fetchTransactionsPending: boolean;
    fetchTransactionsSuccess: boolean;
    fetchTransactionsError: { message: string };
}

@State<CustomerStatementStateModel>({
    name: 'CustomerStatement',
    defaults: {
        tab: 'valid-transactions',
        filter: undefined,

        transactions: [],
        invalidTransactions: [],

        fetchTransactionsPending: false,
        fetchTransactionsSuccess: false,
        fetchTransactionsError: undefined
    }
})
@Injectable()
export class CustomerStatementState {
    constructor(
        private store: Store,
        private service: CustomerStatementService
    ) { }

    @Selector()
    static transactions({ tab, filter, transactions, invalidTransactions }: CustomerStatementStateModel) {
        const contextTransactions = tab === 'invalid-transactions' ? 
            invalidTransactions : transactions;

        return filter ?
            contextTransactions.filter(t => (t.reference?.toLocaleLowerCase().indexOf(filter) > -1) || t.description?.toLocaleLowerCase().indexOf(filter) > -1) :
            contextTransactions;
    }

    @Action(RestoreCustomerStatementState)
    restoreState({ patchState }: StateContext<CustomerStatementStateModel>) {
        
        // TODO: Restore state from query params

    }

    @Action(SwitchTab)
    switchTab({ patchState }: StateContext<CustomerStatementStateModel>, action: SwitchTab) { 
        patchState({ tab: action.tab })
    }

    @Action(UpdateFilter)
    updateFilter({ patchState }: StateContext<CustomerStatementStateModel>, action: UpdateFilter) {
        patchState({ filter: action.filter })
    }

    @Action(FetchTransactions)
    fetchTransactions({ patchState, dispatch, getState }: StateContext<CustomerStatementStateModel>) {

        patchState({
            ...getState(),
            fetchTransactionsPending: true,
            fetchTransactionsSuccess: false,
            fetchTransactionsError: undefined,
            transactions: [],
            invalidTransactions: []
        });

        combineLatest([
            this.service.getRecordsCSV()
                .pipe(map(this.service.parseCSV)),
            this.service.getRecordsXML()
                .pipe(map(this.service.parseXML))
        ])
            .pipe(map(([csvTransactions, xmlTransactions]) => {
                
                /** Cross-check csv/xml transactions and split them into valid/invalid arrays */

                const allTransactions = csvTransactions.concat(xmlTransactions);
                const uniqueReferences = new Set(allTransactions.map(a => a.reference));
                const validTransactions = [];

                Array.from(uniqueReferences).forEach(reference => {
                    const matchIndex = allTransactions.findIndex(t => t.reference === reference);
                    const validCalculation = (+allTransactions[matchIndex].startBalance + +allTransactions[matchIndex].mutation).toFixed(2) === (+allTransactions[matchIndex].endBalance).toFixed(2) 
                    if (validCalculation) {
                        validTransactions.push(allTransactions[matchIndex]);
                        allTransactions.splice(matchIndex, 1);
                    }
                })

                const invalidTransactions = allTransactions;
                
                return [validTransactions, invalidTransactions]
            }))
            .subscribe(
                ([validTransactions, invalidTransactions]) => {
                    dispatch(new FetchTransactionsSuccess(<Transaction[]>validTransactions, <Transaction[]>invalidTransactions))
                },
                err => {
                    dispatch(new FetchTransactionsFailure({ message: 'Fetch transactions failed.' }))
                })

        
    }

    @Action(FetchTransactionsSuccess)
    fetchTransactionsSuccess(
        {patchState}: StateContext<CustomerStatementStateModel>, action: FetchTransactionsSuccess
    ) {
        patchState({
            fetchTransactionsPending: false,
            fetchTransactionsSuccess: true,
            fetchTransactionsError: undefined,
            transactions: action.validTransactions,
            invalidTransactions: action.invalidTransactions
        });
    }

    @Action(FetchTransactionsFailure)
    fetchTransactionsFailure({ patchState }: StateContext<any>, action: FetchTransactionsFailure) {
        patchState({
            fetchTransactionsPending: false,
            fetchTransactionsSuccess: false,
            fetchTransactionsError: action.payload,
            transactions: [],
            invalidTransactions: []
        });
    }

    @Action(ClearTransactions)
    clearTransactions({ patchState }: StateContext<CustomerStatementStateModel>) {
        patchState({
            fetchTransactionsPending: false,
            fetchTransactionsSuccess: false,
            fetchTransactionsError: undefined,
            transactions: [],
            invalidTransactions: [],
            filter: undefined
        });
    }

}
