import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


import { AppComponent }  from './app.component';
import { TestComponent }  from './comp/test.component';
import { AuthService } from './serv/auth.service';

@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule],
  providers: [AuthService],
  declarations: [AppComponent, TestComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
