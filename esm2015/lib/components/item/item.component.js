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
export class ItemComponent {
    /**
     * @param {?} container
     * @param {?} draggableDirective
     */
    constructor(container, draggableDirective) {
        this.container = container;
        this.draggableDirective = draggableDirective;
        this._copy = false;
        this._removeOnSpill = false;
    }
    /**
     * @return {?}
     */
    get dropZone() {
        return this._dropZone || this.container.dropZone;
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
    get dropZones() {
        return this._dropZones || this.container.dropZones;
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
    get droppableItemClass() {
        return this._droppableItemClass || this.container.droppableItemClass;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set droppableItemClass(val) {
        this._droppableItemClass = val;
    }
    /**
     * @return {?}
     */
    get droppableItemStyle() {
        return this._droppableItemStyle || this.container.droppableItemStyle;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set droppableItemStyle(val) {
        this._droppableItemStyle = val;
    }
    /**
     * @return {?}
     */
    get removeOnSpill() {
        return typeof this._removeOnSpill === 'boolean' ? this._removeOnSpill : this.container.removeOnSpill;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set removeOnSpill(val) {
        this._removeOnSpill = val;
    }
    /**
     * @return {?}
     */
    get copy() {
        return typeof this._copy === 'boolean' ? this._copy : this.container.copy;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set copy(val) {
        this._copy = val;
    }
    /**
     * @return {?}
     */
    get hasHandle() {
        return this.draggableDirective.hasHandle;
    }
    /**
     * @return {?}
     */
    get moveDisabled() {
        return !this.draggableDirective.canMove();
    }
    /**
     * @return {?}
     */
    get classString() {
        const /** @type {?} */ itemClass = typeof this.droppableItemClass === 'function' ? this.droppableItemClass(this.model) : this.droppableItemClass;
        const /** @type {?} */ classes = ['ngx-dnd-item', itemClass || ''];
        if (this.moveDisabled) {
            classes.push('move-disabled');
        }
        if (this.hasHandle) {
            classes.push('has-handle');
        }
        return classes.join(' ');
    }
    /**
     * @return {?}
     */
    get type() {
        if (Array.isArray(this.model)) {
            return 'array';
        }
        return typeof this.model;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.data = {
            model: this.model,
            type: this.type,
            dropZone: this.dropZone,
            template: this.container.template
        };
    }
}
ItemComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-dnd-item',
                template: `<ng-container [ngSwitch]="type">

  <ng-container *ngSwitchCase="'array'">
    <ngx-dnd-container
      [model]="model"
      [template]="container.template"
      [dropZone]="dropZone"
      [dropZones]="dropZones"
      [removeOnSpill]="removeOnSpill"
      [droppableItemClass]="droppableItemClass"
      [droppableItemStyle]="droppableItemStyle"
      [copy]="copy">
    </ngx-dnd-container>
  </ng-container>

  <ng-container *ngSwitchCase="'object'">
    <ng-template
      *ngIf="container.template"
      [ngTemplateOutlet]="container.template"
      [ngTemplateOutletContext]="data">
    </ng-template>
    <ng-container *ngIf="!container.template">
      <div
        class="ngx-dnd-content">
        {{model.label}}
      </div>
      <ngx-dnd-container
        *ngIf="model.children"
        [model]="model.children"
        [template]="container.template"
        [dropZone]="dropZone"
        [dropZones]="dropZones"
        [removeOnSpill]="removeOnSpill"
        [droppableItemClass]="droppableItemClass"
        [copy]="copy">
      </ngx-dnd-container>
    </ng-container>
  </ng-container>

  <ng-container *ngSwitchCase="'undefined'">
  </ng-container>

  <ng-container *ngSwitchDefault>
    <ng-template
      *ngIf="container.template"
      [ngTemplateOutlet]="container.template"
      [ngTemplateOutletContext]="data">
    </ng-template>
    <div
      *ngIf="!container.template"
      class="ngx-dnd-content">
      {{model}}
    </div>
  </ng-container>

</ng-container>







`,
                styles: [`.ngx-dnd-box,.ngx-dnd-item{margin:10px;padding:10px;background-color:rgba(0,0,0,.2);transition:opacity .4s ease-in-out;border:1px solid #add8e6;display:block}.ngx-dnd-box.has-handle [ngxDragHandle],.ngx-dnd-box.has-handle [ngxdraghandle],.ngx-dnd-box:not(.has-handle):not(.move-disabled),.ngx-dnd-item.has-handle [ngxDragHandle],.ngx-dnd-item.has-handle [ngxdraghandle],.ngx-dnd-item:not(.has-handle):not(.move-disabled){cursor:move;cursor:grab;cursor:-webkit-grab}.ngx-dnd-box .ngx-dnd-content,.ngx-dnd-item .ngx-dnd-content{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ngx-dnd-box:hover,.ngx-dnd-item:hover{border:1px solid #00f}.ngx-dnd-box{height:40px;width:40px;line-height:20px;text-align:center;float:left}.gu-mirror{position:fixed!important;margin:0!important;z-index:9999!important;opacity:.8}.gu-hide{display:none!important}.gu-unselectable{-webkit-user-select:none!important;-moz-user-select:none!important;-ms-user-select:none!important;user-select:none!important}.gu-transit{opacity:.2}`],
                encapsulation: ViewEncapsulation.None
            },] },
];
/** @nocollapse */
ItemComponent.ctorParameters = () => [
    { type: ContainerComponent, },
    { type: DraggableDirective, },
];
ItemComponent.propDecorators = {
    "model": [{ type: Input },],
    "dropZone": [{ type: Input },],
    "dropZones": [{ type: Input },],
    "droppableItemClass": [{ type: Input },],
    "droppableItemStyle": [{ type: Input },],
    "removeOnSpill": [{ type: Input },],
    "copy": [{ type: Input },],
    "classString": [{ type: HostBinding, args: ['class',] },],
};
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRuZC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQzs7Ozs7Ozs7QUE4RTlFLE1BQU0sT0FBTyxhQUFhOzs7OztJQXlGeEIsWUFBbUIsU0FBNkIsRUFBUyxrQkFBc0M7UUFBNUUsY0FBUyxHQUFULFNBQVMsQ0FBb0I7UUFBUyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBdEMvRixhQUFRLEtBQUssQ0FBQztRQUtkLHNCQUFpQixLQUFLLENBQUM7S0FpQzRFOzs7O1FBckYvRixRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDOzs7Ozs7SUFFbkQsSUFBSSxRQUFRLENBQUMsR0FBRztRQUNkLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0tBQ3RCOzs7O1FBR0csU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQzs7Ozs7O0lBRXJELElBQUksU0FBUyxDQUFDLEdBQUc7UUFDZixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztLQUN2Qjs7OztRQUdHLGtCQUFrQjtRQUNwQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDOzs7Ozs7SUFFdkUsSUFBSSxrQkFBa0IsQ0FBQyxHQUFHO1FB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QUs7NEJBd0JMLFdBQVcsU0FBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBWaWV3RW5jYXBzdWxhdGlvbiwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi4vY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRHJhZ2dhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9uZ3gtZHJhZ2dhYmxlLmRpcmVjdGl2ZSc7XG5cbi8qKlxuICogQ29tcG9uZW50IHRoYXQgYWxsb3dzIG5lc3RlZCBuZ3hEcm9wcGFibGUgYW5kIG5neERyYWdnYWJsZXNcbiAqIFNob3VsZCBvbmx5IGJlIHVzZSBpbnNpZGUgYSBuZ3gtZG5kLWNvbnRhaW5lclxuICogT3V0c2lkZSBhIG5neC1kbmQtY29udGFpbmVyIHVzZSBuZ3hEcm9wcGFibGVcbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1kbmQtaXRlbScsXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRhaW5lciBbbmdTd2l0Y2hdPVwidHlwZVwiPlxuXG4gIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIidhcnJheSdcIj5cbiAgICA8bmd4LWRuZC1jb250YWluZXJcbiAgICAgIFttb2RlbF09XCJtb2RlbFwiXG4gICAgICBbdGVtcGxhdGVdPVwiY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgIFtkcm9wWm9uZV09XCJkcm9wWm9uZVwiXG4gICAgICBbZHJvcFpvbmVzXT1cImRyb3Bab25lc1wiXG4gICAgICBbcmVtb3ZlT25TcGlsbF09XCJyZW1vdmVPblNwaWxsXCJcbiAgICAgIFtkcm9wcGFibGVJdGVtQ2xhc3NdPVwiZHJvcHBhYmxlSXRlbUNsYXNzXCJcbiAgICAgIFtkcm9wcGFibGVJdGVtU3R5bGVdPVwiZHJvcHBhYmxlSXRlbVN0eWxlXCJcbiAgICAgIFtjb3B5XT1cImNvcHlcIj5cbiAgICA8L25neC1kbmQtY29udGFpbmVyPlxuICA8L25nLWNvbnRhaW5lcj5cblxuICA8bmctY29udGFpbmVyICpuZ1N3aXRjaENhc2U9XCInb2JqZWN0J1wiPlxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgKm5nSWY9XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJkYXRhXCI+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWNvbnRhaW5lci50ZW1wbGF0ZVwiPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cIm5neC1kbmQtY29udGVudFwiPlxuICAgICAgICB7e21vZGVsLmxhYmVsfX1cbiAgICAgIDwvZGl2PlxuICAgICAgPG5neC1kbmQtY29udGFpbmVyXG4gICAgICAgICpuZ0lmPVwibW9kZWwuY2hpbGRyZW5cIlxuICAgICAgICBbbW9kZWxdPVwibW9kZWwuY2hpbGRyZW5cIlxuICAgICAgICBbdGVtcGxhdGVdPVwiY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgICAgW2Ryb3Bab25lXT1cImRyb3Bab25lXCJcbiAgICAgICAgW2Ryb3Bab25lc109XCJkcm9wWm9uZXNcIlxuICAgICAgICBbcmVtb3ZlT25TcGlsbF09XCJyZW1vdmVPblNwaWxsXCJcbiAgICAgICAgW2Ryb3BwYWJsZUl0ZW1DbGFzc109XCJkcm9wcGFibGVJdGVtQ2xhc3NcIlxuICAgICAgICBbY29weV09XCJjb3B5XCI+XG4gICAgICA8L25neC1kbmQtY29udGFpbmVyPlxuICAgIDwvbmctY29udGFpbmVyPlxuICA8L25nLWNvbnRhaW5lcj5cblxuICA8bmctY29udGFpbmVyICpuZ1N3aXRjaENhc2U9XCIndW5kZWZpbmVkJ1wiPlxuICA8L25nLWNvbnRhaW5lcj5cblxuICA8bmctY29udGFpbmVyICpuZ1N3aXRjaERlZmF1bHQ+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAqbmdJZj1cImNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImRhdGFcIj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxkaXZcbiAgICAgICpuZ0lmPVwiIWNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICBjbGFzcz1cIm5neC1kbmQtY29udGVudFwiPlxuICAgICAge3ttb2RlbH19XG4gICAgPC9kaXY+XG4gIDwvbmctY29udGFpbmVyPlxuXG48L25nLWNvbnRhaW5lcj5cblxuXG5cblxuXG5cblxuYCxcbiAgc3R5bGVzOiBbYC5uZ3gtZG5kLWJveCwubmd4LWRuZC1pdGVte21hcmdpbjoxMHB4O3BhZGRpbmc6MTBweDtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjIpO3RyYW5zaXRpb246b3BhY2l0eSAuNHMgZWFzZS1pbi1vdXQ7Ym9yZGVyOjFweCBzb2xpZCAjYWRkOGU2O2Rpc3BsYXk6YmxvY2t9Lm5neC1kbmQtYm94Lmhhcy1oYW5kbGUgW25neERyYWdIYW5kbGVdLC5uZ3gtZG5kLWJveC5oYXMtaGFuZGxlIFtuZ3hkcmFnaGFuZGxlXSwubmd4LWRuZC1ib3g6bm90KC5oYXMtaGFuZGxlKTpub3QoLm1vdmUtZGlzYWJsZWQpLC5uZ3gtZG5kLWl0ZW0uaGFzLWhhbmRsZSBbbmd4RHJhZ0hhbmRsZV0sLm5neC1kbmQtaXRlbS5oYXMtaGFuZGxlIFtuZ3hkcmFnaGFuZGxlXSwubmd4LWRuZC1pdGVtOm5vdCguaGFzLWhhbmRsZSk6bm90KC5tb3ZlLWRpc2FibGVkKXtjdXJzb3I6bW92ZTtjdXJzb3I6Z3JhYjtjdXJzb3I6LXdlYmtpdC1ncmFifS5uZ3gtZG5kLWJveCAubmd4LWRuZC1jb250ZW50LC5uZ3gtZG5kLWl0ZW0gLm5neC1kbmQtY29udGVudHstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9Lm5neC1kbmQtYm94OmhvdmVyLC5uZ3gtZG5kLWl0ZW06aG92ZXJ7Ym9yZGVyOjFweCBzb2xpZCAjMDBmfS5uZ3gtZG5kLWJveHtoZWlnaHQ6NDBweDt3aWR0aDo0MHB4O2xpbmUtaGVpZ2h0OjIwcHg7dGV4dC1hbGlnbjpjZW50ZXI7ZmxvYXQ6bGVmdH0uZ3UtbWlycm9ye3Bvc2l0aW9uOmZpeGVkIWltcG9ydGFudDttYXJnaW46MCFpbXBvcnRhbnQ7ei1pbmRleDo5OTk5IWltcG9ydGFudDtvcGFjaXR5Oi44fS5ndS1oaWRle2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnR9Lmd1LXVuc2VsZWN0YWJsZXstd2Via2l0LXVzZXItc2VsZWN0Om5vbmUhaW1wb3J0YW50Oy1tb3otdXNlci1zZWxlY3Q6bm9uZSFpbXBvcnRhbnQ7LW1zLXVzZXItc2VsZWN0Om5vbmUhaW1wb3J0YW50O3VzZXItc2VsZWN0Om5vbmUhaW1wb3J0YW50fS5ndS10cmFuc2l0e29wYWNpdHk6LjJ9YF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgSXRlbUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIG1vZGVsOiBhbnk7XG5cbiAgQElucHV0KClcbiAgZ2V0IGRyb3Bab25lKCkge1xuICAgIHJldHVybiB0aGlzLl9kcm9wWm9uZSB8fCB0aGlzLmNvbnRhaW5lci5kcm9wWm9uZTtcbiAgfVxuICBzZXQgZHJvcFpvbmUodmFsKSB7XG4gICAgdGhpcy5fZHJvcFpvbmUgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgZHJvcFpvbmVzKCkge1xuICAgIHJldHVybiB0aGlzLl9kcm9wWm9uZXMgfHwgdGhpcy5jb250YWluZXIuZHJvcFpvbmVzO1xuICB9XG4gIHNldCBkcm9wWm9uZXModmFsKSB7XG4gICAgdGhpcy5fZHJvcFpvbmVzID0gdmFsO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGRyb3BwYWJsZUl0ZW1DbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcHBhYmxlSXRlbUNsYXNzIHx8IHRoaXMuY29udGFpbmVyLmRyb3BwYWJsZUl0ZW1DbGFzcztcbiAgfVxuICBzZXQgZHJvcHBhYmxlSXRlbUNsYXNzKHZhbCkge1xuICAgIHRoaXMuX2Ryb3BwYWJsZUl0ZW1DbGFzcyA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wcGFibGVJdGVtU3R5bGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3BwYWJsZUl0ZW1TdHlsZSB8fCB0aGlzLmNvbnRhaW5lci5kcm9wcGFibGVJdGVtU3R5bGU7XG4gIH1cbiAgc2V0IGRyb3BwYWJsZUl0ZW1TdHlsZSh2YWwpIHtcbiAgICB0aGlzLl9kcm9wcGFibGVJdGVtU3R5bGUgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgcmVtb3ZlT25TcGlsbCgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuX3JlbW92ZU9uU3BpbGwgPT09ICdib29sZWFuJyA/IHRoaXMuX3JlbW92ZU9uU3BpbGwgOiB0aGlzLmNvbnRhaW5lci5yZW1vdmVPblNwaWxsO1xuICB9XG4gIHNldCByZW1vdmVPblNwaWxsKHZhbCkge1xuICAgIHRoaXMuX3JlbW92ZU9uU3BpbGwgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgY29weSgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuX2NvcHkgPT09ICdib29sZWFuJyA/IHRoaXMuX2NvcHkgOiB0aGlzLmNvbnRhaW5lci5jb3B5O1xuICB9XG4gIHNldCBjb3B5KHZhbCkge1xuICAgIHRoaXMuX2NvcHkgPSB2YWw7XG4gIH1cblxuICBfY29weSA9IGZhbHNlO1xuICBfZHJvcFpvbmU6IGFueTtcbiAgX2Ryb3Bab25lczogYW55O1xuICBfZHJvcHBhYmxlSXRlbUNsYXNzOiBhbnk7XG4gIF9kcm9wcGFibGVJdGVtU3R5bGU6IGFueTtcbiAgX3JlbW92ZU9uU3BpbGwgPSBmYWxzZTtcbiAgZGF0YTogYW55O1xuXG4gIGdldCBoYXNIYW5kbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZHJhZ2dhYmxlRGlyZWN0aXZlLmhhc0hhbmRsZTtcbiAgfVxuXG4gIGdldCBtb3ZlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmRyYWdnYWJsZURpcmVjdGl2ZS5jYW5Nb3ZlKCk7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzJylcbiAgZ2V0IGNsYXNzU3RyaW5nKCkge1xuICAgIGNvbnN0IGl0ZW1DbGFzcyA9XG4gICAgICB0eXBlb2YgdGhpcy5kcm9wcGFibGVJdGVtQ2xhc3MgPT09ICdmdW5jdGlvbicgPyB0aGlzLmRyb3BwYWJsZUl0ZW1DbGFzcyh0aGlzLm1vZGVsKSA6IHRoaXMuZHJvcHBhYmxlSXRlbUNsYXNzO1xuXG4gICAgY29uc3QgY2xhc3NlcyA9IFsnbmd4LWRuZC1pdGVtJywgaXRlbUNsYXNzIHx8ICcnXTtcbiAgICBpZiAodGhpcy5tb3ZlRGlzYWJsZWQpIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnbW92ZS1kaXNhYmxlZCcpO1xuICAgIH1cbiAgICBpZiAodGhpcy5oYXNIYW5kbGUpIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnaGFzLWhhbmRsZScpO1xuICAgIH1cbiAgICByZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLm1vZGVsKSkge1xuICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgfVxuICAgIHJldHVybiB0eXBlb2YgdGhpcy5tb2RlbDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb250YWluZXI6IENvbnRhaW5lckNvbXBvbmVudCwgcHVibGljIGRyYWdnYWJsZURpcmVjdGl2ZTogRHJhZ2dhYmxlRGlyZWN0aXZlKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZGF0YSA9IHtcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLFxuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgZHJvcFpvbmU6IHRoaXMuZHJvcFpvbmUsXG4gICAgICB0ZW1wbGF0ZTogdGhpcy5jb250YWluZXIudGVtcGxhdGVcbiAgICB9O1xuICB9XG59XG4iXX0=