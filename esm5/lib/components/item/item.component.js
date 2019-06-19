/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Component, Input, ViewEncapsulation, HostBinding } from '@angular/core';
import { ContainerComponent } from '../container/container.component';
import { DraggableDirective } from '../../directives/ngx-draggable.directive';
/**
 * Component that allows nested ngxDroppable and ngxDraggables
 * Should only be use inside a ngx-dnd-container
 * Outside a ngx-dnd-container use ngxDroppable
 *
 * @export
 */
var ItemComponent = /** @class */ (function () {
    function ItemComponent(container, draggableDirective) {
        this.container = container;
        this.draggableDirective = draggableDirective;
        this._copy = false;
        this._removeOnSpill = false;
    }
    Object.defineProperty(ItemComponent.prototype, "dropZone", {
        get: /**
         * @return {?}
         */
        function () {
            return this._dropZone || this.container.dropZone;
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
    Object.defineProperty(ItemComponent.prototype, "dropZones", {
        get: /**
         * @return {?}
         */
        function () {
            return this._dropZones || this.container.dropZones;
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
    Object.defineProperty(ItemComponent.prototype, "droppableItemClass", {
        get: /**
         * @return {?}
         */
        function () {
            return this._droppableItemClass || this.container.droppableItemClass;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._droppableItemClass = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemComponent.prototype, "removeOnSpill", {
        get: /**
         * @return {?}
         */
        function () {
            return typeof this._removeOnSpill === 'boolean' ? this._removeOnSpill : this.container.removeOnSpill;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._removeOnSpill = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemComponent.prototype, "copy", {
        get: /**
         * @return {?}
         */
        function () {
            return typeof this._copy === 'boolean' ? this._copy : this.container.copy;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._copy = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemComponent.prototype, "hasHandle", {
        get: /**
         * @return {?}
         */
        function () {
            return this.draggableDirective.hasHandle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemComponent.prototype, "moveDisabled", {
        get: /**
         * @return {?}
         */
        function () {
            return !this.draggableDirective.canMove();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemComponent.prototype, "droppableItemStyle", {
        get: /**
         * @return {?}
         */
        function () {
            return this._droppableItemStyle || this.container.droppableItemStyle;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._droppableItemStyle = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemComponent.prototype, "classString", {
        get: /**
         * @return {?}
         */
        function () {
            var /** @type {?} */ itemClass = typeof this.droppableItemClass === 'function' ? this.droppableItemClass(this.model) : this.droppableItemClass;
            var /** @type {?} */ classes = ['ngx-dnd-item', itemClass || ''];
            if (this.moveDisabled) {
                classes.push('move-disabled');
            }
            if (this.hasHandle) {
                classes.push('has-handle');
            }
            return classes.join(' ');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemComponent.prototype, "type", {
        get: /**
         * @return {?}
         */
        function () {
            if (Array.isArray(this.model)) {
                return 'array';
            }
            return typeof this.model;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ItemComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.data = {
            model: this.model,
            type: this.type,
            dropZone: this.dropZone,
            template: this.container.template
        };
    };
    ItemComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-dnd-item',
                    template: "<ng-container [ngSwitch]=\"type\">\n\n  <ng-container *ngSwitchCase=\"'array'\">\n    <ngx-dnd-container\n      [model]=\"model\"\n      [template]=\"container.template\"\n      [dropZone]=\"dropZone\"\n      [dropZones]=\"dropZones\"\n      [removeOnSpill]=\"removeOnSpill\"\n      [droppableItemClass]=\"droppableItemClass\"\n      [droppableItemStyle]=\"droppableItemStyle\"\n      [copy]=\"copy\">\n    </ngx-dnd-container>\n  </ng-container>\n\n  <ng-container *ngSwitchCase=\"'object'\">\n    <ng-template\n      *ngIf=\"container.template\"\n      [ngTemplateOutlet]=\"container.template\"\n      [ngTemplateOutletContext]=\"data\">\n    </ng-template>\n    <ng-container *ngIf=\"!container.template\">\n      <div\n        class=\"ngx-dnd-content\">\n        {{model.label}}\n      </div>\n      <ngx-dnd-container\n        *ngIf=\"model.children\"\n        [model]=\"model.children\"\n        [template]=\"container.template\"\n        [dropZone]=\"dropZone\"\n        [dropZones]=\"dropZones\"\n        [removeOnSpill]=\"removeOnSpill\"\n        [droppableItemClass]=\"droppableItemClass\"\n        [copy]=\"copy\">\n      </ngx-dnd-container>\n    </ng-container>\n  </ng-container>\n\n  <ng-container *ngSwitchCase=\"'undefined'\">\n  </ng-container>\n\n  <ng-container *ngSwitchDefault>\n    <ng-template\n      *ngIf=\"container.template\"\n      [ngTemplateOutlet]=\"container.template\"\n      [ngTemplateOutletContext]=\"data\">\n    </ng-template>\n    <div\n      *ngIf=\"!container.template\"\n      class=\"ngx-dnd-content\">\n      {{model}}\n    </div>\n  </ng-container>\n\n</ng-container>\n\n\n\n\n\n\n\n",
                    styles: [".ngx-dnd-box,.ngx-dnd-item{margin:10px;padding:10px;background-color:rgba(0,0,0,.2);transition:opacity .4s ease-in-out;border:1px solid #add8e6;display:block}.ngx-dnd-box.has-handle [ngxDragHandle],.ngx-dnd-box.has-handle [ngxdraghandle],.ngx-dnd-box:not(.has-handle):not(.move-disabled),.ngx-dnd-item.has-handle [ngxDragHandle],.ngx-dnd-item.has-handle [ngxdraghandle],.ngx-dnd-item:not(.has-handle):not(.move-disabled){cursor:move;cursor:grab;cursor:-webkit-grab}.ngx-dnd-box .ngx-dnd-content,.ngx-dnd-item .ngx-dnd-content{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ngx-dnd-box:hover,.ngx-dnd-item:hover{border:1px solid #00f}.ngx-dnd-box{height:40px;width:40px;line-height:20px;text-align:center;float:left}.gu-mirror{position:fixed!important;margin:0!important;z-index:9999!important;opacity:.8}.gu-hide{display:none!important}.gu-unselectable{-webkit-user-select:none!important;-moz-user-select:none!important;-ms-user-select:none!important;user-select:none!important}.gu-transit{opacity:.2}"],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    ItemComponent.ctorParameters = function () { return [
        { type: ContainerComponent, },
        { type: DraggableDirective, },
    ]; };
    ItemComponent.propDecorators = {
        "model": [{ type: Input },],
        "dropZone": [{ type: Input },],
        "dropZones": [{ type: Input },],
        "droppableItemClass": [{ type: Input },],
        "removeOnSpill": [{ type: Input },],
        "copy": [{ type: Input },],
        "droppableItemStyle": [{ type: HostBinding, args: ['style',] }, { type: Input },],
        "classString": [{ type: HostBinding, args: ['class',] },],
    };
    return ItemComponent;
}());
export { ItemComponent };
function ItemComponent_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ItemComponent.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ItemComponent.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    ItemComponent.propDecorators;
    /** @type {?} */
    ItemComponent.prototype.model;
    /** @type {?} */
    ItemComponent.prototype._copy;
    /** @type {?} */
    ItemComponent.prototype._dropZone;
    /** @type {?} */
    ItemComponent.prototype._dropZones;
    /** @type {?} */
    ItemComponent.prototype._droppableItemClass;
    /** @type {?} */
    ItemComponent.prototype._droppableItemStyle;
    /** @type {?} */
    ItemComponent.prototype._removeOnSpill;
    /** @type {?} */
    ItemComponent.prototype.data;
    /** @type {?} */
    ItemComponent.prototype.container;
    /** @type {?} */
    ItemComponent.prototype.draggableDirective;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRuZC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQzs7Ozs7Ozs7O0lBdUs1RSx1QkFBbUIsU0FBNkIsRUFBUyxrQkFBc0M7UUFBNUUsY0FBUyxHQUFULFNBQVMsQ0FBb0I7UUFBUyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBOUMvRixhQUFRLEtBQUssQ0FBQztRQUtkLHNCQUFpQixLQUFLLENBQUM7S0F5QzRFOzBCQXJGL0YsbUNBQVE7Ozs7O1lBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDOzs7Ozs7UUFFbkQsVUFBYSxHQUFHO1lBQ2QsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7U0FDdEI7Ozs7MEJBR0csb0NBQVM7Ozs7O1lBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDOzs7Ozs7UUFFckQsVUFBYyxHQUFHO1lBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7U0FDdkI7Ozs7MEJBR0csNkNBQWtCOzs7OztZQUNwQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDOzs7Ozs7UUFFdkUsVUFBdUIsR0FBRztZQUN4QixJQUFJLENBQUMsbUJBQW1CLEdBQUcsR0FBRyxDQUFDO1NBQ2hD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QkFwSnRCOztTQWlGYSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBWaWV3RW5jYXBzdWxhdGlvbiwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi4vY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRHJhZ2dhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9uZ3gtZHJhZ2dhYmxlLmRpcmVjdGl2ZSc7XG5cbi8qKlxuICogQ29tcG9uZW50IHRoYXQgYWxsb3dzIG5lc3RlZCBuZ3hEcm9wcGFibGUgYW5kIG5neERyYWdnYWJsZXNcbiAqIFNob3VsZCBvbmx5IGJlIHVzZSBpbnNpZGUgYSBuZ3gtZG5kLWNvbnRhaW5lclxuICogT3V0c2lkZSBhIG5neC1kbmQtY29udGFpbmVyIHVzZSBuZ3hEcm9wcGFibGVcbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1kbmQtaXRlbScsXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRhaW5lciBbbmdTd2l0Y2hdPVwidHlwZVwiPlxuXG4gIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIidhcnJheSdcIj5cbiAgICA8bmd4LWRuZC1jb250YWluZXJcbiAgICAgIFttb2RlbF09XCJtb2RlbFwiXG4gICAgICBbdGVtcGxhdGVdPVwiY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgIFtkcm9wWm9uZV09XCJkcm9wWm9uZVwiXG4gICAgICBbZHJvcFpvbmVzXT1cImRyb3Bab25lc1wiXG4gICAgICBbcmVtb3ZlT25TcGlsbF09XCJyZW1vdmVPblNwaWxsXCJcbiAgICAgIFtkcm9wcGFibGVJdGVtQ2xhc3NdPVwiZHJvcHBhYmxlSXRlbUNsYXNzXCJcbiAgICAgIFtkcm9wcGFibGVJdGVtU3R5bGVdPVwiZHJvcHBhYmxlSXRlbVN0eWxlXCJcbiAgICAgIFtjb3B5XT1cImNvcHlcIj5cbiAgICA8L25neC1kbmQtY29udGFpbmVyPlxuICA8L25nLWNvbnRhaW5lcj5cblxuICA8bmctY29udGFpbmVyICpuZ1N3aXRjaENhc2U9XCInb2JqZWN0J1wiPlxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgKm5nSWY9XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJkYXRhXCI+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWNvbnRhaW5lci50ZW1wbGF0ZVwiPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cIm5neC1kbmQtY29udGVudFwiPlxuICAgICAgICB7e21vZGVsLmxhYmVsfX1cbiAgICAgIDwvZGl2PlxuICAgICAgPG5neC1kbmQtY29udGFpbmVyXG4gICAgICAgICpuZ0lmPVwibW9kZWwuY2hpbGRyZW5cIlxuICAgICAgICBbbW9kZWxdPVwibW9kZWwuY2hpbGRyZW5cIlxuICAgICAgICBbdGVtcGxhdGVdPVwiY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgICAgW2Ryb3Bab25lXT1cImRyb3Bab25lXCJcbiAgICAgICAgW2Ryb3Bab25lc109XCJkcm9wWm9uZXNcIlxuICAgICAgICBbcmVtb3ZlT25TcGlsbF09XCJyZW1vdmVPblNwaWxsXCJcbiAgICAgICAgW2Ryb3BwYWJsZUl0ZW1DbGFzc109XCJkcm9wcGFibGVJdGVtQ2xhc3NcIlxuICAgICAgICBbY29weV09XCJjb3B5XCI+XG4gICAgICA8L25neC1kbmQtY29udGFpbmVyPlxuICAgIDwvbmctY29udGFpbmVyPlxuICA8L25nLWNvbnRhaW5lcj5cblxuICA8bmctY29udGFpbmVyICpuZ1N3aXRjaENhc2U9XCIndW5kZWZpbmVkJ1wiPlxuICA8L25nLWNvbnRhaW5lcj5cblxuICA8bmctY29udGFpbmVyICpuZ1N3aXRjaERlZmF1bHQ+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAqbmdJZj1cImNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImRhdGFcIj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxkaXZcbiAgICAgICpuZ0lmPVwiIWNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICBjbGFzcz1cIm5neC1kbmQtY29udGVudFwiPlxuICAgICAge3ttb2RlbH19XG4gICAgPC9kaXY+XG4gIDwvbmctY29udGFpbmVyPlxuXG48L25nLWNvbnRhaW5lcj5cblxuXG5cblxuXG5cblxuYCxcbiAgc3R5bGVzOiBbYC5uZ3gtZG5kLWJveCwubmd4LWRuZC1pdGVte21hcmdpbjoxMHB4O3BhZGRpbmc6MTBweDtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjIpO3RyYW5zaXRpb246b3BhY2l0eSAuNHMgZWFzZS1pbi1vdXQ7Ym9yZGVyOjFweCBzb2xpZCAjYWRkOGU2O2Rpc3BsYXk6YmxvY2t9Lm5neC1kbmQtYm94Lmhhcy1oYW5kbGUgW25neERyYWdIYW5kbGVdLC5uZ3gtZG5kLWJveC5oYXMtaGFuZGxlIFtuZ3hkcmFnaGFuZGxlXSwubmd4LWRuZC1ib3g6bm90KC5oYXMtaGFuZGxlKTpub3QoLm1vdmUtZGlzYWJsZWQpLC5uZ3gtZG5kLWl0ZW0uaGFzLWhhbmRsZSBbbmd4RHJhZ0hhbmRsZV0sLm5neC1kbmQtaXRlbS5oYXMtaGFuZGxlIFtuZ3hkcmFnaGFuZGxlXSwubmd4LWRuZC1pdGVtOm5vdCguaGFzLWhhbmRsZSk6bm90KC5tb3ZlLWRpc2FibGVkKXtjdXJzb3I6bW92ZTtjdXJzb3I6Z3JhYjtjdXJzb3I6LXdlYmtpdC1ncmFifS5uZ3gtZG5kLWJveCAubmd4LWRuZC1jb250ZW50LC5uZ3gtZG5kLWl0ZW0gLm5neC1kbmQtY29udGVudHstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9Lm5neC1kbmQtYm94OmhvdmVyLC5uZ3gtZG5kLWl0ZW06aG92ZXJ7Ym9yZGVyOjFweCBzb2xpZCAjMDBmfS5uZ3gtZG5kLWJveHtoZWlnaHQ6NDBweDt3aWR0aDo0MHB4O2xpbmUtaGVpZ2h0OjIwcHg7dGV4dC1hbGlnbjpjZW50ZXI7ZmxvYXQ6bGVmdH0uZ3UtbWlycm9ye3Bvc2l0aW9uOmZpeGVkIWltcG9ydGFudDttYXJnaW46MCFpbXBvcnRhbnQ7ei1pbmRleDo5OTk5IWltcG9ydGFudDtvcGFjaXR5Oi44fS5ndS1oaWRle2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnR9Lmd1LXVuc2VsZWN0YWJsZXstd2Via2l0LXVzZXItc2VsZWN0Om5vbmUhaW1wb3J0YW50Oy1tb3otdXNlci1zZWxlY3Q6bm9uZSFpbXBvcnRhbnQ7LW1zLXVzZXItc2VsZWN0Om5vbmUhaW1wb3J0YW50O3VzZXItc2VsZWN0Om5vbmUhaW1wb3J0YW50fS5ndS10cmFuc2l0e29wYWNpdHk6LjJ9YF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgSXRlbUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIG1vZGVsOiBhbnk7XG5cbiAgQElucHV0KClcbiAgZ2V0IGRyb3Bab25lKCkge1xuICAgIHJldHVybiB0aGlzLl9kcm9wWm9uZSB8fCB0aGlzLmNvbnRhaW5lci5kcm9wWm9uZTtcbiAgfVxuICBzZXQgZHJvcFpvbmUodmFsKSB7XG4gICAgdGhpcy5fZHJvcFpvbmUgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgZHJvcFpvbmVzKCkge1xuICAgIHJldHVybiB0aGlzLl9kcm9wWm9uZXMgfHwgdGhpcy5jb250YWluZXIuZHJvcFpvbmVzO1xuICB9XG4gIHNldCBkcm9wWm9uZXModmFsKSB7XG4gICAgdGhpcy5fZHJvcFpvbmVzID0gdmFsO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGRyb3BwYWJsZUl0ZW1DbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcHBhYmxlSXRlbUNsYXNzIHx8IHRoaXMuY29udGFpbmVyLmRyb3BwYWJsZUl0ZW1DbGFzcztcbiAgfVxuICBzZXQgZHJvcHBhYmxlSXRlbUNsYXNzKHZhbCkge1xuICAgIHRoaXMuX2Ryb3BwYWJsZUl0ZW1DbGFzcyA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCByZW1vdmVPblNwaWxsKCkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5fcmVtb3ZlT25TcGlsbCA9PT0gJ2Jvb2xlYW4nID8gdGhpcy5fcmVtb3ZlT25TcGlsbCA6IHRoaXMuY29udGFpbmVyLnJlbW92ZU9uU3BpbGw7XG4gIH1cbiAgc2V0IHJlbW92ZU9uU3BpbGwodmFsKSB7XG4gICAgdGhpcy5fcmVtb3ZlT25TcGlsbCA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBjb3B5KCkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5fY29weSA9PT0gJ2Jvb2xlYW4nID8gdGhpcy5fY29weSA6IHRoaXMuY29udGFpbmVyLmNvcHk7XG4gIH1cbiAgc2V0IGNvcHkodmFsKSB7XG4gICAgdGhpcy5fY29weSA9IHZhbDtcbiAgfVxuXG4gIF9jb3B5ID0gZmFsc2U7XG4gIF9kcm9wWm9uZTogYW55O1xuICBfZHJvcFpvbmVzOiBhbnk7XG4gIF9kcm9wcGFibGVJdGVtQ2xhc3M6IGFueTtcbiAgX2Ryb3BwYWJsZUl0ZW1TdHlsZTogYW55O1xuICBfcmVtb3ZlT25TcGlsbCA9IGZhbHNlO1xuICBkYXRhOiBhbnk7XG5cbiAgZ2V0IGhhc0hhbmRsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kcmFnZ2FibGVEaXJlY3RpdmUuaGFzSGFuZGxlO1xuICB9XG5cbiAgZ2V0IG1vdmVEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuZHJhZ2dhYmxlRGlyZWN0aXZlLmNhbk1vdmUoKTtcbiAgfVxuICBASG9zdEJpbmRpbmcoJ3N0eWxlJylcbiAgQElucHV0KClcbiAgZ2V0IGRyb3BwYWJsZUl0ZW1TdHlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcHBhYmxlSXRlbVN0eWxlIHx8IHRoaXMuY29udGFpbmVyLmRyb3BwYWJsZUl0ZW1TdHlsZTtcbiAgfVxuICBzZXQgZHJvcHBhYmxlSXRlbVN0eWxlKHZhbCkge1xuICAgIHRoaXMuX2Ryb3BwYWJsZUl0ZW1TdHlsZSA9IHZhbDtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxuICBnZXQgY2xhc3NTdHJpbmcoKSB7XG4gICAgY29uc3QgaXRlbUNsYXNzID1cbiAgICAgIHR5cGVvZiB0aGlzLmRyb3BwYWJsZUl0ZW1DbGFzcyA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuZHJvcHBhYmxlSXRlbUNsYXNzKHRoaXMubW9kZWwpIDogdGhpcy5kcm9wcGFibGVJdGVtQ2xhc3M7XG5cbiAgICBjb25zdCBjbGFzc2VzID0gWyduZ3gtZG5kLWl0ZW0nLCBpdGVtQ2xhc3MgfHwgJyddO1xuICAgIGlmICh0aGlzLm1vdmVEaXNhYmxlZCkge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdtb3ZlLWRpc2FibGVkJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmhhc0hhbmRsZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdoYXMtaGFuZGxlJyk7XG4gICAgfVxuICAgIHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMubW9kZWwpKSB7XG4gICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLm1vZGVsO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIGNvbnRhaW5lcjogQ29udGFpbmVyQ29tcG9uZW50LCBwdWJsaWMgZHJhZ2dhYmxlRGlyZWN0aXZlOiBEcmFnZ2FibGVEaXJlY3RpdmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5kYXRhID0ge1xuICAgICAgbW9kZWw6IHRoaXMubW9kZWwsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBkcm9wWm9uZTogdGhpcy5kcm9wWm9uZSxcbiAgICAgIHRlbXBsYXRlOiB0aGlzLmNvbnRhaW5lci50ZW1wbGF0ZVxuICAgIH07XG4gIH1cbn1cbiJdfQ==