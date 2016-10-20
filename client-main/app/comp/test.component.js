import { Component } from '@angular/core';
export var TestComponent = (function () {
    function TestComponent() {
    }
    TestComponent.decorators = [
        { type: Component, args: [{
                    // Specifing moduleId let's the template paths be relative.
                    // It needs special script (fake module) declaration in the index.
                    moduleId: module.id,
                    selector: 'test',
                    template: "\n        <h1>My test component </h1>\n        This is my test component ...\n        "
                },] },
    ];
    /** @nocollapse */
    TestComponent.ctorParameters = [];
    return TestComponent;
}());
//# sourceMappingURL=test.component.js.map