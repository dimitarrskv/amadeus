export interface Transaction {
    reference: string;
    accountNumber: string;
    description: string;
    startBalance: number;
    mutation: number;
    endBalance: number;
}