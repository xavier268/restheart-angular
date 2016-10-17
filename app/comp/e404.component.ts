import { Component } from '@angular/core';

@Component({
  // Specifing moduleId let's the template paths be relative.
  // It needs special script (fake module) declaration in the index.
  moduleId: module.id,

  selector: 'e404',
  template: `
          <h1> This page does not exists </h1>
          Message from the e404 component ...
          `
})
export class E404Component { }
