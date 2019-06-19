/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { DroppableDirective } from './ngx-droppable.directive';
import { DrakeStoreService } from '../services/drake-store.service';
/**
 * Adds properties and events to draggable elements
 *
 * @export
 */
export class DraggableDirective {
    /**
     * @param {?} el
     * @param {?} drakesService
     * @param {?} droppableDirective
     */
    constructor(el, drakesService, droppableDirective) {
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
        // milliseconds
        this.dragDelayed = true;
    }
    /**
     * @return {?}
     */
    get dropZones() {
        return this._dropZones || this.ngxDraggable || this._parentDropzones;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set dropZones(val) {
        this._dropZones = val;
    }
    /**
     * @return {?}
     */
    get hasHandle() {
        return !!this.handles.length;
    }
    /**
     * @return {?}
     */
    get element() {
        return this.el.nativeElement;
    }
    // From: https://github.com/bevacqua/dragula/issues/289#issuecomment-277143172
    /**
     * @param {?} e
     * @return {?}
     */
    onMove(e) {
        if (!this._moves || this.dragDelayed) {
            e.stopPropagation();
            clearTimeout(this.touchTimeout);
        }
    }
    /**
     * @return {?}
     */
    onDown() {
        if (this._moves) {
            this.touchTimeout = setTimeout((/**
             * @return {?}
             */
            () => {
                this.dragDelayed = false;
            }), this.dragDelay);
        }
    }
    /**
     * @return {?}
     */
    onUp() {
        if (this._moves) {
            clearTimeout((/** @type {?} */ (this.touchTimeout)));
            this.dragDelayed = true;
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.update();
    }
    /**
     * @return {?}
     */
    update() {
        this._parentDropzones = [this.droppableDirective.dropZone];
        this.drakesService.registerDraggable(this);
        this.updateElements();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.drakesService.removeDraggable(this);
    }
    /**
     * @return {?}
     */
    updateElements() {
        /** @type {?} */
        const nativeElement = this.el.nativeElement;
        /** @type {?} */
        const handles = nativeElement.querySelectorAll('[ngxdraghandle]');
        this.handles = Array.from(handles).filter((/**
         * @param {?} h
         * @return {?}
         */
        (h) => findFirstDraggableParent(h) === nativeElement));
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
    }
    /**
     * @param {?=} source
     * @param {?=} handle
     * @param {?=} sibling
     * @return {?}
     */
    canMove(source, handle, sibling) {
        if (typeof this._moves === 'boolean')
            return this._moves;
        if (typeof this._moves === 'function')
            return this._moves(this.model, source, handle, sibling);
        return true;
    }
    /**
     * @param {?} source
     * @param {?} handle
     * @param {?} sibling
     * @return {?}
     */
    moves(source, handle, sibling) {
        if (!this.canMove(source, handle, sibling))
            return false;
        return this.hasHandle ? this.handles.some((/**
         * @param {?} h
         * @return {?}
         */
        h => handelFor(handle, h))) : true;
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
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        this.updateElements();
    }
}
DraggableDirective.decorators = [
    { type: Directive, args: [{ selector: '[ngxDraggable]' },] }
];
/** @nocollapse */
DraggableDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: DrakeStoreService },
    { type: DroppableDirective }
];
DraggableDirective.propDecorators = {
    ngxDraggable: [{ type: Input }],
    model: [{ type: Input }],
    dropZones: [{ type: Input }],
    _moves: [{ type: Input, args: ['moves',] }],
    drag: [{ type: Output }],
    onMove: [{ type: HostListener, args: ['touchmove', ['$event'],] }],
    onDown: [{ type: HostListener, args: ['touchstart',] }],
    onUp: [{ type: HostListener, args: ['touchend',] }]
};
if (false) {
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
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.el;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.drakesService;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.droppableDirective;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRyYWdnYWJsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRuZC8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL25neC1kcmFnZ2FibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQXFCLE1BQU0sZUFBZSxDQUFDO0FBRXBILE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDOzs7Ozs7QUFRcEUsTUFBTSxPQUFPLGtCQUFrQjs7Ozs7O0lBMEM3QixZQUNVLEVBQWMsRUFDZCxhQUFnQyxFQUNoQyxrQkFBc0M7UUFGdEMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGtCQUFhLEdBQWIsYUFBYSxDQUFtQjtRQUNoQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBakNoQyxXQUFNLEdBQXdDLElBQUksQ0FBQzs7Ozs7Ozs7UUFVbkUsWUFBTyxHQUFVLEVBQUUsQ0FBQztRQU1WLFNBQUksR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUU1RCxjQUFTLEdBQVcsR0FBRyxDQUFDLENBQUMsZUFBZTs7UUFDeEMsZ0JBQVcsR0FBWSxJQUFJLENBQUM7SUFlekIsQ0FBQzs7OztJQTFDSixJQUNJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDdkUsQ0FBQzs7Ozs7SUFDRCxJQUFJLFNBQVMsQ0FBQyxHQUFRO1FBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQ3hCLENBQUM7Ozs7SUFjRCxJQUFJLFNBQVM7UUFDWCxPQUFPLENBQUMsQ0FBQyxJ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dFJlZiwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IERyb3BwYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4vbmd4LWRyb3BwYWJsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRHJha2VTdG9yZVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9kcmFrZS1zdG9yZS5zZXJ2aWNlJztcblxuLyoqXG4gKiBBZGRzIHByb3BlcnRpZXMgYW5kIGV2ZW50cyB0byBkcmFnZ2FibGUgZWxlbWVudHNcbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZ3hEcmFnZ2FibGVdJyB9KVxuZXhwb3J0IGNsYXNzIERyYWdnYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCkgbmd4RHJhZ2dhYmxlOiBzdHJpbmdbXTtcbiAgQElucHV0KCkgbW9kZWw6IGFueTtcblxuICBASW5wdXQoKVxuICBnZXQgZHJvcFpvbmVzKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lcyB8fCB0aGlzLm5neERyYWdnYWJsZSB8fCB0aGlzLl9wYXJlbnREcm9wem9uZXM7XG4gIH1cbiAgc2V0IGRyb3Bab25lcyh2YWw6IGFueSkge1xuICAgIHRoaXMuX2Ryb3Bab25lcyA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgnbW92ZXMnKSBfbW92ZXM6IGJvb2xlYW4gfCAoKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0gdHJ1ZTtcblxuICAvKlxuICBDb250ZW50Q2hpbGRyZW4gZG9lc24ndCBnZXQgY2hpbGRyZW4gY3JlYXRlZCB3aXRoIE5nVGVtcGxhdGVPdXRsZXRcbiAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE0ODQyXG4gIEltcGxlbWVudGVkIHZpYSB1cGRhdGVFbGVtZW50cyBtZXRob2RcblxuICBAQ29udGVudENoaWxkcmVuKERyYWdIYW5kbGVEaXJlY3RpdmUsIHtkZXNjZW5kYW50czogdHJ1ZX0pXG4gIGhhbmRsZXNMaXN0OiBRdWVyeUxpc3Q8RHJhZ0hhbmRsZURpcmVjdGl2ZT47ICovXG5cbiAgaGFuZGxlczogYW55W10gPSBbXTtcblxuICBnZXQgaGFzSGFuZGxlKCkge1xuICAgIHJldHVybiAhIXRoaXMuaGFuZGxlcy5sZW5ndGg7XG4gIH1cblxuICBAT3V0cHV0KCkgZHJhZzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBkcmFnRGVsYXk6IG51bWJlciA9IDIwMDsgLy8gbWlsbGlzZWNvbmRzXG4gIGRyYWdEZWxheWVkOiBib29sZWFuID0gdHJ1ZTtcblxuICB0b3VjaFRpbWVvdXQ6IGFueTtcblxuICBnZXQgZWxlbWVudCgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBfZHJvcFpvbmVzOiBzdHJpbmdbXTtcbiAgX3BhcmVudERyb3B6b25lczogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIGRyYWtlc1NlcnZpY2U6IERyYWtlU3RvcmVTZXJ2aWNlLFxuICAgIHByaXZhdGUgZHJvcHBhYmxlRGlyZWN0aXZlOiBEcm9wcGFibGVEaXJlY3RpdmVcbiAgKSB7fVxuXG4gIC8vIEZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9iZXZhY3F1YS9kcmFndWxhL2lzc3Vlcy8yODkjaXNzdWVjb21tZW50LTI3NzE0MzE3MlxuICBASG9zdExpc3RlbmVyKCd0b3VjaG1vdmUnLCBbJyRldmVudCddKVxuICBvbk1vdmUoZTogRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuX21vdmVzIHx8IHRoaXMuZHJhZ0RlbGF5ZWQpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50b3VjaFRpbWVvdXQpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNoc3RhcnQnKVxuICBvbkRvd24oKSB7XG4gICAgaWYgKHRoaXMuX21vdmVzKSB7XG4gICAgICB0aGlzLnRvdWNoVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmRyYWdEZWxheWVkID0gZmFsc2U7XG4gICAgICB9LCB0aGlzLmRyYWdEZWxheSk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigndG91Y2hlbmQnKVxuICBvblVwKCkge1xuICAgIGlmICh0aGlzLl9tb3Zlcykge1xuICAgICAgY2xlYXJUaW1lb3V0KDxudW1iZXI+dGhpcy50b3VjaFRpbWVvdXQpO1xuICAgICAgdGhpcy5kcmFnRGVsYXllZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9wYXJlbnREcm9wem9uZXMgPSBbdGhpcy5kcm9wcGFibGVEaXJlY3RpdmUuZHJvcFpvbmVdO1xuICAgIHRoaXMuZHJha2VzU2VydmljZS5yZWdpc3RlckRyYWdnYWJsZSh0aGlzKTtcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRyYWtlc1NlcnZpY2UucmVtb3ZlRHJhZ2dhYmxlKHRoaXMpO1xuICB9XG5cbiAgdXBkYXRlRWxlbWVudHMoKTogdm9pZCB7XG4gICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBoYW5kbGVzOiBOb2RlTGlzdCA9IG5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW25neGRyYWdoYW5kbGVdJyk7XG4gICAgdGhpcy5oYW5kbGVzID0gQXJyYXkuZnJvbShoYW5kbGVzKS5maWx0ZXIoKGg6IGFueSkgPT4gZmluZEZpcnN0RHJhZ2dhYmxlUGFyZW50KGgpID09PSBuYXRpdmVFbGVtZW50KTtcblxuICAgIGZ1bmN0aW9uIGZpbmRGaXJzdERyYWdnYWJsZVBhcmVudChjOiBhbnkpIHtcbiAgICAgIHdoaWxlIChjLnBhcmVudE5vZGUpIHtcbiAgICAgICAgYyA9IGMucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKGMuaGFzQXR0cmlidXRlICYmIGMuaGFzQXR0cmlidXRlKCduZ3hkcmFnZ2FibGUnKSkge1xuICAgICAgICAgIHJldHVybiBjO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2FuTW92ZShzb3VyY2U/OiBhbnksIGhhbmRsZT86IGFueSwgc2libGluZz86IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmICh0eXBlb2YgdGhpcy5fbW92ZXMgPT09ICdib29sZWFuJykgcmV0dXJuIHRoaXMuX21vdmVzO1xuICAgIGlmICh0eXBlb2YgdGhpcy5fbW92ZXMgPT09ICdmdW5jdGlvbicpIHJldHVybiB0aGlzLl9tb3Zlcyh0aGlzLm1vZGVsLCBzb3VyY2UsIGhhbmRsZSwgc2libGluZyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBtb3Zlcyhzb3VyY2U6IGFueSwgaGFuZGxlOiBhbnksIHNpYmxpbmc6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5jYW5Nb3ZlKHNvdXJjZSwgaGFuZGxlLCBzaWJsaW5nKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIHRoaXMuaGFzSGFuZGxlID8gdGhpcy5oYW5kbGVzLnNvbWUoaCA9PiBoYW5kZWxGb3IoaGFuZGxlLCBoKSkgOiB0cnVlO1xuXG4gICAgZnVuY3Rpb24gaGFuZGVsRm9yKGM6IGFueSwgcDogYW55KSB7XG4gICAgICBpZiAoYyA9PT0gcCkgcmV0dXJuIHRydWU7XG4gICAgICB3aGlsZSAoKGMgPSBjLnBhcmVudE5vZGUpICYmIGMgIT09IHApOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lXG4gICAgICByZXR1cm4gISFjO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzKCk7XG4gIH1cbn1cbiJdfQ==