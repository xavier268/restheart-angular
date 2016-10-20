import { Component } from '@angular/core';
export var NavComponent = (function () {
    function NavComponent() {
    }
    NavComponent.decorators = [
        { type: Component, args: [{
                    // Specifing moduleId let's the template paths be relative.
                    // It needs special script (fake module) declaration in the index.
                    moduleId: module.id,
                    selector: 'my-nav',
                    template: "\n        This is my nav component\n        <nav>\n        <a routerLink=\"/\" routerLinkActive=\"active\">Login</a>\n        <a routerLink=\"/test\" routerLinkActive=\"active\">Test</a>\n        </nav>\n        "
                },] },
    ];
    /** @nocollapse */
    NavComponent.ctorParameters = [];
    return NavComponent;
}());
//# sourceMappingURL=nav.component.js.map