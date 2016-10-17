import { Component } from '@angular/core';
import { AuthService } from "../serv/auth.service";
export var TestComponent = (function () {
    // Inject login service
    function TestComponent(auth) {
        this.auth = auth;
    }
    TestComponent.prototype.login = function (user, password) {
        console.info("Login method called");
        this.auth.login(user, password);
    };
    TestComponent.prototype.logout = function () {
        this.auth.logout();
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