/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, ViewEncapsulation, ContentChild, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { DroppableDirective } from '../../directives/ngx-droppable.directive';
/** @type {?} */
let i = 0;
/**
 * @return {?}
 */
function getNextId() {
    return i++;
}
/**
 * Component that allows nested ngxDroppable and ngxDraggables
 *
 * @export
 */
export class ContainerComponent {
    constructor() {
        this.copy = false;
        this.removeOnSpill = false;
        this.dropZone = `@@DefaultDropZone-${getNextId()}@@`;
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
    get dropZones() {
        return this._dropZones || this._defaultZones;
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
    ngOnInit() {
        this._defaultZones = [this.dropZone];
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.droppable.drag.subscribe((/**
         * @param {?} v
         * @return {?}
         */
        (v) => this.drag.emit(v)));
        this.droppable.drop.subscribe((/**
         * @param {?} v
         * @return {?}
         */
        (v) => this.drop.emit(v)));
        this.droppable.over.subscribe((/**
         * @param {?} v
         * @return {?}
         */
        (v) => this.over.emit(v)));
        this.droppable.out.subscribe((/**
         * @param {?} v
         * @return {?}
         */
        (v) => this.out.emit(v)));
        this.droppable.remove.subscribe((/**
         * @param {?} v
         * @return {?}
         */
        (v) => this.remove.emit(v)));
        this.droppable.cancel.subscribe((/**
         * @param {?} v
         * @return {?}
         */
        (v) => this.cancel.emit(v)));
    }
}
ContainerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-dnd-container',
                template: "<div\n  ngxDroppable\n  [dropZone]=\"dropZone\"\n  [model]=\"model\"\n  [copy]=\"copy\"\n  [ngClass]=\"{ 'gu-empty': !model?.length }\"\n  [removeOnSpill]=\"removeOnSpill\"\n  class='ngx-dnd-container'>\n  <ng-container *ngIf=\"model\">\n    <ng-container *ngFor=\"let item of model\">\n      <ngx-dnd-item\n        ngxDraggable\n        [model]=\"item\"\n        [dropZone]=\"dropZone\"\n        [dropZones]=\"dropZones\"\n        [copy]=\"copy\"\n        [moves]=\"moves\"\n        [removeOnSpill]=\"removeOnSpill\"\n        [droppableItemClass]=\"droppableItemClass\"\n        [droppableItemStyle]=\"droppableItemStyle\">\n      </ngx-dnd-item>\n    </ng-container>\n  </ng-container>\n  <ng-content *ngIf=\"!model\"></ng-content>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".ngx-dnd-container{background-color:rgba(255,255,255,.2);border:2px solid red;margin:10px;padding:10px}.ngx-dnd-container.gu-empty{border:2px dotted red}.ngx-dnd-container:nth-child(odd){background-color:rgba(0,0,0,.2)}.ngx-dnd-container .ex-moved{background-color:#e74c3c}.ngx-dnd-container .ex-over{background-color:rgba(255,255,255,.3)}.ngx-dnd-container .handle{padding:0 5px;margin-right:5px;background-color:rgba(0,0,0,.4);cursor:move}.no-select{-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.clearfix::after{content:\" \";display:block;height:0;clear:both}"]
            }] }
];
ContainerComponent.propDecorators = {
    model: [{ type: Input }],
    copy: [{ type: Input }],
    removeOnSpill: [{ type: Input }],
    droppableItemClass: [{ type: Input }],
    droppableItemStyle: [{ type: Input }],
    dropZone: [{ type: Input }],
    dropZones: [{ type: Input }],
    moves: [{ type: Input }],
    template: [{ type: Input }, { type: ContentChild, args: [TemplateRef, { static: true },] }],
    droppable: [{ type: Input }, { type: ViewChild, args: [DroppableDirective, { static: true },] }],
    drop: [{ type: Output }],
    drag: [{ type: Output }],
    over: [{ type: Output }],
    out: [{ type: Output }],
    remove: [{ type: Output }],
    cancel: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    ContainerComponent.prototype.model;
    /** @type {?} */
    ContainerComponent.prototype.copy;
    /** @type {?} */
    ContainerComponent.prototype.removeOnSpill;
    /** @type {?} */
    ContainerComponent.prototype.droppableItemClass;
    /** @type {?} */
    ContainerComponent.prototype.droppableItemStyle;
    /** @type {?} */
    ContainerComponent.prototype.dropZone;
    /** @type {?} */
    ContainerComponent.prototype.moves;
    /** @type {?} */
    ContainerComponent.prototype.template;
    /** @type {?} */
    ContainerComponent.prototype.droppable;
    /** @type {?} */
    ContainerComponent.prototype.drop;
    /** @type {?} */
    ContainerComponent.prototype.drag;
    /** @type {?} */
    ContainerComponent.prototype.over;
    /** @type {?} */
    ContainerComponent.prototype.out;
    /** @type {?} */
    ContainerComponent.prototype.remove;
    /** @type {?} */
    ContainerComponent.prototype.cancel;
    /** @type {?} */
    ContainerComponent.prototype._dropZones;
    /** @type {?} */
    ContainerComponent.prototype._defaultZones;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsWUFBWSxFQUNaLFdBQVcsRUFDWCxTQUFTLEVBQ1QsWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDOztJQUUxRSxDQUFDLEdBQUcsQ0FBQzs7OztBQUNULFNBQVMsU0FBUztJQUNoQixPQUFPLENBQUMsRUFBRSxDQUFDO0FBQ2IsQ0FBQzs7Ozs7O0FBYUQsTUFBTSxPQUFPLGtCQUFrQjtJQU4vQjtRQVFXLFNBQUksR0FBRyxLQUFLLENBQUM7UUFDYixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUt0QixhQUFRLEdBQUcscUJBQXFCLFNBQVMsRUFBRSxJQUFJLENBQUM7UUF1Qi9DLFNBQUksR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUVsRCxTQUFJLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFFbEQsU0FBSSxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBRWxELFFBQUcsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUVqRCxXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFFcEQsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO0lBaUJoRSxDQUFDOzs7O0lBaERDLElBQ0ksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQy9DLENBQUM7Ozs7O0lBQ0QsSUFBSSxTQUFTLENBQUMsR0FBRztRQUNmLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQ3hCLENBQUM7Ozs7SUE4QkQsUUFBUTtRQUNOLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7OztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTOzs7O1FBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUzs7OztRQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVM7Ozs7UUFBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTOzs7O1FBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUzs7OztRQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVM7Ozs7UUFBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQztJQUNuRSxDQUFDOzs7WUEvREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLG12QkFBeUM7Z0JBRXpDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN0Qzs7O29CQUVFLEtBQUs7bUJBQ0wsS0FBSzs0QkFDTCxLQUFLO2lDQUNMLEtBQUs7aUNBQ0wsS0FBSzt1QkFHTCxLQUFLO3dCQUVMLEtBQUs7b0JBUUwsS0FBSzt1QkFLTCxLQUFLLFlBQ0wsWUFBWSxTQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7d0JBRzFDLEtBQUssWUFDTCxTQUFTLFNBQUMsa0JBQWtCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO21CQUc5QyxNQUFNO21CQUVOLE1BQU07bUJBRU4sTUFBTTtrQkFFTixNQUFNO3FCQUVOLE1BQU07cUJBRU4sTUFBTTs7OztJQXhDUCxtQ0FBb0I7O0lBQ3BCLGtDQUFzQjs7SUFDdEIsMkNBQStCOztJQUMvQixnREFBd0Q7O0lBQ3hELGdEQUF3RDs7SUFHeEQsc0NBQXlEOztJQVV6RCxtQ0FBZ0Y7O0lBS2hGLHNDQUUyQjs7SUFFM0IsdUNBRWU7O0lBRWYsa0NBQTREOztJQUU1RCxrQ0FBNEQ7O0lBRTVELGtDQUE0RDs7SUFFNUQsaUNBQTJEOztJQUUzRCxvQ0FBOEQ7O0lBRTlELG9DQUE4RDs7SUFFOUQsd0NBQXFCOztJQUNyQiwyQ0FBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENvbnRlbnRDaGlsZCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgRXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEcm9wcGFibGVEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL25neC1kcm9wcGFibGUuZGlyZWN0aXZlJztcblxubGV0IGkgPSAwO1xuZnVuY3Rpb24gZ2V0TmV4dElkKCkge1xuICByZXR1cm4gaSsrO1xufVxuXG4vKipcbiAqIENvbXBvbmVudCB0aGF0IGFsbG93cyBuZXN0ZWQgbmd4RHJvcHBhYmxlIGFuZCBuZ3hEcmFnZ2FibGVzXG4gKlxuICogQGV4cG9ydFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZG5kLWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb250YWluZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jb250YWluZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBDb250YWluZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBtb2RlbDogYW55O1xuICBASW5wdXQoKSBjb3B5ID0gZmFsc2U7XG4gIEBJbnB1dCgpIHJlbW92ZU9uU3BpbGwgPSBmYWxzZTtcbiAgQElucHV0KCkgZHJvcHBhYmxlSXRlbUNsYXNzOiBzdHJpbmcgfCAoKG86IGFueSkgPT4gYW55KTtcbiAgQElucHV0KCkgZHJvcHBhYmxlSXRlbVN0eWxlOiBzdHJpbmcgfCAoKG86IGFueSkgPT4gYW55KTtcblxuXG4gIEBJbnB1dCgpIGRyb3Bab25lID0gYEBARGVmYXVsdERyb3Bab25lLSR7Z2V0TmV4dElkKCl9QEBgO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wWm9uZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lcyB8fCB0aGlzLl9kZWZhdWx0Wm9uZXM7XG4gIH1cbiAgc2V0IGRyb3Bab25lcyh2YWwpIHtcbiAgICB0aGlzLl9kcm9wWm9uZXMgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKSBtb3ZlczogKG1vZGVsOiBhbnksIHNvdXJjZTogYW55LCBoYW5kbGU6IGFueSwgc2libGluZzogYW55KSA9PiBib29sZWFuO1xuXG4gIC8vIEBJbnB1dCgpIGNsYXNzZXM6IGFueSA9IHt9O1xuICAvLyBASW5wdXQoKSBkcmFndWxhT3B0aW9uczogYW55O1xuXG4gIEBJbnB1dCgpXG4gIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYsIHsgc3RhdGljOiB0cnVlIH0pXG4gIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpXG4gIEBWaWV3Q2hpbGQoRHJvcHBhYmxlRGlyZWN0aXZlLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICBkcm9wcGFibGU6IGFueTtcblxuICBAT3V0cHV0KCkgZHJvcDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgZHJhZzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgb3ZlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgb3V0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSByZW1vdmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIGNhbmNlbDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBfZHJvcFpvbmVzOiBzdHJpbmdbXTtcbiAgX2RlZmF1bHRab25lczogc3RyaW5nW107XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fZGVmYXVsdFpvbmVzID0gW3RoaXMuZHJvcFpvbmVdO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZHJvcHBhYmxlLmRyYWcuc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMuZHJhZy5lbWl0KHYpKTtcbiAgICB0aGlzLmRyb3BwYWJsZS5kcm9wLnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLmRyb3AuZW1pdCh2KSk7XG4gICAgdGhpcy5kcm9wcGFibGUub3Zlci5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5vdmVyLmVtaXQodikpO1xuICAgIHRoaXMuZHJvcHBhYmxlLm91dC5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5vdXQuZW1pdCh2KSk7XG4gICAgdGhpcy5kcm9wcGFibGUucmVtb3ZlLnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLnJlbW92ZS5lbWl0KHYpKTtcbiAgICB0aGlzLmRyb3BwYWJsZS5jYW5jZWwuc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMuY2FuY2VsLmVtaXQodikpO1xuICB9XG59XG4iXX0=