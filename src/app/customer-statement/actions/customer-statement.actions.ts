import { Transaction } from 'src/app/shared/models/transaction.model';

export class FetchTransactions {
  static readonly type = '[Customer Settlement] Fetch';
  constructor() {}
}

export class FetchTransactionsSuccess {
  static readonly type = '[Customer Settlement] Fetch success';
  constructor(public readonly validTransactions: Transaction[], public readonly invalidTransactions: Transaction[]) {}
}

export class FetchTransactionsFailure {
  static readonly type = '[Customer Settlement] Fetch failure';
  constructor(public readonly payload: { message: string }) {}
}

export class ClearTransactions {
  static readonly type = '[Customer Settlement] Clear';
  constructor() {}
}

export class RestoreCustomerStatementState {
    static readonly type = '[Customer Settlement] Restore State';
    constructor() {}
}

export class SwitchTab {
  static readonly type = '[Customer Settlement] Switch Tab';
  constructor(public readonly tab: 'valid-transactions' | 'invalid-transactions') {}
}

export class UpdateFilter {
  static readonly type = '[Customer Settlement] Update Filter';
  constructor(public readonly filter: string) {}
}