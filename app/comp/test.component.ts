import { Component } from '@angular/core';

@Component({

// Specifing moduleId let's the templat ebe relative.
// It needs special script (fake module) decalration in the index.
moduleId : module.id,

  selector: 'my-test',
  templateUrl: "test.html"
})
export class TestComponent {

  public login() {
    console.info("Testing login");
  }

}
