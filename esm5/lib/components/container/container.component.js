/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, Output, ViewEncapsulation, ContentChild, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { DroppableDirective } from '../../directives/ngx-droppable.directive';
var /** @type {?} */ i = 0;
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
    // @Input() classes: any = {};
    // @Input() dragulaOptions: any;
    /**
     * @param {?} item
     * @return {?}
     */
    ContainerComponent.prototype.styleString = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        var /** @type {?} */ itemStyle = typeof this.droppableItemStyle === 'function' ? this.droppableItemStyle(item) : this.droppableItemStyle;
        var /** @type {?} */ classes = tslib_1.__assign({}, itemStyle);
        // console.error(itemStyle);
        // console.error(classes.join(' '));
        return classes;
    };
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
        this.droppable.drag.subscribe(function (v) { return _this.drag.emit(v); });
        this.droppable.drop.subscribe(function (v) { return _this.drop.emit(v); });
        this.droppable.over.subscribe(function (v) { return _this.over.emit(v); });
        this.droppable.out.subscribe(function (v) { return _this.out.emit(v); });
        this.droppable.remove.subscribe(function (v) { return _this.remove.emit(v); });
        this.droppable.cancel.subscribe(function (v) { return _this.cancel.emit(v); });
    };
    ContainerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-dnd-container',
                    template: "<div\n  ngxDroppable\n  [dropZone]=\"dropZone\"\n  [model]=\"model\"\n  [copy]=\"copy\"\n  [ngClass]=\"{ 'gu-empty': !model?.length }\"\n  [removeOnSpill]=\"removeOnSpill\"\n  class='ngx-dnd-container'>\n  <ng-container *ngIf=\"model\">\n    <ng-container *ngFor=\"let item of model\">\n      <ngx-dnd-item\n        ngxDraggable\n        [model]=\"item\"\n        [dropZone]=\"dropZone\"\n        [dropZones]=\"dropZones\"\n        [copy]=\"copy\"\n        [moves]=\"moves\"\n        [removeOnSpill]=\"removeOnSpill\"\n        [droppableItemClass]=\"droppableItemClass\"\n        [ngStyle]=\"styleString(item)\">\n      </ngx-dnd-item>\n    </ng-container>\n  </ng-container>\n  <ng-content *ngIf=\"!model\"></ng-content>\n</div>\n",
                    styles: [".ngx-dnd-container{background-color:rgba(255,255,255,.2);border:2px solid red;margin:10px;padding:10px}.ngx-dnd-container.gu-empty{border:2px dotted red}.ngx-dnd-container:nth-child(odd){background-color:rgba(0,0,0,.2)}.ngx-dnd-container .ex-moved{background-color:#e74c3c}.ngx-dnd-container .ex-over{background-color:rgba(255,255,255,.3)}.ngx-dnd-container .handle{padding:0 5px;margin-right:5px;background-color:rgba(0,0,0,.4);cursor:move}.no-select{-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.clearfix::after{content:\" \";display:block;height:0;clear:both}"],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    ContainerComponent.propDecorators = {
        "model": [{ type: Input },],
        "copy": [{ type: Input },],
        "removeOnSpill": [{ type: Input },],
        "droppableItemClass": [{ type: Input },],
        "droppableItemStyle": [{ type: Input },],
        "dropZone": [{ type: Input },],
        "dropZones": [{ type: Input },],
        "moves": [{ type: Input },],
        "template": [{ type: Input }, { type: ContentChild, args: [TemplateRef,] },],
        "droppable": [{ type: Input }, { type: ViewChild, args: [DroppableDirective,] },],
        "drop": [{ type: Output },],
        "drag": [{ type: Output },],
        "over": [{ type: Output },],
        "out": [{ type: Output },],
        "remove": [{ type: Output },],
        "cancel": [{ type: Output },],
    };
    return ContainerComponent;
}());
export { ContainerComponent };
function ContainerComponent_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ContainerComponent.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ContainerComponent.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    ContainerComponent.propDecorators;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUdULEtBQUssRUFDTCxNQUFNLEVBQ04saUJBQWlCLEVBQ2pCLFlBQVksRUFDWixXQUFXLEVBQ1gsU0FBUyxFQUNULFlBQVksRUFDYixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUU5RSxxQkFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7O0FBQ1YsU0FBUyxTQUFTO0lBQ2hCLE9BQU8sQ0FBQyxFQUFFLENBQUM7Q0FDWjs7Ozs7Ozs7b0JBd0NpQixLQUFLOzZCQUNJLEtBQUs7d0JBS1YsdUJBQXFCLFNBQVMsRUFBRSxPQUFJO29CQW1DcEIsSUFBSSxZQUFZLEVBQU87b0JBRXZCLElBQUksWUFBWSxFQUFPO29CQUV2QixJQUFJLFlBQVksRUFBTzttQkFFeEIsSUFBSSxZQUFZLEVBQU87c0JBRXBCLElBQUksWUFBWSxFQUFPO3NCQUV2QixJQUFJLFlBQVksRUFBTzs7MEJBMUN6RCx5Q0FBUzs7Ozs7WUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQzs7Ozs7O1FBRS9DLFVBQWMsR0FBRztZQUNmLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO1NBQ3ZCOzs7O0lBSUQsOEJBQThCO0lBQzlCLGdDQUFnQzs7Ozs7SUFFaEMsd0NBQVc7Ozs7SUFBWCxVQUFZLElBQUk7UUFDZCxxQkFBTSxTQUFTLEdBQ2IsT0FBTyxJQUFJLENBQUMsa0JBQWtCLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztRQUUxRyxxQkFBTSxPQUFPLHdCQUNSLFNBQVMsQ0FDYixDQUFDOzs7UUFHRixPQUFPLE9BQU8sQ0FBQztLQUNoQjs7OztJQXlCRCxxQ0FBUTs7O0lBQVI7UUFDRSxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3RDOzs7O0lBRUQsNENBQWU7OztJQUFmO1FBQUEsaUJBT0M7UUFOQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBQyxDQUFNLElBQUssT0FBQSxLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFDLENBQU0sSUFBSyxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQUMsQ0FBTSxJQUFLLE9BQUEsS0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQWpCLENBQWlCLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBQyxDQUFNLElBQUssT0FBQSxLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBaEIsQ0FBZ0IsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFDLENBQU0sSUFBSyxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFuQixDQUFtQixDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUMsQ0FBTSxJQUFLLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQW5CLENBQW1CLENBQUMsQ0FBQztLQUNsRTs7Z0JBcEdGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixRQUFRLEVBQUUsNnRCQXlCWDtvQkFDQyxNQUFNLEVBQUUsQ0FBQyx1bkJBQXFuQixDQUFDO29CQUMvbkIsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7aUJBQ3RDOzs7OzBCQUVFLEtBQUs7eUJBQ0wsS0FBSztrQ0FDTCxLQUFLO3VDQUNMLEtBQUs7dUNBQ0wsS0FBSzs2QkFHTCxLQUFLOzhCQUVMLEtBQUs7MEJBUUwsS0FBSzs2QkFpQkwsS0FBSyxZQUNMLFlBQVksU0FBQyxXQUFXOzhCQUd4QixLQUFLLFlBQ0wsU0FBUyxTQUFDLGtCQUFrQjt5QkFHNUIsTUFBTTt5QkFFTixNQUFNO3lCQUVOLE1BQU07d0JBRU4sTUFBTTsyQkFFTixNQUFNOzJCQUVOLE1BQU07OzZCQTdHVDs7U0F3RGEsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDb250ZW50Q2hpbGQsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRHJvcHBhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9uZ3gtZHJvcHBhYmxlLmRpcmVjdGl2ZSc7XG5cbmxldCBpID0gMDtcbmZ1bmN0aW9uIGdldE5leHRJZCgpIHtcbiAgcmV0dXJuIGkrKztcbn1cblxuLyoqXG4gKiBDb21wb25lbnQgdGhhdCBhbGxvd3MgbmVzdGVkIG5neERyb3BwYWJsZSBhbmQgbmd4RHJhZ2dhYmxlc1xuICpcbiAqIEBleHBvcnRcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWRuZC1jb250YWluZXInLFxuICB0ZW1wbGF0ZTogYDxkaXZcbiAgbmd4RHJvcHBhYmxlXG4gIFtkcm9wWm9uZV09XCJkcm9wWm9uZVwiXG4gIFttb2RlbF09XCJtb2RlbFwiXG4gIFtjb3B5XT1cImNvcHlcIlxuICBbbmdDbGFzc109XCJ7ICdndS1lbXB0eSc6ICFtb2RlbD8ubGVuZ3RoIH1cIlxuICBbcmVtb3ZlT25TcGlsbF09XCJyZW1vdmVPblNwaWxsXCJcbiAgY2xhc3M9J25neC1kbmQtY29udGFpbmVyJz5cbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm1vZGVsXCI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgaXRlbSBvZiBtb2RlbFwiPlxuICAgICAgPG5neC1kbmQtaXRlbVxuICAgICAgICBuZ3hEcmFnZ2FibGVcbiAgICAgICAgW21vZGVsXT1cIml0ZW1cIlxuICAgICAgICBbZHJvcFpvbmVdPVwiZHJvcFpvbmVcIlxuICAgICAgICBbZHJvcFpvbmVzXT1cImRyb3Bab25lc1wiXG4gICAgICAgIFtjb3B5XT1cImNvcHlcIlxuICAgICAgICBbbW92ZXNdPVwibW92ZXNcIlxuICAgICAgICBbcmVtb3ZlT25TcGlsbF09XCJyZW1vdmVPblNwaWxsXCJcbiAgICAgICAgW2Ryb3BwYWJsZUl0ZW1DbGFzc109XCJkcm9wcGFibGVJdGVtQ2xhc3NcIlxuICAgICAgICBbbmdTdHlsZV09XCJzdHlsZVN0cmluZyhpdGVtKVwiPlxuICAgICAgPC9uZ3gtZG5kLWl0ZW0+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIDwvbmctY29udGFpbmVyPlxuICA8bmctY29udGVudCAqbmdJZj1cIiFtb2RlbFwiPjwvbmctY29udGVudD5cbjwvZGl2PlxuYCxcbiAgc3R5bGVzOiBbYC5uZ3gtZG5kLWNvbnRhaW5lcntiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMjU1LDI1NSwyNTUsLjIpO2JvcmRlcjoycHggc29saWQgcmVkO21hcmdpbjoxMHB4O3BhZGRpbmc6MTBweH0ubmd4LWRuZC1jb250YWluZXIuZ3UtZW1wdHl7Ym9yZGVyOjJweCBkb3R0ZWQgcmVkfS5uZ3gtZG5kLWNvbnRhaW5lcjpudGgtY2hpbGQob2RkKXtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjIpfS5uZ3gtZG5kLWNvbnRhaW5lciAuZXgtbW92ZWR7YmFja2dyb3VuZC1jb2xvcjojZTc0YzNjfS5uZ3gtZG5kLWNvbnRhaW5lciAuZXgtb3ZlcntiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMjU1LDI1NSwyNTUsLjMpfS5uZ3gtZG5kLWNvbnRhaW5lciAuaGFuZGxle3BhZGRpbmc6MCA1cHg7bWFyZ2luLXJpZ2h0OjVweDtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjQpO2N1cnNvcjptb3ZlfS5uby1zZWxlY3R7LXdlYmtpdC10b3VjaC1jYWxsb3V0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lfS5jbGVhcmZpeDo6YWZ0ZXJ7Y29udGVudDpcIiBcIjtkaXNwbGF5OmJsb2NrO2hlaWdodDowO2NsZWFyOmJvdGh9YF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgbW9kZWw6IGFueTtcbiAgQElucHV0KCkgY29weSA9IGZhbHNlO1xuICBASW5wdXQoKSByZW1vdmVPblNwaWxsID0gZmFsc2U7XG4gIEBJbnB1dCgpIGRyb3BwYWJsZUl0ZW1DbGFzczogc3RyaW5nIHwgKChvOiBhbnkpID0+IGFueSk7XG4gIEBJbnB1dCgpIGRyb3BwYWJsZUl0ZW1TdHlsZTogc3RyaW5nIHwgKChvOiBhbnkpID0+IGFueSk7XG5cblxuICBASW5wdXQoKSBkcm9wWm9uZSA9IGBAQERlZmF1bHREcm9wWm9uZS0ke2dldE5leHRJZCgpfUBAYDtcblxuICBASW5wdXQoKVxuICBnZXQgZHJvcFpvbmVzKCkge1xuICAgIHJldHVybiB0aGlzLl9kcm9wWm9uZXMgfHwgdGhpcy5fZGVmYXVsdFpvbmVzO1xuICB9XG4gIHNldCBkcm9wWm9uZXModmFsKSB7XG4gICAgdGhpcy5fZHJvcFpvbmVzID0gdmFsO1xuICB9XG5cbiAgQElucHV0KCkgbW92ZXM6IChtb2RlbDogYW55LCBzb3VyY2U6IGFueSwgaGFuZGxlOiBhbnksIHNpYmxpbmc6IGFueSkgPT4gYm9vbGVhbjtcblxuICAvLyBASW5wdXQoKSBjbGFzc2VzOiBhbnkgPSB7fTtcbiAgLy8gQElucHV0KCkgZHJhZ3VsYU9wdGlvbnM6IGFueTtcblxuICBzdHlsZVN0cmluZyhpdGVtKSB7XG4gICAgY29uc3QgaXRlbVN0eWxlID1cbiAgICAgIHR5cGVvZiB0aGlzLmRyb3BwYWJsZUl0ZW1TdHlsZSA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuZHJvcHBhYmxlSXRlbVN0eWxlKGl0ZW0pIDogdGhpcy5kcm9wcGFibGVJdGVtU3R5bGU7XG5cbiAgICBjb25zdCBjbGFzc2VzID0ge1xuICAgICAgLi4uaXRlbVN0eWxlXG4gICAgfTtcbiAgICAvLyBjb25zb2xlLmVycm9yKGl0ZW1TdHlsZSk7XG4gICAgLy8gY29uc29sZS5lcnJvcihjbGFzc2VzLmpvaW4oJyAnKSk7XG4gICAgcmV0dXJuIGNsYXNzZXM7XG4gIH1cblxuICBASW5wdXQoKVxuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKVxuICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXQoKVxuICBAVmlld0NoaWxkKERyb3BwYWJsZURpcmVjdGl2ZSlcbiAgZHJvcHBhYmxlOiBhbnk7XG5cbiAgQE91dHB1dCgpIGRyb3A6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIGRyYWc6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIG92ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIG91dDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgcmVtb3ZlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBjYW5jZWw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgX2Ryb3Bab25lczogc3RyaW5nW107XG4gIF9kZWZhdWx0Wm9uZXM6IHN0cmluZ1tdO1xuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2RlZmF1bHRab25lcyA9IFt0aGlzLmRyb3Bab25lXTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmRyb3BwYWJsZS5kcmFnLnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLmRyYWcuZW1pdCh2KSk7XG4gICAgdGhpcy5kcm9wcGFibGUuZHJvcC5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5kcm9wLmVtaXQodikpO1xuICAgIHRoaXMuZHJvcHBhYmxlLm92ZXIuc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMub3Zlci5lbWl0KHYpKTtcbiAgICB0aGlzLmRyb3BwYWJsZS5vdXQuc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMub3V0LmVtaXQodikpO1xuICAgIHRoaXMuZHJvcHBhYmxlLnJlbW92ZS5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5yZW1vdmUuZW1pdCh2KSk7XG4gICAgdGhpcy5kcm9wcGFibGUuY2FuY2VsLnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLmNhbmNlbC5lbWl0KHYpKTtcbiAgfVxufVxuIl19