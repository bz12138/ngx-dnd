/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, ViewEncapsulation, ContentChild, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { DroppableDirective } from '../../directives/ngx-droppable.directive';
/** @type {?} */
var i = 0;
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
var ContainerComponent = /** @class */ (function () {
    function ContainerComponent() {
        this.copy = false;
        this.removeOnSpill = false;
        this.dropZone = "@@DefaultDropZone-" + getNextId() + "@@";
        this.drop = new EventEmitter();
        this.drag = new EventEmitter();
        this.over = new EventEmitter();
        this.out = new EventEmitter();
        this.remove = new EventEmitter();
        this.cancel = new EventEmitter();
    }
    Object.defineProperty(ContainerComponent.prototype, "dropZones", {
        get: /**
         * @return {?}
         */
        function () {
            return this._dropZones || this._defaultZones;
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
    /**
     * @return {?}
     */
    ContainerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._defaultZones = [this.dropZone];
    };
    /**
     * @return {?}
     */
    ContainerComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.droppable.drag.subscribe((/**
         * @param {?} v
         * @return {?}
         */
        function (v) { return _this.drag.emit(v); }));
        this.droppable.drop.subscribe((/**
         * @param {?} v
         * @return {?}
         */
        function (v) { return _this.drop.emit(v); }));
        this.droppable.over.subscribe((/**
         * @param {?} v
         * @return {?}
         */
        function (v) { return _this.over.emit(v); }));
        this.droppable.out.subscribe((/**
         * @param {?} v
         * @return {?}
         */
        function (v) { return _this.out.emit(v); }));
        this.droppable.remove.subscribe((/**
         * @param {?} v
         * @return {?}
         */
        function (v) { return _this.remove.emit(v); }));
        this.droppable.cancel.subscribe((/**
         * @param {?} v
         * @return {?}
         */
        function (v) { return _this.cancel.emit(v); }));
    };
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
    return ContainerComponent;
}());
export { ContainerComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsWUFBWSxFQUNaLFdBQVcsRUFDWCxTQUFTLEVBQ1QsWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDOztJQUUxRSxDQUFDLEdBQUcsQ0FBQzs7OztBQUNULFNBQVMsU0FBUztJQUNoQixPQUFPLENBQUMsRUFBRSxDQUFDO0FBQ2IsQ0FBQzs7Ozs7O0FBT0Q7SUFBQTtRQVFXLFNBQUksR0FBRyxLQUFLLENBQUM7UUFDYixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUt0QixhQUFRLEdBQUcsdUJBQXFCLFNBQVMsRUFBRSxPQUFJLENBQUM7UUF1Qi9DLFNBQUksR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUVsRCxTQUFJLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFFbEQsU0FBSSxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBRWxELFFBQUcsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUVqRCxXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFFcEQsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO0lBaUJoRSxDQUFDO0lBaERDLHNCQUNJLHlDQUFTOzs7O1FBRGI7WUFFRSxPQUFPLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUMvQyxDQUFDOzs7OztRQUNELFVBQWMsR0FBRztZQUNmLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLENBQUM7OztPQUhBOzs7O0lBaUNELHFDQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7OztJQUVELDRDQUFlOzs7SUFBZjtRQUFBLGlCQU9DO1FBTkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUzs7OztRQUFDLFVBQUMsQ0FBTSxJQUFLLE9BQUEsS0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQWpCLENBQWlCLEVBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTOzs7O1FBQUMsVUFBQyxDQUFNLElBQUssT0FBQSxLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBakIsQ0FBaUIsRUFBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVM7Ozs7UUFBQyxVQUFDLENBQU0sSUFBSyxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFqQixDQUFpQixFQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUzs7OztRQUFDLFVBQUMsQ0FBTSxJQUFLLE9BQUEsS0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQWhCLENBQWdCLEVBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTOzs7O1FBQUMsVUFBQyxDQUFNLElBQUssT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBbkIsQ0FBbUIsRUFBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVM7Ozs7UUFBQyxVQUFDLENBQU0sSUFBSyxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFuQixDQUFtQixFQUFDLENBQUM7SUFDbkUsQ0FBQzs7Z0JBL0RGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixtdkJBQXlDO29CQUV6QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7aUJBQ3RDOzs7d0JBRUUsS0FBSzt1QkFDTCxLQUFLO2dDQUNMLEtBQUs7cUNBQ0wsS0FBSztxQ0FDTCxLQUFLOzJCQUdMLEtBQUs7NEJBRUwsS0FBSzt3QkFRTCxLQUFLOzJCQUtMLEtBQUssWUFDTCxZQUFZLFNBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs0QkFHMUMsS0FBSyxZQUNMLFNBQVMsU0FBQyxrQkFBa0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7dUJBRzlDLE1BQU07dUJBRU4sTUFBTTt1QkFFTixNQUFNO3NCQUVOLE1BQU07eUJBRU4sTUFBTTt5QkFFTixNQUFNOztJQWlCVCx5QkFBQztDQUFBLEFBaEVELElBZ0VDO1NBMURZLGtCQUFrQjs7O0lBQzdCLG1DQUFvQjs7SUFDcEIsa0NBQXNCOztJQUN0QiwyQ0FBK0I7O0lBQy9CLGdEQUF3RDs7SUFDeEQsZ0RBQXdEOztJQUd4RCxzQ0FBeUQ7O0lBVXpELG1DQUFnRjs7SUFLaEYsc0NBRTJCOztJQUUzQix1Q0FFZTs7SUFFZixrQ0FBNEQ7O0lBRTVELGtDQUE0RDs7SUFFNUQsa0NBQTREOztJQUU1RCxpQ0FBMkQ7O0lBRTNELG9DQUE4RDs7SUFFOUQsb0NBQThEOztJQUU5RCx3Q0FBcUI7O0lBQ3JCLDJDQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBBZnRlclZpZXdJbml0LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQ29udGVudENoaWxkLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBFdmVudEVtaXR0ZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IERyb3BwYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvbmd4LWRyb3BwYWJsZS5kaXJlY3RpdmUnO1xuXG5sZXQgaSA9IDA7XG5mdW5jdGlvbiBnZXROZXh0SWQoKSB7XG4gIHJldHVybiBpKys7XG59XG5cbi8qKlxuICogQ29tcG9uZW50IHRoYXQgYWxsb3dzIG5lc3RlZCBuZ3hEcm9wcGFibGUgYW5kIG5neERyYWdnYWJsZXNcbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1kbmQtY29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbnRhaW5lci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NvbnRhaW5lci5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIENvbnRhaW5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgpIG1vZGVsOiBhbnk7XG4gIEBJbnB1dCgpIGNvcHkgPSBmYWxzZTtcbiAgQElucHV0KCkgcmVtb3ZlT25TcGlsbCA9IGZhbHNlO1xuICBASW5wdXQoKSBkcm9wcGFibGVJdGVtQ2xhc3M6IHN0cmluZyB8ICgobzogYW55KSA9PiBhbnkpO1xuICBASW5wdXQoKSBkcm9wcGFibGVJdGVtU3R5bGU6IHN0cmluZyB8ICgobzogYW55KSA9PiBhbnkpO1xuXG5cbiAgQElucHV0KCkgZHJvcFpvbmUgPSBgQEBEZWZhdWx0RHJvcFpvbmUtJHtnZXROZXh0SWQoKX1AQGA7XG5cbiAgQElucHV0KClcbiAgZ2V0IGRyb3Bab25lcygpIHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcFpvbmVzIHx8IHRoaXMuX2RlZmF1bHRab25lcztcbiAgfVxuICBzZXQgZHJvcFpvbmVzKHZhbCkge1xuICAgIHRoaXMuX2Ryb3Bab25lcyA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpIG1vdmVzOiAobW9kZWw6IGFueSwgc291cmNlOiBhbnksIGhhbmRsZTogYW55LCBzaWJsaW5nOiBhbnkpID0+IGJvb2xlYW47XG5cbiAgLy8gQElucHV0KCkgY2xhc3NlczogYW55ID0ge307XG4gIC8vIEBJbnB1dCgpIGRyYWd1bGFPcHRpb25zOiBhbnk7XG5cbiAgQElucHV0KClcbiAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZiwgeyBzdGF0aWM6IHRydWUgfSlcbiAgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KClcbiAgQFZpZXdDaGlsZChEcm9wcGFibGVEaXJlY3RpdmUsIHsgc3RhdGljOiB0cnVlIH0pXG4gIGRyb3BwYWJsZTogYW55O1xuXG4gIEBPdXRwdXQoKSBkcm9wOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBkcmFnOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBvdmVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBvdXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIHJlbW92ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgY2FuY2VsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIF9kcm9wWm9uZXM6IHN0cmluZ1tdO1xuICBfZGVmYXVsdFpvbmVzOiBzdHJpbmdbXTtcblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9kZWZhdWx0Wm9uZXMgPSBbdGhpcy5kcm9wWm9uZV07XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5kcm9wcGFibGUuZHJhZy5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5kcmFnLmVtaXQodikpO1xuICAgIHRoaXMuZHJvcHBhYmxlLmRyb3Auc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMuZHJvcC5lbWl0KHYpKTtcbiAgICB0aGlzLmRyb3BwYWJsZS5vdmVyLnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLm92ZXIuZW1pdCh2KSk7XG4gICAgdGhpcy5kcm9wcGFibGUub3V0LnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLm91dC5lbWl0KHYpKTtcbiAgICB0aGlzLmRyb3BwYWJsZS5yZW1vdmUuc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMucmVtb3ZlLmVtaXQodikpO1xuICAgIHRoaXMuZHJvcHBhYmxlLmNhbmNlbC5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5jYW5jZWwuZW1pdCh2KSk7XG4gIH1cbn1cbiJdfQ==