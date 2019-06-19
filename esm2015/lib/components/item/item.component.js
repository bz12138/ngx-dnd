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
    get styleString() {
        const /** @type {?} */ itemStyle = typeof this.droppableItemStyle === 'function' ? this.droppableItemStyle(this.model) : this.droppableItemStyle;
        const /** @type {?} */ classes = [itemStyle];
        return classes.join(' ');
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
    "droppableItemStyle": [{ type: HostBinding, args: ['style',] }, { type: Input },],
    "removeOnSpill": [{ type: Input },],
    "copy": [{ type: Input },],
    "styleString": [{ type: HostBinding, args: ['style',] },],
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRuZC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQzs7Ozs7Ozs7QUE4RTlFLE1BQU0sT0FBTyxhQUFhOzs7OztJQW1HeEIsWUFBbUIsU0FBNkIsRUFBUyxrQkFBc0M7UUFBNUUsY0FBUyxHQUFULFNBQVMsQ0FBb0I7UUFBUyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBL0MvRixhQUFRLEtBQUssQ0FBQztRQUtkLHNCQUFpQixLQUFLLENBQUM7S0EwQzRFOzs7O1FBL0YvRixRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDOzs7Ozs7SUFFbkQsSUFBSSxRQUFRLENBQUMsR0FBRztRQUNkLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0tBQ3RCOzs7O1FBR0csU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQzs7Ozs7O0lBRXJELElBQUksU0FBUyxDQUFDLEdBQUc7UUFDZixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztLQUN2Qjs7OztRQUdHLGtCQUFrQjtRQUNwQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDOzs7Ozs7SUFFdkUsSUFBSSxrQkFBa0IsQ0FBQyxHQUFHO1FB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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBK0RYO2dCQUNDLE1BQU0sRUFBRSxDQUFDLGtoQ0FBa2hDLENBQUM7Z0JBQzVoQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN0Qzs7OztZQTlFUSxrQkFBa0I7WUFDbEIsa0JBQWtCOzs7c0JBK0V4QixLQUFLO3lCQUVMLEtBQUs7MEJBUUwsS0FBSzttQ0FRTCxLQUFLO21DQVFMLFdBQVcsU0FBQyxPQUFPLGNBQ25CLEtBQUs7OEJBUUwsS0FBSztxQkFRTCxLQUFLOzRCQXdCTCxXQUFXLFNBQUMsT0FBTzs0QkFTbkIsV0FBVyxTQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9uLCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb250YWluZXIvY29udGFpbmVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEcmFnZ2FibGVEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL25neC1kcmFnZ2FibGUuZGlyZWN0aXZlJztcblxuLyoqXG4gKiBDb21wb25lbnQgdGhhdCBhbGxvd3MgbmVzdGVkIG5neERyb3BwYWJsZSBhbmQgbmd4RHJhZ2dhYmxlc1xuICogU2hvdWxkIG9ubHkgYmUgdXNlIGluc2lkZSBhIG5neC1kbmQtY29udGFpbmVyXG4gKiBPdXRzaWRlIGEgbmd4LWRuZC1jb250YWluZXIgdXNlIG5neERyb3BwYWJsZVxuICpcbiAqIEBleHBvcnRcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWRuZC1pdGVtJyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGFpbmVyIFtuZ1N3aXRjaF09XCJ0eXBlXCI+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hDYXNlPVwiJ2FycmF5J1wiPlxuICAgIDxuZ3gtZG5kLWNvbnRhaW5lclxuICAgICAgW21vZGVsXT1cIm1vZGVsXCJcbiAgICAgIFt0ZW1wbGF0ZV09XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgW2Ryb3Bab25lXT1cImRyb3Bab25lXCJcbiAgICAgIFtkcm9wWm9uZXNdPVwiZHJvcFpvbmVzXCJcbiAgICAgIFtyZW1vdmVPblNwaWxsXT1cInJlbW92ZU9uU3BpbGxcIlxuICAgICAgW2Ryb3BwYWJsZUl0ZW1DbGFzc109XCJkcm9wcGFibGVJdGVtQ2xhc3NcIlxuICAgICAgW2Ryb3BwYWJsZUl0ZW1TdHlsZV09XCJkcm9wcGFibGVJdGVtU3R5bGVcIlxuICAgICAgW2NvcHldPVwiY29weVwiPlxuICAgIDwvbmd4LWRuZC1jb250YWluZXI+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIidvYmplY3QnXCI+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAqbmdJZj1cImNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImRhdGFcIj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhY29udGFpbmVyLnRlbXBsYXRlXCI+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwibmd4LWRuZC1jb250ZW50XCI+XG4gICAgICAgIHt7bW9kZWwubGFiZWx9fVxuICAgICAgPC9kaXY+XG4gICAgICA8bmd4LWRuZC1jb250YWluZXJcbiAgICAgICAgKm5nSWY9XCJtb2RlbC5jaGlsZHJlblwiXG4gICAgICAgIFttb2RlbF09XCJtb2RlbC5jaGlsZHJlblwiXG4gICAgICAgIFt0ZW1wbGF0ZV09XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgICBbZHJvcFpvbmVdPVwiZHJvcFpvbmVcIlxuICAgICAgICBbZHJvcFpvbmVzXT1cImRyb3Bab25lc1wiXG4gICAgICAgIFtyZW1vdmVPblNwaWxsXT1cInJlbW92ZU9uU3BpbGxcIlxuICAgICAgICBbZHJvcHBhYmxlSXRlbUNsYXNzXT1cImRyb3BwYWJsZUl0ZW1DbGFzc1wiXG4gICAgICAgIFtjb3B5XT1cImNvcHlcIj5cbiAgICAgIDwvbmd4LWRuZC1jb250YWluZXI+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIid1bmRlZmluZWQnXCI+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy1jb250YWluZXIgKm5nU3dpdGNoRGVmYXVsdD5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgICpuZ0lmPVwiY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiZGF0YVwiPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPGRpdlxuICAgICAgKm5nSWY9XCIhY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgIGNsYXNzPVwibmd4LWRuZC1jb250ZW50XCI+XG4gICAgICB7e21vZGVsfX1cbiAgICA8L2Rpdj5cbiAgPC9uZy1jb250YWluZXI+XG5cbjwvbmctY29udGFpbmVyPlxuXG5cblxuXG5cblxuXG5gLFxuICBzdHlsZXM6IFtgLm5neC1kbmQtYm94LC5uZ3gtZG5kLWl0ZW17bWFyZ2luOjEwcHg7cGFkZGluZzoxMHB4O2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuMik7dHJhbnNpdGlvbjpvcGFjaXR5IC40cyBlYXNlLWluLW91dDtib3JkZXI6MXB4IHNvbGlkICNhZGQ4ZTY7ZGlzcGxheTpibG9ja30ubmd4LWRuZC1ib3guaGFzLWhhbmRsZSBbbmd4RHJhZ0hhbmRsZV0sLm5neC1kbmQtYm94Lmhhcy1oYW5kbGUgW25neGRyYWdoYW5kbGVdLC5uZ3gtZG5kLWJveDpub3QoLmhhcy1oYW5kbGUpOm5vdCgubW92ZS1kaXNhYmxlZCksLm5neC1kbmQtaXRlbS5oYXMtaGFuZGxlIFtuZ3hEcmFnSGFuZGxlXSwubmd4LWRuZC1pdGVtLmhhcy1oYW5kbGUgW25neGRyYWdoYW5kbGVdLC5uZ3gtZG5kLWl0ZW06bm90KC5oYXMtaGFuZGxlKTpub3QoLm1vdmUtZGlzYWJsZWQpe2N1cnNvcjptb3ZlO2N1cnNvcjpncmFiO2N1cnNvcjotd2Via2l0LWdyYWJ9Lm5neC1kbmQtYm94IC5uZ3gtZG5kLWNvbnRlbnQsLm5neC1kbmQtaXRlbSAubmd4LWRuZC1jb250ZW50ey13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0ubmd4LWRuZC1ib3g6aG92ZXIsLm5neC1kbmQtaXRlbTpob3Zlcntib3JkZXI6MXB4IHNvbGlkICMwMGZ9Lm5neC1kbmQtYm94e2hlaWdodDo0MHB4O3dpZHRoOjQwcHg7bGluZS1oZWlnaHQ6MjBweDt0ZXh0LWFsaWduOmNlbnRlcjtmbG9hdDpsZWZ0fS5ndS1taXJyb3J7cG9zaXRpb246Zml4ZWQhaW1wb3J0YW50O21hcmdpbjowIWltcG9ydGFudDt6LWluZGV4Ojk5OTkhaW1wb3J0YW50O29wYWNpdHk6Ljh9Lmd1LWhpZGV7ZGlzcGxheTpub25lIWltcG9ydGFudH0uZ3UtdW5zZWxlY3RhYmxley13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZSFpbXBvcnRhbnQ7LW1vei11c2VyLXNlbGVjdDpub25lIWltcG9ydGFudDstbXMtdXNlci1zZWxlY3Q6bm9uZSFpbXBvcnRhbnQ7dXNlci1zZWxlY3Q6bm9uZSFpbXBvcnRhbnR9Lmd1LXRyYW5zaXR7b3BhY2l0eTouMn1gXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgbW9kZWw6IGFueTtcblxuICBASW5wdXQoKVxuICBnZXQgZHJvcFpvbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lIHx8IHRoaXMuY29udGFpbmVyLmRyb3Bab25lO1xuICB9XG4gIHNldCBkcm9wWm9uZSh2YWwpIHtcbiAgICB0aGlzLl9kcm9wWm9uZSA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wWm9uZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lcyB8fCB0aGlzLmNvbnRhaW5lci5kcm9wWm9uZXM7XG4gIH1cbiAgc2V0IGRyb3Bab25lcyh2YWwpIHtcbiAgICB0aGlzLl9kcm9wWm9uZXMgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgZHJvcHBhYmxlSXRlbUNsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLl9kcm9wcGFibGVJdGVtQ2xhc3MgfHwgdGhpcy5jb250YWluZXIuZHJvcHBhYmxlSXRlbUNsYXNzO1xuICB9XG4gIHNldCBkcm9wcGFibGVJdGVtQ2xhc3ModmFsKSB7XG4gICAgdGhpcy5fZHJvcHBhYmxlSXRlbUNsYXNzID0gdmFsO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZScpXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wcGFibGVJdGVtU3R5bGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3BwYWJsZUl0ZW1TdHlsZSB8fCB0aGlzLmNvbnRhaW5lci5kcm9wcGFibGVJdGVtU3R5bGU7XG4gIH1cbiAgc2V0IGRyb3BwYWJsZUl0ZW1TdHlsZSh2YWwpIHtcbiAgICB0aGlzLl9kcm9wcGFibGVJdGVtU3R5bGUgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgcmVtb3ZlT25TcGlsbCgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuX3JlbW92ZU9uU3BpbGwgPT09ICdib29sZWFuJyA/IHRoaXMuX3JlbW92ZU9uU3BpbGwgOiB0aGlzLmNvbnRhaW5lci5yZW1vdmVPblNwaWxsO1xuICB9XG4gIHNldCByZW1vdmVPblNwaWxsKHZhbCkge1xuICAgIHRoaXMuX3JlbW92ZU9uU3BpbGwgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgY29weSgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuX2NvcHkgPT09ICdib29sZWFuJyA/IHRoaXMuX2NvcHkgOiB0aGlzLmNvbnRhaW5lci5jb3B5O1xuICB9XG4gIHNldCBjb3B5KHZhbCkge1xuICAgIHRoaXMuX2NvcHkgPSB2YWw7XG4gIH1cblxuICBfY29weSA9IGZhbHNlO1xuICBfZHJvcFpvbmU6IGFueTtcbiAgX2Ryb3Bab25lczogYW55O1xuICBfZHJvcHBhYmxlSXRlbUNsYXNzOiBhbnk7XG4gIF9kcm9wcGFibGVJdGVtU3R5bGU6IGFueTtcbiAgX3JlbW92ZU9uU3BpbGwgPSBmYWxzZTtcbiAgZGF0YTogYW55O1xuXG4gIGdldCBoYXNIYW5kbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZHJhZ2dhYmxlRGlyZWN0aXZlLmhhc0hhbmRsZTtcbiAgfVxuXG4gIGdldCBtb3ZlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmRyYWdnYWJsZURpcmVjdGl2ZS5jYW5Nb3ZlKCk7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlJylcbiAgZ2V0IHN0eWxlU3RyaW5nKCkge1xuICAgIGNvbnN0IGl0ZW1TdHlsZSA9XG4gICAgICB0eXBlb2YgdGhpcy5kcm9wcGFibGVJdGVtU3R5bGUgPT09ICdmdW5jdGlvbicgPyB0aGlzLmRyb3BwYWJsZUl0ZW1TdHlsZSh0aGlzLm1vZGVsKSA6IHRoaXMuZHJvcHBhYmxlSXRlbVN0eWxlO1xuXG4gICAgY29uc3QgY2xhc3NlcyA9IFtpdGVtU3R5bGVdO1xuICAgIHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxuICBnZXQgY2xhc3NTdHJpbmcoKSB7XG4gICAgY29uc3QgaXRlbUNsYXNzID1cbiAgICAgIHR5cGVvZiB0aGlzLmRyb3BwYWJsZUl0ZW1DbGFzcyA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuZHJvcHBhYmxlSXRlbUNsYXNzKHRoaXMubW9kZWwpIDogdGhpcy5kcm9wcGFibGVJdGVtQ2xhc3M7XG5cbiAgICBjb25zdCBjbGFzc2VzID0gWyduZ3gtZG5kLWl0ZW0nLCBpdGVtQ2xhc3MgfHwgJyddO1xuICAgIGlmICh0aGlzLm1vdmVEaXNhYmxlZCkge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdtb3ZlLWRpc2FibGVkJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmhhc0hhbmRsZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdoYXMtaGFuZGxlJyk7XG4gICAgfVxuICAgIHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMubW9kZWwpKSB7XG4gICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLm1vZGVsO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIGNvbnRhaW5lcjogQ29udGFpbmVyQ29tcG9uZW50LCBwdWJsaWMgZHJhZ2dhYmxlRGlyZWN0aXZlOiBEcmFnZ2FibGVEaXJlY3RpdmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5kYXRhID0ge1xuICAgICAgbW9kZWw6IHRoaXMubW9kZWwsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBkcm9wWm9uZTogdGhpcy5kcm9wWm9uZSxcbiAgICAgIHRlbXBsYXRlOiB0aGlzLmNvbnRhaW5lci50ZW1wbGF0ZVxuICAgIH07XG4gIH1cbn1cbiJdfQ==