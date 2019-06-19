/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Component, Input, Output, ViewEncapsulation, ContentChild, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { DroppableDirective } from '../../directives/ngx-droppable.directive';
let /** @type {?} */ i = 0;
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
    get styleString() {
        const /** @type {?} */ itemStyle = typeof this.droppableItemStyle === 'function' ? this.droppableItemStyle(this.model) : this.droppableItemStyle;
        const /** @type {?} */ classes = Object.assign({}, itemStyle);
        // console.error(itemStyle);
        // console.error(classes.join(' '));
        return classes;
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
        this.droppable.drag.subscribe((v) => this.drag.emit(v));
        this.droppable.drop.subscribe((v) => this.drop.emit(v));
        this.droppable.over.subscribe((v) => this.over.emit(v));
        this.droppable.out.subscribe((v) => this.out.emit(v));
        this.droppable.remove.subscribe((v) => this.remove.emit(v));
        this.droppable.cancel.subscribe((v) => this.cancel.emit(v));
    }
}
ContainerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-dnd-container',
                template: `<div
  ngxDroppable
  [dropZone]="dropZone"
  [model]="model"
  [copy]="copy"
  [ngClass]="{ 'gu-empty': !model?.length }"
  [removeOnSpill]="removeOnSpill"
  class='ngx-dnd-container'>
  <ng-container *ngIf="model">
    <ng-container *ngFor="let item of model">
      <ngx-dnd-item
        ngxDraggable
        [model]="item"
        [dropZone]="dropZone"
        [dropZones]="dropZones"
        [copy]="copy"
        [moves]="moves"
        [removeOnSpill]="removeOnSpill"
        [droppableItemClass]="droppableItemClass"
        [ngStyle]="styleString">
      </ngx-dnd-item>
    </ng-container>
  </ng-container>
  <ng-content *ngIf="!model"></ng-content>
</div>
`,
                styles: [`.ngx-dnd-container{background-color:rgba(255,255,255,.2);border:2px solid red;margin:10px;padding:10px}.ngx-dnd-container.gu-empty{border:2px dotted red}.ngx-dnd-container:nth-child(odd){background-color:rgba(0,0,0,.2)}.ngx-dnd-container .ex-moved{background-color:#e74c3c}.ngx-dnd-container .ex-over{background-color:rgba(255,255,255,.3)}.ngx-dnd-container .handle{padding:0 5px;margin-right:5px;background-color:rgba(0,0,0,.4);cursor:move}.no-select{-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.clearfix::after{content:" ";display:block;height:0;clear:both}`],
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsWUFBWSxFQUNaLFdBQVcsRUFDWCxTQUFTLEVBQ1QsWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBRTlFLHFCQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Ozs7QUFDVixTQUFTLFNBQVM7SUFDaEIsT0FBTyxDQUFDLEVBQUUsQ0FBQztDQUNaOzs7Ozs7QUFzQ0QsTUFBTSxPQUFPLGtCQUFrQjs7b0JBRWIsS0FBSzs2QkFDSSxLQUFLO3dCQUtWLHFCQUFxQixTQUFTLEVBQUUsSUFBSTtvQkFtQ3BCLElBQUksWUFBWSxFQUFPO29CQUV2QixJQUFJLFlBQVksRUFBTztvQkFFdkIsSUFBSSxZQUFZLEVBQU87bUJBRXhCLElBQUksWUFBWSxFQUFPO3NCQUVwQixJQUFJLFlBQVksRUFBTztzQkFFdkIsSUFBSSxZQUFZLEVBQU87Ozs7O1FBMUN6RCxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUM7Ozs7OztJQUUvQyxJQUFJLFNBQVMsQ0FBQyxHQUFHO1FBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7S0FDdkI7Ozs7SUFPRCxJQUFJLFdBQVc7UUFDYix1QkFBTSxTQUFTLEdBQ2IsT0FBTyxJQUFJLENBQUMsa0JBQWtCLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7UUFFaEgsdUJBQU0sT0FBTyxxQkFDUixTQUFTLENBQ2IsQ0FBQzs7O1FBR0YsT0FBTyxPQUFPLENBQUM7S0FDaEI7Ozs7SUF5QkQsUUFBUTtRQUNOLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdEM7Ozs7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEU7OztZQXBHRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBeUJYO2dCQUNDLE1BQU0sRUFBRSxDQUFDLHFuQkFBcW5CLENBQUM7Z0JBQy9uQixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN0Qzs7OztzQkFFRSxLQUFLO3FCQUNMLEtBQUs7OEJBQ0wsS0FBSzttQ0FDTCxLQUFLO21DQUNMLEtBQUs7eUJBR0wsS0FBSzswQkFFTCxLQUFLO3NCQVFMLEtBQUs7eUJBaUJMLEtBQUssWUFDTCxZQUFZLFNBQUMsV0FBVzswQkFHeEIsS0FBSyxZQUNMLFNBQVMsU0FBQyxrQkFBa0I7cUJBRzVCLE1BQU07cUJBRU4sTUFBTTtxQkFFTixNQUFNO29CQUVOLE1BQU07dUJBRU4sTUFBTTt1QkFFTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDb250ZW50Q2hpbGQsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRHJvcHBhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9uZ3gtZHJvcHBhYmxlLmRpcmVjdGl2ZSc7XG5cbmxldCBpID0gMDtcbmZ1bmN0aW9uIGdldE5leHRJZCgpIHtcbiAgcmV0dXJuIGkrKztcbn1cblxuLyoqXG4gKiBDb21wb25lbnQgdGhhdCBhbGxvd3MgbmVzdGVkIG5neERyb3BwYWJsZSBhbmQgbmd4RHJhZ2dhYmxlc1xuICpcbiAqIEBleHBvcnRcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWRuZC1jb250YWluZXInLFxuICB0ZW1wbGF0ZTogYDxkaXZcbiAgbmd4RHJvcHBhYmxlXG4gIFtkcm9wWm9uZV09XCJkcm9wWm9uZVwiXG4gIFttb2RlbF09XCJtb2RlbFwiXG4gIFtjb3B5XT1cImNvcHlcIlxuICBbbmdDbGFzc109XCJ7ICdndS1lbXB0eSc6ICFtb2RlbD8ubGVuZ3RoIH1cIlxuICBbcmVtb3ZlT25TcGlsbF09XCJyZW1vdmVPblNwaWxsXCJcbiAgY2xhc3M9J25neC1kbmQtY29udGFpbmVyJz5cbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm1vZGVsXCI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgaXRlbSBvZiBtb2RlbFwiPlxuICAgICAgPG5neC1kbmQtaXRlbVxuICAgICAgICBuZ3hEcmFnZ2FibGVcbiAgICAgICAgW21vZGVsXT1cIml0ZW1cIlxuICAgICAgICBbZHJvcFpvbmVdPVwiZHJvcFpvbmVcIlxuICAgICAgICBbZHJvcFpvbmVzXT1cImRyb3Bab25lc1wiXG4gICAgICAgIFtjb3B5XT1cImNvcHlcIlxuICAgICAgICBbbW92ZXNdPVwibW92ZXNcIlxuICAgICAgICBbcmVtb3ZlT25TcGlsbF09XCJyZW1vdmVPblNwaWxsXCJcbiAgICAgICAgW2Ryb3BwYWJsZUl0ZW1DbGFzc109XCJkcm9wcGFibGVJdGVtQ2xhc3NcIlxuICAgICAgICBbbmdTdHlsZV09XCJzdHlsZVN0cmluZ1wiPlxuICAgICAgPC9uZ3gtZG5kLWl0ZW0+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIDwvbmctY29udGFpbmVyPlxuICA8bmctY29udGVudCAqbmdJZj1cIiFtb2RlbFwiPjwvbmctY29udGVudD5cbjwvZGl2PlxuYCxcbiAgc3R5bGVzOiBbYC5uZ3gtZG5kLWNvbnRhaW5lcntiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMjU1LDI1NSwyNTUsLjIpO2JvcmRlcjoycHggc29saWQgcmVkO21hcmdpbjoxMHB4O3BhZGRpbmc6MTBweH0ubmd4LWRuZC1jb250YWluZXIuZ3UtZW1wdHl7Ym9yZGVyOjJweCBkb3R0ZWQgcmVkfS5uZ3gtZG5kLWNvbnRhaW5lcjpudGgtY2hpbGQob2RkKXtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjIpfS5uZ3gtZG5kLWNvbnRhaW5lciAuZXgtbW92ZWR7YmFja2dyb3VuZC1jb2xvcjojZTc0YzNjfS5uZ3gtZG5kLWNvbnRhaW5lciAuZXgtb3ZlcntiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMjU1LDI1NSwyNTUsLjMpfS5uZ3gtZG5kLWNvbnRhaW5lciAuaGFuZGxle3BhZGRpbmc6MCA1cHg7bWFyZ2luLXJpZ2h0OjVweDtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjQpO2N1cnNvcjptb3ZlfS5uby1zZWxlY3R7LXdlYmtpdC10b3VjaC1jYWxsb3V0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lfS5jbGVhcmZpeDo6YWZ0ZXJ7Y29udGVudDpcIiBcIjtkaXNwbGF5OmJsb2NrO2hlaWdodDowO2NsZWFyOmJvdGh9YF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgbW9kZWw6IGFueTtcbiAgQElucHV0KCkgY29weSA9IGZhbHNlO1xuICBASW5wdXQoKSByZW1vdmVPblNwaWxsID0gZmFsc2U7XG4gIEBJbnB1dCgpIGRyb3BwYWJsZUl0ZW1DbGFzczogc3RyaW5nIHwgKChvOiBhbnkpID0+IGFueSk7XG4gIEBJbnB1dCgpIGRyb3BwYWJsZUl0ZW1TdHlsZTogc3RyaW5nIHwgKChvOiBhbnkpID0+IGFueSk7XG5cblxuICBASW5wdXQoKSBkcm9wWm9uZSA9IGBAQERlZmF1bHREcm9wWm9uZS0ke2dldE5leHRJZCgpfUBAYDtcblxuICBASW5wdXQoKVxuICBnZXQgZHJvcFpvbmVzKCkge1xuICAgIHJldHVybiB0aGlzLl9kcm9wWm9uZXMgfHwgdGhpcy5fZGVmYXVsdFpvbmVzO1xuICB9XG4gIHNldCBkcm9wWm9uZXModmFsKSB7XG4gICAgdGhpcy5fZHJvcFpvbmVzID0gdmFsO1xuICB9XG5cbiAgQElucHV0KCkgbW92ZXM6IChtb2RlbDogYW55LCBzb3VyY2U6IGFueSwgaGFuZGxlOiBhbnksIHNpYmxpbmc6IGFueSkgPT4gYm9vbGVhbjtcblxuICAvLyBASW5wdXQoKSBjbGFzc2VzOiBhbnkgPSB7fTtcbiAgLy8gQElucHV0KCkgZHJhZ3VsYU9wdGlvbnM6IGFueTtcblxuICBnZXQgc3R5bGVTdHJpbmcoKSB7XG4gICAgY29uc3QgaXRlbVN0eWxlID1cbiAgICAgIHR5cGVvZiB0aGlzLmRyb3BwYWJsZUl0ZW1TdHlsZSA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuZHJvcHBhYmxlSXRlbVN0eWxlKHRoaXMubW9kZWwpIDogdGhpcy5kcm9wcGFibGVJdGVtU3R5bGU7XG5cbiAgICBjb25zdCBjbGFzc2VzID0ge1xuICAgICAgLi4uaXRlbVN0eWxlXG4gICAgfTtcbiAgICAvLyBjb25zb2xlLmVycm9yKGl0ZW1TdHlsZSk7XG4gICAgLy8gY29uc29sZS5lcnJvcihjbGFzc2VzLmpvaW4oJyAnKSk7XG4gICAgcmV0dXJuIGNsYXNzZXM7XG4gIH1cblxuICBASW5wdXQoKVxuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKVxuICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXQoKVxuICBAVmlld0NoaWxkKERyb3BwYWJsZURpcmVjdGl2ZSlcbiAgZHJvcHBhYmxlOiBhbnk7XG5cbiAgQE91dHB1dCgpIGRyb3A6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIGRyYWc6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIG92ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIG91dDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgcmVtb3ZlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBjYW5jZWw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgX2Ryb3Bab25lczogc3RyaW5nW107XG4gIF9kZWZhdWx0Wm9uZXM6IHN0cmluZ1tdO1xuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2RlZmF1bHRab25lcyA9IFt0aGlzLmRyb3Bab25lXTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmRyb3BwYWJsZS5kcmFnLnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLmRyYWcuZW1pdCh2KSk7XG4gICAgdGhpcy5kcm9wcGFibGUuZHJvcC5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5kcm9wLmVtaXQodikpO1xuICAgIHRoaXMuZHJvcHBhYmxlLm92ZXIuc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMub3Zlci5lbWl0KHYpKTtcbiAgICB0aGlzLmRyb3BwYWJsZS5vdXQuc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMub3V0LmVtaXQodikpO1xuICAgIHRoaXMuZHJvcHBhYmxlLnJlbW92ZS5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5yZW1vdmUuZW1pdCh2KSk7XG4gICAgdGhpcy5kcm9wcGFibGUuY2FuY2VsLnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLmNhbmNlbC5lbWl0KHYpKTtcbiAgfVxufVxuIl19