import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule }   from '@angular/router';


import { AppComponent }  from './app.component';
import { TestComponent }  from './comp/test.component';
import { NavComponent }  from './comp/nav.component';
import { LoginComponent }  from './comp/login.component';
import { E404Component }  from './comp/e404.component';
import { AuthService } from './serv/auth.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
      // Order matters ... first match will do !
      { path: 'test', component: TestComponent },
      { path: '', component: LoginComponent },
      { path: '**', component: E404Component }
    ])
  ],
  providers: [AuthService],
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    TestComponent,
    E404Component],

  bootstrap: [AppComponent]
})
export class AppModule { }
