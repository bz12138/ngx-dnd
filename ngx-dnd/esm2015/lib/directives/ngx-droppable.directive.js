/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, Input, Output, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { DrakeStoreService } from '../services/drake-store.service';
/** @type {?} */
let i = 10000;
/**
 * @return {?}
 */
function getNextId() {
    return i++;
}
/**
 * Makes the container droppable and children draggable.
 *
 * @export
 */
export class DroppableDirective {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} drakesService
     */
    constructor(el, renderer, drakesService) {
        this.el = el;
        this.renderer = renderer;
        this.drakesService = drakesService;
        this.copy = false;
        this.removeOnSpill = false;
        this.direction = 'vertical';
        this.drop = new EventEmitter();
        this.drag = new EventEmitter();
        this.over = new EventEmitter();
        this.out = new EventEmitter();
        this.remove = new EventEmitter();
        this.cancel = new EventEmitter();
    }
    /**
     * @return {?}
     */
    get container() {
        return this.el.nativeElement;
    }
    /**
     * @return {?}
     */
    get dropZone() {
        return this._dropZone || this.ngxDroppable || this.defaultZone;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set dropZone(val) {
        this._dropZone = val;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.defaultZone = `@@DefaultDropZone-${getNextId()}@@`;
        this.drakesService.register(this);
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.over.subscribe((/**
         * @return {?}
         */
        () => {
            this.renderer.addClass(this.container, 'gu-over');
        }));
        this.out.subscribe((/**
         * @return {?}
         */
        () => {
            this.renderer.removeClass(this.container, 'gu-over');
        }));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.drakesService.remove(this);
    }
}
DroppableDirective.decorators = [
    { type: Directive, args: [{ selector: '[ngxDroppable]' },] }
];
/** @nocollapse */
DroppableDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: DrakeStoreService }
];
DroppableDirective.propDecorators = {
    model: [{ type: Input }],
    copy: [{ type: Input }],
    removeOnSpill: [{ type: Input }],
    ngxDroppable: [{ type: Input }],
    direction: [{ type: Input }],
    drop: [{ type: Output }],
    drag: [{ type: Output }],
    over: [{ type: Output }],
    out: [{ type: Output }],
    remove: [{ type: Output }],
    cancel: [{ type: Output }],
    dropZone: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    DroppableDirective.prototype.model;
    /** @type {?} */
    DroppableDirective.prototype.copy;
    /** @type {?} */
    DroppableDirective.prototype.removeOnSpill;
    /** @type {?} */
    DroppableDirective.prototype.ngxDroppable;
    /** @type {?} */
    DroppableDirective.prototype.direction;
    /** @type {?} */
    DroppableDirective.prototype.drop;
    /** @type {?} */
    DroppableDirective.prototype.drag;
    /** @type {?} */
    DroppableDirective.prototype.over;
    /** @type {?} */
    DroppableDirective.prototype.out;
    /** @type {?} */
    DroppableDirective.prototype.remove;
    /** @type {?} */
    DroppableDirective.prototype.cancel;
    /** @type {?} */
    DroppableDirective.prototype.defaultZone;
    /** @type {?} */
    DroppableDirective.prototype._dropZone;
    /**
     * @type {?}
     * @private
     */
    DroppableDirective.prototype.el;
    /**
     * @type {?}
     * @private
     */
    DroppableDirective.prototype.renderer;
    /**
     * @type {?}
     * @private
     */
    DroppableDirective.prototype.drakesService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyb3BwYWJsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRuZC8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL25neC1kcm9wcGFibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBSU4sVUFBVSxFQUNWLFlBQVksRUFDWixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUNBQWlDLENBQUM7O0lBRWhFLENBQUMsR0FBRyxLQUFLOzs7O0FBQ2IsU0FBUyxTQUFTO0lBQ2hCLE9BQU8sQ0FBQyxFQUFFLENBQUM7QUFDYixDQUFDOzs7Ozs7QUFRRCxNQUFNLE9BQU8sa0JBQWtCOzs7Ozs7SUFrQzdCLFlBQW9CLEVBQWMsRUFBVSxRQUFtQixFQUFVLGFBQWdDO1FBQXJGLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQW1CO1FBaENoRyxTQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2Isa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFFdEIsY0FBUyxHQUF3QyxVQUFVLENBQUM7UUFFM0QsU0FBSSxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBRWxELFNBQUksR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUVsRCxTQUFJLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFFbEQsUUFBRyxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBRWpELFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUVwRCxXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7SUFpQjhDLENBQUM7Ozs7SUFmN0csSUFBSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztJQUMvQixDQUFDOzs7O0lBRUQsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUNqRSxDQUFDOzs7OztJQUNELElBQUksUUFBUSxDQUFDLEdBQVc7UUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7SUFDdkIsQ0FBQzs7OztJQU9ELFFBQVE7UUFDTixJQUFJLENBQUMsV0FBVyxHQUFHLHFCQUFxQixTQUFTLEVBQUUsSUFBSSxDQUFDO1FBQ3hELElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Ozs7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTOzs7UUFBQyxHQUFHLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNwRCxDQUFDLEVBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUzs7O1FBQUMsR0FBRyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7O0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7OztZQXJERixTQUFTLFNBQUMsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUU7Ozs7WUFqQnZDLFVBQVU7WUFFVixTQUFTO1lBR0YsaUJBQWlCOzs7b0JBY3ZCLEtBQUs7bUJBQ0wsS0FBSzs0QkFDTCxLQUFLOzJCQUNMLEtBQUs7d0JBQ0wsS0FBSzttQkFFTCxNQUFNO21CQUVOLE1BQU07bUJBRU4sTUFBTTtrQkFFTixNQUFNO3FCQUVOLE1BQU07cUJBRU4sTUFBTTt1QkFNTixLQUFLOzs7O0lBdEJOLG1DQUFvQjs7SUFDcEIsa0NBQXNCOztJQUN0QiwyQ0FBK0I7O0lBQy9CLDBDQUE4Qjs7SUFDOUIsdUNBQXFFOztJQUVyRSxrQ0FBNEQ7O0lBRTVELGtDQUE0RDs7SUFFNUQsa0NBQTREOztJQUU1RCxpQ0FBMkQ7O0lBRTNELG9DQUE4RDs7SUFFOUQsb0NBQThEOztJQWM5RCx5Q0FBb0I7O0lBQ3BCLHVDQUFrQjs7Ozs7SUFFTixnQ0FBc0I7Ozs7O0lBQUUsc0NBQTJCOzs7OztJQUFFLDJDQUF3QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgT25Jbml0LFxuICBPbkRlc3Ryb3ksXG4gIEFmdGVyVmlld0luaXQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgUmVuZGVyZXIyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEcmFrZVN0b3JlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2RyYWtlLXN0b3JlLnNlcnZpY2UnO1xuXG5sZXQgaSA9IDEwMDAwO1xuZnVuY3Rpb24gZ2V0TmV4dElkKCkge1xuICByZXR1cm4gaSsrO1xufVxuXG4vKipcbiAqIE1ha2VzIHRoZSBjb250YWluZXIgZHJvcHBhYmxlIGFuZCBjaGlsZHJlbiBkcmFnZ2FibGUuXG4gKlxuICogQGV4cG9ydFxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbmd4RHJvcHBhYmxlXScgfSlcbmV4cG9ydCBjbGFzcyBEcm9wcGFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgpIG1vZGVsOiBhbnk7XG4gIEBJbnB1dCgpIGNvcHkgPSBmYWxzZTtcbiAgQElucHV0KCkgcmVtb3ZlT25TcGlsbCA9IGZhbHNlO1xuICBASW5wdXQoKSBuZ3hEcm9wcGFibGU6IHN0cmluZztcbiAgQElucHV0KCkgZGlyZWN0aW9uOiAndmVydGljYWwnIHwgJ2hvcml6b250YWwnIHwgJ21peGVkJyA9ICd2ZXJ0aWNhbCc7XG5cbiAgQE91dHB1dCgpIGRyb3A6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIGRyYWc6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIG92ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIG91dDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgcmVtb3ZlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBjYW5jZWw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgZ2V0IGNvbnRhaW5lcigpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgZHJvcFpvbmUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcFpvbmUgfHwgdGhpcy5uZ3hEcm9wcGFibGUgfHwgdGhpcy5kZWZhdWx0Wm9uZTtcbiAgfVxuICBzZXQgZHJvcFpvbmUodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9kcm9wWm9uZSA9IHZhbDtcbiAgfVxuXG4gIGRlZmF1bHRab25lOiBzdHJpbmc7XG4gIF9kcm9wWm9uZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBkcmFrZXNTZXJ2aWNlOiBEcmFrZVN0b3JlU2VydmljZSkge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmRlZmF1bHRab25lID0gYEBARGVmYXVsdERyb3Bab25lLSR7Z2V0TmV4dElkKCl9QEBgO1xuICAgIHRoaXMuZHJha2VzU2VydmljZS5yZWdpc3Rlcih0aGlzKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLm92ZXIuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5jb250YWluZXIsICdndS1vdmVyJyk7XG4gICAgfSk7XG4gICAgdGhpcy5vdXQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5jb250YWluZXIsICdndS1vdmVyJyk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRyYWtlc1NlcnZpY2UucmVtb3ZlKHRoaXMpO1xuICB9XG59XG4iXX0=