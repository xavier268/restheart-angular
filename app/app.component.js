import { Component } from '@angular/core';
export var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent.decorators = [
        { type: Component, args: [{
                    selector: 'my-app',
                    template: "\n    <h1>My First Angular App</h1>\n    <!-- navigation -->\n    <my-nav></my-nav>\n    <!-- Routed views go here -->\n    <router-outlet></router-outlet>"
                },] },
    ];
    /** @nocollapse */
    AppComponent.ctorParameters = [];
    return AppComponent;
}());
//# sourceMappingURL=app.component.js.map