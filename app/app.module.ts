import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { TestComponent }  from './comp/test.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent, TestComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
