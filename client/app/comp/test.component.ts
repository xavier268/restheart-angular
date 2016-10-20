import { Component } from '@angular/core';

@Component({
  // Specifing moduleId let's the template paths be relative.
  // It needs special script (fake module) declaration in the index.
  moduleId: module.id,

  selector: 'test',
  template : `
        <h1>My test component </h1>
        This is my test component ...
        `
})
export class TestComponent {}
