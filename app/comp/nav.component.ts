import { Component } from '@angular/core';

@Component({
  // Specifing moduleId let's the template paths be relative.
  // It needs special script (fake module) declaration in the index.
  moduleId: module.id,

  selector: 'my-nav',
  template : `
        This is my nav component
        <nav>
        <a routerLink="/" routerLinkActive="active">Login</a>
        <a routerLink="/test" routerLinkActive="active">Test</a>
        </nav>
        `
})
export class NavComponent {}
