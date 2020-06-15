import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-error-not-found',
  templateUrl: './error-not-found.component.html',
  styleUrls: ['./error-not-found.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
