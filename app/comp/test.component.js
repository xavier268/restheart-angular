import { Component } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { AuthService } from "../serv/auth.service";
export var TestComponent = (function () {
    // Inject login service
    function TestComponent(auth) {
        this.auth = auth;
        this.nbUsers = 0;
    }
    TestComponent.prototype.login = function (user, password) {
        console.info("Login method called");
        this.auth.login(user, password);
    };
    TestComponent.prototype.logout = function () {
        this.auth.logout();
    };
    TestComponent.prototype.countUsers = function () {
        var _this = this;
        console.info("Preparing to list users (must be loggedIn");
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
            console.info("Error counting users");
            console.log(err);
            _this.nbUsers = 0;
        });
    };
    TestComponent.decorators = [
        { type: Component, args: [{
                    // Specifing moduleId let's the template paths be relative.
                    // It needs special script (fake module) declaration in the index.
                    moduleId: module.id,
                    selector: 'my-test',
                    templateUrl: "test.html"
                },] },
    ];
    /** @nocollapse */
    TestComponent.ctorParameters = [
        { type: AuthService, },
    ];
    return TestComponent;
}());
//# sourceMappingURL=test.component.js.map