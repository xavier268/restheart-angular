import { Component } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { AuthService } from "../serv/auth.service";
export var LoginComponent = (function () {
    // Inject login service
    function LoginComponent(auth) {
        this.auth = auth;
        this.nbUsers = 0;
        this.user = this.auth.getUser(); // In case we return to the component after previous active login ...
    }
    LoginComponent.prototype.login = function () {
        console.log("Login method called");
        this.auth.login(this.user, this.password);
        this.password = null; // security ...
    };
    LoginComponent.prototype.logout = function () {
        this.auth.logout();
    };
    LoginComponent.prototype.countUsers = function () {
        var _this = this;
        console.log("Preparing to list users (must be loggedIn");
        this.auth.request(RequestMethod.Get, this.auth.BASEURL + "/rh/auth/users?count&pagesize=0")
            .subscribe(
        // Data handler
        function (res) {
            var data = res.json();
            console.log(res);
            console.log(data);
            _this.nbUsers = data._size;
        }, 
        // err handlr
        function (err) {
            console.log("Error counting users");
            console.log(err);
            _this.nbUsers = 0;
        });
    };
    LoginComponent.decorators = [
        { type: Component, args: [{
                    // Specifing moduleId let's the template paths be relative.
                    // It needs special script (fake module) declaration in the index.
                    moduleId: module.id,
                    selector: 'login',
                    templateUrl: "login.html"
                },] },
    ];
    /** @nocollapse */
    LoginComponent.ctorParameters = [
        { type: AuthService, },
    ];
    return LoginComponent;
}());
//# sourceMappingURL=login.component.js.map