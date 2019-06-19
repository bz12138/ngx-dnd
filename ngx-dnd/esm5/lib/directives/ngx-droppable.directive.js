/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, Input, Output, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { DrakeStoreService } from '../services/drake-store.service';
/** @type {?} */
var i = 10000;
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
var DroppableDirective = /** @class */ (function () {
    function DroppableDirective(el, renderer, drakesService) {
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
    Object.defineProperty(DroppableDirective.prototype, "container", {
        get: /**
         * @return {?}
         */
        function () {
            return this.el.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroppableDirective.prototype, "dropZone", {
        get: /**
         * @return {?}
         */
        function () {
            return this._dropZone || this.ngxDroppable || this.defaultZone;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._dropZone = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    DroppableDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.defaultZone = "@@DefaultDropZone-" + getNextId() + "@@";
        this.drakesService.register(this);
    };
    /**
     * @return {?}
     */
    DroppableDirective.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.over.subscribe((/**
         * @return {?}
         */
        function () {
            _this.renderer.addClass(_this.container, 'gu-over');
        }));
        this.out.subscribe((/**
         * @return {?}
         */
        function () {
            _this.renderer.removeClass(_this.container, 'gu-over');
        }));
    };
    /**
     * @return {?}
     */
    DroppableDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.drakesService.remove(this);
    };
    DroppableDirective.decorators = [
        { type: Directive, args: [{ selector: '[ngxDroppable]' },] }
    ];
    /** @nocollapse */
    DroppableDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: DrakeStoreService }
    ]; };
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
    return DroppableDirective;
}());
export { DroppableDirective };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyb3BwYWJsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRuZC8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL25neC1kcm9wcGFibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBSU4sVUFBVSxFQUNWLFlBQVksRUFDWixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUNBQWlDLENBQUM7O0lBRWhFLENBQUMsR0FBRyxLQUFLOzs7O0FBQ2IsU0FBUyxTQUFTO0lBQ2hCLE9BQU8sQ0FBQyxFQUFFLENBQUM7QUFDYixDQUFDOzs7Ozs7QUFPRDtJQW1DRSw0QkFBb0IsRUFBYyxFQUFVLFFBQW1CLEVBQVUsYUFBZ0M7UUFBckYsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBbUI7UUFoQ2hHLFNBQUksR0FBRyxLQUFLLENBQUM7UUFDYixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUV0QixjQUFTLEdBQXdDLFVBQVUsQ0FBQztRQUUzRCxTQUFJLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFFbEQsU0FBSSxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBRWxELFNBQUksR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUVsRCxRQUFHLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFFakQsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBRXBELFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztJQWlCOEMsQ0FBQztJQWY3RyxzQkFBSSx5Q0FBUzs7OztRQUFiO1lBQ0UsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztRQUMvQixDQUFDOzs7T0FBQTtJQUVELHNCQUNJLHdDQUFROzs7O1FBRFo7WUFFRSxPQUFPLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ2pFLENBQUM7Ozs7O1FBQ0QsVUFBYSxHQUFXO1lBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3ZCLENBQUM7OztPQUhBOzs7O0lBVUQscUNBQVE7OztJQUFSO1FBQ0UsSUFBSSxDQUFDLFdBQVcsR0FBRyx1QkFBcUIsU0FBUyxFQUFFLE9BQUksQ0FBQztRQUN4RCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDOzs7O0lBRUQsNENBQWU7OztJQUFmO1FBQUEsaUJBT0M7UUFOQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7OztRQUFDO1lBQ2xCLEtBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxFQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVM7OztRQUFDO1lBQ2pCLEtBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7O0lBRUQsd0NBQVc7OztJQUFYO1FBQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7Z0JBckRGLFNBQVMsU0FBQyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRTs7OztnQkFqQnZDLFVBQVU7Z0JBRVYsU0FBUztnQkFHRixpQkFBaUI7Ozt3QkFjdkIsS0FBSzt1QkFDTCxLQUFLO2dDQUNMLEtBQUs7K0JBQ0wsS0FBSzs0QkFDTCxLQUFLO3VCQUVMLE1BQU07dUJBRU4sTUFBTTt1QkFFTixNQUFNO3NCQUVOLE1BQU07eUJBRU4sTUFBTTt5QkFFTixNQUFNOzJCQU1OLEtBQUs7O0lBOEJSLHlCQUFDO0NBQUEsQUF0REQsSUFzREM7U0FyRFksa0JBQWtCOzs7SUFDN0IsbUNBQW9COztJQUNwQixrQ0FBc0I7O0lBQ3RCLDJDQUErQjs7SUFDL0IsMENBQThCOztJQUM5Qix1Q0FBcUU7O0lBRXJFLGtDQUE0RDs7SUFFNUQsa0NBQTREOztJQUU1RCxrQ0FBNEQ7O0lBRTVELGlDQUEyRDs7SUFFM0Qsb0NBQThEOztJQUU5RCxvQ0FBOEQ7O0lBYzlELHlDQUFvQjs7SUFDcEIsdUNBQWtCOzs7OztJQUVOLGdDQUFzQjs7Ozs7SUFBRSxzQ0FBMkI7Ozs7O0lBQUUsMkNBQXdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBSZW5kZXJlcjJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IERyYWtlU3RvcmVTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvZHJha2Utc3RvcmUuc2VydmljZSc7XG5cbmxldCBpID0gMTAwMDA7XG5mdW5jdGlvbiBnZXROZXh0SWQoKSB7XG4gIHJldHVybiBpKys7XG59XG5cbi8qKlxuICogTWFrZXMgdGhlIGNvbnRhaW5lciBkcm9wcGFibGUgYW5kIGNoaWxkcmVuIGRyYWdnYWJsZS5cbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZ3hEcm9wcGFibGVdJyB9KVxuZXhwb3J0IGNsYXNzIERyb3BwYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgbW9kZWw6IGFueTtcbiAgQElucHV0KCkgY29weSA9IGZhbHNlO1xuICBASW5wdXQoKSByZW1vdmVPblNwaWxsID0gZmFsc2U7XG4gIEBJbnB1dCgpIG5neERyb3BwYWJsZTogc3RyaW5nO1xuICBASW5wdXQoKSBkaXJlY3Rpb246ICd2ZXJ0aWNhbCcgfCAnaG9yaXpvbnRhbCcgfCAnbWl4ZWQnID0gJ3ZlcnRpY2FsJztcblxuICBAT3V0cHV0KCkgZHJvcDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgZHJhZzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgb3ZlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgb3V0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSByZW1vdmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIGNhbmNlbDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBnZXQgY29udGFpbmVyKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wWm9uZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9kcm9wWm9uZSB8fCB0aGlzLm5neERyb3BwYWJsZSB8fCB0aGlzLmRlZmF1bHRab25lO1xuICB9XG4gIHNldCBkcm9wWm9uZSh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX2Ryb3Bab25lID0gdmFsO1xuICB9XG5cbiAgZGVmYXVsdFpvbmU6IHN0cmluZztcbiAgX2Ryb3Bab25lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIGRyYWtlc1NlcnZpY2U6IERyYWtlU3RvcmVTZXJ2aWNlKSB7fVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuZGVmYXVsdFpvbmUgPSBgQEBEZWZhdWx0RHJvcFpvbmUtJHtnZXROZXh0SWQoKX1AQGA7XG4gICAgdGhpcy5kcmFrZXNTZXJ2aWNlLnJlZ2lzdGVyKHRoaXMpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMub3Zlci5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmNvbnRhaW5lciwgJ2d1LW92ZXInKTtcbiAgICB9KTtcbiAgICB0aGlzLm91dC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmNvbnRhaW5lciwgJ2d1LW92ZXInKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZHJha2VzU2VydmljZS5yZW1vdmUodGhpcyk7XG4gIH1cbn1cbiJdfQ==