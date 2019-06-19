/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { DroppableDirective } from './ngx-droppable.directive';
import { DrakeStoreService } from '../services/drake-store.service';
/**
 * Adds properties and events to draggable elements
 *
 * @export
 */
var DraggableDirective = /** @class */ (function () {
    function DraggableDirective(el, drakesService, droppableDirective) {
        this.el = el;
        this.drakesService = drakesService;
        this.droppableDirective = droppableDirective;
        this._moves = true;
        /*
          ContentChildren doesn't get children created with NgTemplateOutlet
          See https://github.com/angular/angular/issues/14842
          Implemented via updateElements method
        
          @ContentChildren(DragHandleDirective, {descendants: true})
          handlesList: QueryList<DragHandleDirective>; */
        this.handles = [];
        this.drag = new EventEmitter();
        this.dragDelay = 200; // milliseconds
        this.dragDelayed = true;
    }
    Object.defineProperty(DraggableDirective.prototype, "dropZones", {
        get: /**
         * @return {?}
         */
        function () {
            return this._dropZones || this.ngxDraggable || this._parentDropzones;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._dropZones = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DraggableDirective.prototype, "hasHandle", {
        get: /**
         * @return {?}
         */
        function () {
            return !!this.handles.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DraggableDirective.prototype, "element", {
        get: /**
         * @return {?}
         */
        function () {
            return this.el.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} e
     * @return {?}
     */
    DraggableDirective.prototype.onMove = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (!this._moves || this.dragDelayed) {
            e.stopPropagation();
            clearTimeout(this.touchTimeout);
        }
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.onDown = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this._moves) {
            this.touchTimeout = setTimeout(function () {
                _this.dragDelayed = false;
            }, this.dragDelay);
        }
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.onUp = /**
     * @return {?}
     */
    function () {
        if (this._moves) {
            clearTimeout(/** @type {?} */ (this.touchTimeout));
            this.dragDelayed = true;
        }
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.update();
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.update = /**
     * @return {?}
     */
    function () {
        this._parentDropzones = [this.droppableDirective.dropZone];
        this.drakesService.registerDraggable(this);
        this.updateElements();
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.drakesService.removeDraggable(this);
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.updateElements = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ nativeElement = this.el.nativeElement;
        var /** @type {?} */ handles = nativeElement.querySelectorAll('[ngxdraghandle]');
        this.handles = Array.from(handles).filter(function (h) { return findFirstDraggableParent(h) === nativeElement; });
        /**
         * @param {?} c
         * @return {?}
         */
        function findFirstDraggableParent(c) {
            while (c.parentNode) {
                c = c.parentNode;
                if (c.hasAttribute && c.hasAttribute('ngxdraggable')) {
                    return c;
                }
            }
        }
    };
    /**
     * @param {?=} source
     * @param {?=} handle
     * @param {?=} sibling
     * @return {?}
     */
    DraggableDirective.prototype.canMove = /**
     * @param {?=} source
     * @param {?=} handle
     * @param {?=} sibling
     * @return {?}
     */
    function (source, handle, sibling) {
        if (typeof this._moves === 'boolean')
            return this._moves;
        if (typeof this._moves === 'function')
            return this._moves(this.model, source, handle, sibling);
        return true;
    };
    /**
     * @param {?} source
     * @param {?} handle
     * @param {?} sibling
     * @return {?}
     */
    DraggableDirective.prototype.moves = /**
     * @param {?} source
     * @param {?} handle
     * @param {?} sibling
     * @return {?}
     */
    function (source, handle, sibling) {
        if (!this.canMove(source, handle, sibling))
            return false;
        return this.hasHandle ? this.handles.some(function (h) { return handelFor(handle, h); }) : true;
        /**
         * @param {?} c
         * @param {?} p
         * @return {?}
         */
        function handelFor(c, p) {
            if (c === p)
                return true;
            while ((c = c.parentNode) && c !== p)
                ; // tslint:disable-line
            return !!c;
        }
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        this.updateElements();
    };
    DraggableDirective.decorators = [
        { type: Directive, args: [{ selector: '[ngxDraggable]' },] },
    ];
    /** @nocollapse */
    DraggableDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: DrakeStoreService, },
        { type: DroppableDirective, },
    ]; };
    DraggableDirective.propDecorators = {
        "ngxDraggable": [{ type: Input },],
        "model": [{ type: Input },],
        "dropZones": [{ type: Input },],
        "_moves": [{ type: Input, args: ['moves',] },],
        "drag": [{ type: Output },],
        "onMove": [{ type: HostListener, args: ['touchmove', ['$event'],] },],
        "onDown": [{ type: HostListener, args: ['touchstart',] },],
        "onUp": [{ type: HostListener, args: ['touchend',] },],
    };
    return DraggableDirective;
}());
export { DraggableDirective };
function DraggableDirective_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    DraggableDirective.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    DraggableDirective.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    DraggableDirective.propDecorators;
    /** @type {?} */
    DraggableDirective.prototype.ngxDraggable;
    /** @type {?} */
    DraggableDirective.prototype.model;
    /** @type {?} */
    DraggableDirective.prototype._moves;
    /** @type {?} */
    DraggableDirective.prototype.handles;
    /** @type {?} */
    DraggableDirective.prototype.drag;
    /** @type {?} */
    DraggableDirective.prototype.dragDelay;
    /** @type {?} */
    DraggableDirective.prototype.dragDelayed;
    /** @type {?} */
    DraggableDirective.prototype.touchTimeout;
    /** @type {?} */
    DraggableDirective.prototype._dropZones;
    /** @type {?} */
    DraggableDirective.prototype._parentDropzones;
    /** @type {?} */
    DraggableDirective.prototype.el;
    /** @type {?} */
    DraggableDirective.prototype.drakesService;
    /** @type {?} */
    DraggableDirective.prototype.droppableDirective;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyYWdnYWJsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRuZC8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL25neC1kcmFnZ2FibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQXFCLE1BQU0sZUFBZSxDQUFDO0FBRXBILE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDOzs7Ozs7O0lBa0RsRSw0QkFDVSxJQUNBLGVBQ0E7UUFGQSxPQUFFLEdBQUYsRUFBRTtRQUNGLGtCQUFhLEdBQWIsYUFBYTtRQUNiLHVCQUFrQixHQUFsQixrQkFBa0I7c0JBakNrQyxJQUFJOzs7Ozs7OztRQVVsRSxlQUFpQixFQUFFLENBQUM7b0JBTWdCLElBQUksWUFBWSxFQUFPO1FBRTNELGlCQUFvQixHQUFHLENBQUM7UUFDeEIsbUJBQXVCLElBQUksQ0FBQztLQWV4QjswQkF6Q0EseUNBQVM7Ozs7O1lBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDOzs7Ozs7UUFFdkUsVUFBYyxHQUFRO1lBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO1NBQ3ZCOzs7O0lBY0Qsc0JBQUkseUNBQVM7Ozs7UUFBYjtZQUNFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1NBQzlCOzs7T0FBQTtJQVNELHNCQUFJLHVDQUFPOzs7O1FBQVg7WUFDRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDO1NBQzlCOzs7T0FBQTs7Ozs7SUFhRCxtQ0FBTTs7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QyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Ozs7OztRQUU1RSxTQUFTLFNBQVMsQ0FBQyxDQUFNLEVBQUUsQ0FBTTtZQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQ3pCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUFDLENBQUM7WUFDdEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ1o7S0FDRjs7OztJQUVELHNDQUFTOzs7SUFBVDtRQUNFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUN2Qjs7Z0JBNUhGLFNBQVMsU0FBQyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRTs7OztnQkFWckIsVUFBVTtnQkFHckIsaUJBQWlCO2dCQURqQixrQkFBa0I7OztpQ0FVeEIsS0FBSzswQkFDTCxLQUFLOzhCQUVMLEtBQUs7MkJBUUwsS0FBSyxTQUFDLE9BQU87eUJBZ0JiLE1BQU07MkJBcUJOLFlBQVksU0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUM7MkJBUXBDLFlBQVksU0FBQyxZQUFZO3lCQVN6QixZQUFZLFNBQUMsVUFBVTs7NkJBN0UxQjs7U0FXYSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEcm9wcGFibGVEaXJlY3RpdmUgfSBmcm9tICcuL25neC1kcm9wcGFibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IERyYWtlU3RvcmVTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvZHJha2Utc3RvcmUuc2VydmljZSc7XG5cbi8qKlxuICogQWRkcyBwcm9wZXJ0aWVzIGFuZCBldmVudHMgdG8gZHJhZ2dhYmxlIGVsZW1lbnRzXG4gKlxuICogQGV4cG9ydFxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbmd4RHJhZ2dhYmxlXScgfSlcbmV4cG9ydCBjbGFzcyBEcmFnZ2FibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIG5neERyYWdnYWJsZTogc3RyaW5nW107XG4gIEBJbnB1dCgpIG1vZGVsOiBhbnk7XG5cbiAgQElucHV0KClcbiAgZ2V0IGRyb3Bab25lcygpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9kcm9wWm9uZXMgfHwgdGhpcy5uZ3hEcmFnZ2FibGUgfHwgdGhpcy5fcGFyZW50RHJvcHpvbmVzO1xuICB9XG4gIHNldCBkcm9wWm9uZXModmFsOiBhbnkpIHtcbiAgICB0aGlzLl9kcm9wWm9uZXMgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoJ21vdmVzJykgX21vdmVzOiBib29sZWFuIHwgKCguLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9IHRydWU7XG5cbiAgLypcbiAgQ29udGVudENoaWxkcmVuIGRvZXNuJ3QgZ2V0IGNoaWxkcmVuIGNyZWF0ZWQgd2l0aCBOZ1RlbXBsYXRlT3V0bGV0XG4gIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xNDg0MlxuICBJbXBsZW1lbnRlZCB2aWEgdXBkYXRlRWxlbWVudHMgbWV0aG9kXG5cbiAgQENvbnRlbnRDaGlsZHJlbihEcmFnSGFuZGxlRGlyZWN0aXZlLCB7ZGVzY2VuZGFudHM6IHRydWV9KVxuICBoYW5kbGVzTGlzdDogUXVlcnlMaXN0PERyYWdIYW5kbGVEaXJlY3RpdmU+OyAqL1xuXG4gIGhhbmRsZXM6IGFueVtdID0gW107XG5cbiAgZ2V0IGhhc0hhbmRsZSgpIHtcbiAgICByZXR1cm4gISF0aGlzLmhhbmRsZXMubGVuZ3RoO1xuICB9XG5cbiAgQE91dHB1dCgpIGRyYWc6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgZHJhZ0RlbGF5OiBudW1iZXIgPSAyMDA7IC8vIG1pbGxpc2Vjb25kc1xuICBkcmFnRGVsYXllZDogYm9vbGVhbiA9IHRydWU7XG5cbiAgdG91Y2hUaW1lb3V0OiBhbnk7XG5cbiAgZ2V0IGVsZW1lbnQoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgX2Ryb3Bab25lczogc3RyaW5nW107XG4gIF9wYXJlbnREcm9wem9uZXM6IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBkcmFrZXNTZXJ2aWNlOiBEcmFrZVN0b3JlU2VydmljZSxcbiAgICBwcml2YXRlIGRyb3BwYWJsZURpcmVjdGl2ZTogRHJvcHBhYmxlRGlyZWN0aXZlXG4gICkge31cblxuICAvLyBGcm9tOiBodHRwczovL2dpdGh1Yi5jb20vYmV2YWNxdWEvZHJhZ3VsYS9pc3N1ZXMvMjg5I2lzc3VlY29tbWVudC0yNzcxNDMxNzJcbiAgQEhvc3RMaXN0ZW5lcigndG91Y2htb3ZlJywgWyckZXZlbnQnXSlcbiAgb25Nb3ZlKGU6IEV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLl9tb3ZlcyB8fCB0aGlzLmRyYWdEZWxheWVkKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG91Y2hUaW1lb3V0KTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd0b3VjaHN0YXJ0JylcbiAgb25Eb3duKCkge1xuICAgIGlmICh0aGlzLl9tb3Zlcykge1xuICAgICAgdGhpcy50b3VjaFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5kcmFnRGVsYXllZCA9IGZhbHNlO1xuICAgICAgfSwgdGhpcy5kcmFnRGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNoZW5kJylcbiAgb25VcCgpIHtcbiAgICBpZiAodGhpcy5fbW92ZXMpIHtcbiAgICAgIGNsZWFyVGltZW91dCg8bnVtYmVyPnRoaXMudG91Y2hUaW1lb3V0KTtcbiAgICAgIHRoaXMuZHJhZ0RlbGF5ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICB1cGRhdGUoKTogdm9pZCB7XG4gICAgdGhpcy5fcGFyZW50RHJvcHpvbmVzID0gW3RoaXMuZHJvcHBhYmxlRGlyZWN0aXZlLmRyb3Bab25lXTtcbiAgICB0aGlzLmRyYWtlc1NlcnZpY2UucmVnaXN0ZXJEcmFnZ2FibGUodGhpcyk7XG4gICAgdGhpcy51cGRhdGVFbGVtZW50cygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kcmFrZXNTZXJ2aWNlLnJlbW92ZURyYWdnYWJsZSh0aGlzKTtcbiAgfVxuXG4gIHVwZGF0ZUVsZW1lbnRzKCk6IHZvaWQge1xuICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgaGFuZGxlczogTm9kZUxpc3QgPSBuYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuZ3hkcmFnaGFuZGxlXScpO1xuICAgIHRoaXMuaGFuZGxlcyA9IEFycmF5LmZyb20oaGFuZGxlcykuZmlsdGVyKChoOiBhbnkpID0+IGZpbmRGaXJzdERyYWdnYWJsZVBhcmVudChoKSA9PT0gbmF0aXZlRWxlbWVudCk7XG5cbiAgICBmdW5jdGlvbiBmaW5kRmlyc3REcmFnZ2FibGVQYXJlbnQoYzogYW55KSB7XG4gICAgICB3aGlsZSAoYy5wYXJlbnROb2RlKSB7XG4gICAgICAgIGMgPSBjLnBhcmVudE5vZGU7XG4gICAgICAgIGlmIChjLmhhc0F0dHJpYnV0ZSAmJiBjLmhhc0F0dHJpYnV0ZSgnbmd4ZHJhZ2dhYmxlJykpIHtcbiAgICAgICAgICByZXR1cm4gYztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNhbk1vdmUoc291cmNlPzogYW55LCBoYW5kbGU/OiBhbnksIHNpYmxpbmc/OiBhbnkpOiBib29sZWFuIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX21vdmVzID09PSAnYm9vbGVhbicpIHJldHVybiB0aGlzLl9tb3ZlcztcbiAgICBpZiAodHlwZW9mIHRoaXMuX21vdmVzID09PSAnZnVuY3Rpb24nKSByZXR1cm4gdGhpcy5fbW92ZXModGhpcy5tb2RlbCwgc291cmNlLCBoYW5kbGUsIHNpYmxpbmcpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbW92ZXMoc291cmNlOiBhbnksIGhhbmRsZTogYW55LCBzaWJsaW5nOiBhbnkpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuY2FuTW92ZShzb3VyY2UsIGhhbmRsZSwgc2libGluZykpIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0aGlzLmhhc0hhbmRsZSA/IHRoaXMuaGFuZGxlcy5zb21lKGggPT4gaGFuZGVsRm9yKGhhbmRsZSwgaCkpIDogdHJ1ZTtcblxuICAgIGZ1bmN0aW9uIGhhbmRlbEZvcihjOiBhbnksIHA6IGFueSkge1xuICAgICAgaWYgKGMgPT09IHApIHJldHVybiB0cnVlO1xuICAgICAgd2hpbGUgKChjID0gYy5wYXJlbnROb2RlKSAmJiBjICE9PSBwKTsgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuICAgICAgcmV0dXJuICEhYztcbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGVFbGVtZW50cygpO1xuICB9XG59XG4iXX0=