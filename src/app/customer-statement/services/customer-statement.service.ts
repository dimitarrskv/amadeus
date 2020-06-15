import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Transaction } from 'src/app/shared/models/transaction.model';
import xml2js from 'xml2js';  

@Injectable({
  providedIn: 'root'
})
export class CustomerStatementService {

  private csvColMap = new Map<number, string>()
    .set(0, 'reference')
    .set(1, 'accountNumber')
    .set(2, 'description')
    .set(3, 'startBalance')
    .set(4, 'mutation')
    .set(5, 'endBalance');

  constructor(private http: HttpClient) { }

  getRecordsCSV(): Observable<any> {
    return this.http.get('/assets/documents/records.csv', { responseType: 'text' })
  }

  getRecordsXML(): Observable<any> {
    return this.http.get('/assets/documents/records.xml', { responseType: 'text' })
  }

  parseCSV = (rawCSV: string): Transaction[] => {
    const result = [];
    const csvLines = rawCSV.split('\n');
    csvLines.shift(); // remove headers
    csvLines.pop(); // remove last empty line
    csvLines
      .map(_ => _.split(','))
      .forEach(cols => {
        const row: Transaction = <Transaction>{};
        cols.forEach((val, index) => {
          if (this.csvColMap.has(index))
            row[this.csvColMap.get(index)] = val;
        })
        result.push(row)
      });

    return result
  }

  parseXML(rawXML: any): any {
    const result = [];
    xml2js.parseString(rawXML, (err: any, { records: { record } }) => {  
      const records = record;
      records.forEach(record => {
        const row: Transaction = {
          reference: record.$.reference,
          accountNumber: record.accountNumber[0],
          description: record.description[0],
          startBalance: record.startBalance[0],
          mutation: record.mutation[0],
          endBalance: record.endBalance[0]
        };
        result.push(row);
      });
    });  
    return result;
  }
}