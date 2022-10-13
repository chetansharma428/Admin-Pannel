import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  constructor(private readonly router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
}
