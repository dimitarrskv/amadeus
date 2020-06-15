# Amadeus (Rabobank Customer Statement)

## Summary
The application reads 2 streams of customer statement records (.csv & .xml files, stored in `/assets`).
The records are being validated agains unique reference numbers and coherency of balance calculations.
The records are segmented in 2 categories - valid/invalid, which are displayed on `http://localhost:4200/customer-statement`.


## Developer's Notes
 * Angular@9.1.11,
 * Component framework NgZorro (https://ng.ant.design/docs/introduce/en)
 * NGXS as a state management library (https://www.ngxs.io/) since it has minimal boilerplate
 * Tailwind as a class-based styling framework (https://tailwindcss.com/) to minimize the css blueprint
 * PWA good practices are followed
 * Followed this document (https://www.rabobank.com/en/images/dotCom-Rationale.pdf) to override some parts
of the default theme according to the design guide of Rabobank

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.8.

## TODOs
 * resolve decoding issue of imported descriptions
 * reflect selected tab/filter as query params to facilitate reconstruction of the previous state
 * add per-column sorting/filtering, infinite scroll
 * add `export valid/invalid records as CSV/XML` functionality
 * create login page and enable auth guard on `/customer-statement`
 * add skeletons to indicate processing of records' streams

## Setup with Development Server
* Clone the repo
* Run `npm install`
* Run `npm run start` for a dev server.
* Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.
There is no server included in this repo that serves the files from `/dist`