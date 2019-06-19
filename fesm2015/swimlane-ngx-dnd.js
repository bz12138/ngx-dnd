import { Injectable, NgModule, Directive, ElementRef, HostListener, Input, Output, EventEmitter, Renderer2, Component, ViewEncapsulation, ContentChild, TemplateRef, ViewChild, HostBinding, defineInjectable } from '@angular/core';
import * as dragulaNamespace from '@swimlane/dragula';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// see https://github.com/dherges/ng-packagr/issues/217
const /** @type {?} */ dragula = dragulaNamespace;
/**
 * Central service that handles all events
 *
 * @export
 */
class DrakeStoreService {
    constructor() {
        this.droppableMap = new WeakMap();
        this.draggableMap = new WeakMap();
        this.dragulaOptions = this.createDrakeOptions();
        this.drake = dragula([], this.dragulaOptions);
        this.registerEvents();
    }
    /**
     * @param {?} droppable
     * @return {?}
     */
    register(droppable) {
        this.droppableMap.set(droppable.container, droppable);
        this.drake.containers.push(droppable.container);
    }
    /**
     * @param {?} droppable
     * @return {?}
     */
    remove(droppable) {
        this.droppableMap.delete(droppable.container);
        const /** @type {?} */ idx = this.drake.containers.indexOf(droppable.container);
        if (idx > -1) {
            this.drake.containers.splice(idx, 1);
        }
    }
    /**
     * @param {?} draggable
     * @return {?}
     */
    registerDraggable(draggable) {
        this.draggableMap.set(draggable.element, draggable);
    }
    /**
     * @param {?} draggable
     * @return {?}
     */
    removeDraggable(draggable) {
        this.draggableMap.delete(draggable.element);
    }
    /**
     * @return {?}
     */
    createDrakeOptions() {
        const /** @type {?} */ accepts = (el, target /*, source: any, sibling: any */) => {
            if (el.contains(target)) {
                return false;
            }
            const /** @type {?} */ elementComponent = this.draggableMap.get(el);
            const /** @type {?} */ targetComponent = this.droppableMap.get(target);
            if (elementComponent && targetComponent) {
                return elementComponent.dropZones.includes(targetComponent.dropZone);
            }
            return true;
        };
        const /** @type {?} */ copy = (_, source) => {
            const /** @type {?} */ sourceComponent = this.droppableMap.get(source);
            if (sourceComponent) {
                return sourceComponent.copy;
            }
            return false;
        };
        const /** @type {?} */ moves = (el, source, handle, sibling) => {
            const /** @type {?} */ elementComponent = this.draggableMap.get(el);
            if (elementComponent) {
                return elementComponent.moves(source, handle, sibling);
            }
            return true;
        };
        return { accepts, copy, moves, revertOnSpill: true, direction: 'vertical' };
    }
    /**
     * @return {?}
     */
    registerEvents() {
        let /** @type {?} */ dragElm;
        let /** @type {?} */ draggedItem;
        this.drake.on('drag', (el, source) => {
            draggedItem = undefined;
            dragElm = el;
            if (!el || !source) {
                return;
            }
            if (this.draggableMap.has(el)) {
                const /** @type {?} */ elementComponent = this.draggableMap.get(el);
                draggedItem = elementComponent.model;
                elementComponent.drag.emit({
                    type: 'drag',
                    el,
                    source,
                    value: draggedItem
                });
            }
            if (this.droppableMap.has(source)) {
                const /** @type {?} */ sourceComponent = this.droppableMap.get(source);
                this.dragulaOptions.removeOnSpill = sourceComponent.removeOnSpill;
                sourceComponent.drag.emit({
                    type: 'drag',
                    el,
                    source,
                    sourceComponent,
                    value: draggedItem
                });
            }
        });
        this.drake.on('drop', (el, target, source) => {
            const /** @type {?} */ targetComponent = this.droppableMap.get(target);
            if (!targetComponent) {
                // not a target, abort
                return;
            }
            let /** @type {?} */ dropElmModel = draggedItem;
            const /** @type {?} */ dropIndex = Array.prototype.indexOf.call(target.children, el);
            if (dropIndex < 0) {
                // dropIndex is bad... cancel
                this.drake.cancel(true);
                return;
            }
            const /** @type {?} */ sourceComponent = this.droppableMap.get(source);
            if (sourceComponent) {
                const /** @type {?} */ sourceModel = sourceComponent.model;
                const /** @type {?} */ targetModel = targetComponent.model;
                const /** @type {?} */ hasDragModel = !!(sourceModel && draggedItem);
                const /** @type {?} */ dragIndex = hasDragModel ? sourceModel.indexOf(draggedItem) : -1;
                if (hasDragModel && dragIndex < 0) {
                    // dragIndex is bad... cancel
                    this.drake.cancel(true);
                    return;
                }
                if (targetModel) {
                    const /** @type {?} */ reorder = dragIndex > -1 && sourceModel && target === source;
                    const /** @type {?} */ copy = !sourceModel || dragElm !== el;
                    if (reorder) {
                        sourceModel.splice(dropIndex, 0, sourceModel.splice(dragIndex, 1)[0]);
                    }
                    else {
                        if (el.parentNode === target) {
                            target.removeChild(el);
                        }
                        if (copy) {
                            dropElmModel = JSON.parse(JSON.stringify(dropElmModel));
                        }
                        else {
                            if (el.parentNode !== source) {
                                // add element back, let angular remove it
                                this.drake.cancel(true);
                            }
                            sourceModel.splice(dragIndex, 1);
                        }
                        targetModel.splice(dropIndex, 0, dropElmModel);
                    }
                }
            }
            targetComponent.drop.emit({
                type: 'drop',
                el,
                source,
                value: dropElmModel,
                dropIndex
            });
        });
        this.drake.on('remove', (el, container, source) => {
            if (this.droppableMap.has(source)) {
                const /** @type {?} */ sourceComponent = this.droppableMap.get(source);
                const /** @type {?} */ sourceModel = sourceComponent.model;
                const /** @type {?} */ dragIndex = draggedItem && sourceModel ? sourceModel.indexOf(draggedItem) : -1;
                if (dragIndex > -1) {
                    if (el.parentNode !== source) {
                        // add element back, let angular remove it
                        source.appendChild(el);
                    }
                    sourceModel.splice(dragIndex, 1);
                }
                sourceComponent.remove.emit({
                    type: 'remove',
                    el,
                    container,
                    source,
                    value: draggedItem
                });
            }
        });
        this.drake.on('cancel', (el, container, source) => {
            if (this.droppableMap.has(container)) {
                const /** @type {?} */ containerComponent = this.droppableMap.get(container);
                containerComponent.cancel.emit({
                    type: 'cancel',
                    el,
                    container,
                    source,
                    value: draggedItem
                });
            }
        });
        this.drake.on('over', (el, container, source) => {
            if (this.droppableMap.has(container)) {
                const /** @type {?} */ containerComponent = this.droppableMap.get(container);
                containerComponent.over.emit({
                    type: 'over',
                    el,
                    container,
                    source,
                    value: draggedItem
                });
            }
        });
        this.drake.on('out', (el, container, source) => {
            if (this.droppableMap.has(container)) {
                const /** @type {?} */ containerComponent = this.droppableMap.get(container);
                containerComponent.out.emit({
                    type: 'out',
                    el,
                    container,
                    source,
                    value: draggedItem
                });
            }
        });
    }
}
DrakeStoreService.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
DrakeStoreService.ctorParameters = () => [];
/** @nocollapse */ DrakeStoreService.ngInjectableDef = defineInjectable({ factory: function DrakeStoreService_Factory() { return new DrakeStoreService(); }, token: DrakeStoreService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
let /** @type {?} */ i = 10000;
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
class DroppableDirective {
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
        this.over.subscribe(() => {
            this.renderer.addClass(this.container, 'gu-over');
        });
        this.out.subscribe(() => {
            this.renderer.removeClass(this.container, 'gu-over');
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.drakesService.remove(this);
    }
}
DroppableDirective.decorators = [
    { type: Directive, args: [{ selector: '[ngxDroppable]' },] },
];
/** @nocollapse */
DroppableDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: DrakeStoreService, },
];
DroppableDirective.propDecorators = {
    "model": [{ type: Input },],
    "copy": [{ type: Input },],
    "removeOnSpill": [{ type: Input },],
    "ngxDroppable": [{ type: Input },],
    "drop": [{ type: Output },],
    "drag": [{ type: Output },],
    "over": [{ type: Output },],
    "out": [{ type: Output },],
    "remove": [{ type: Output },],
    "cancel": [{ type: Output },],
    "dropZone": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Adds properties and events to draggable elements
 *
 * @export
 */
class DraggableDirective {
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
            this.touchTimeout = setTimeout(() => {
                this.dragDelayed = false;
            }, this.dragDelay);
        }
    }
    /**
     * @return {?}
     */
    onUp() {
        if (this._moves) {
            clearTimeout(/** @type {?} */ (this.touchTimeout));
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
        const /** @type {?} */ nativeElement = this.el.nativeElement;
        const /** @type {?} */ handles = nativeElement.querySelectorAll('[ngxdraghandle]');
        this.handles = Array.from(handles).filter((h) => findFirstDraggableParent(h) === nativeElement);
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
        return this.hasHandle ? this.handles.some(h => handelFor(handle, h)) : true;
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
    { type: Directive, args: [{ selector: '[ngxDraggable]' },] },
];
/** @nocollapse */
DraggableDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: DrakeStoreService, },
    { type: DroppableDirective, },
];
DraggableDirective.propDecorators = {
    "ngxDraggable": [{ type: Input },],
    "model": [{ type: Input },],
    "dropZones": [{ type: Input },],
    "_moves": [{ type: Input, args: ['moves',] },],
    "drag": [{ type: Output },],
    "onMove": [{ type: HostListener, args: ['touchmove', ['$event'],] },],
    "onDown": [{ type: HostListener, args: ['touchstart',] },],
    "onUp": [{ type: HostListener, args: ['touchend',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Adds properties and events to drag handle elements
 *
 * @export
 */
class DragHandleDirective {
}
DragHandleDirective.decorators = [
    { type: Directive, args: [{ selector: '[ngxDragHandle]' },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
let /** @type {?} */ i$1 = 0;
/**
 * @return {?}
 */
function getNextId$1() {
    return i$1++;
}
/**
 * Component that allows nested ngxDroppable and ngxDraggables
 *
 * @export
 */
class ContainerComponent {
    constructor() {
        this.copy = false;
        this.removeOnSpill = false;
        this.dropZone = `@@DefaultDropZone-${getNextId$1()}@@`;
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
        [droppableItemStyle]="droppableItemStyle">
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Component that allows nested ngxDroppable and ngxDraggables
 * Should only be use inside a ngx-dnd-container
 * Outside a ngx-dnd-container use ngxDroppable
 *
 * @export
 */
class ItemComponent {
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
    "droppableItemStyle": [{ type: Input },],
    "removeOnSpill": [{ type: Input },],
    "copy": [{ type: Input },],
    "styleString": [{ type: HostBinding, args: ['style',] },],
    "classString": [{ type: HostBinding, args: ['class',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const /** @type {?} */ components = [ContainerComponent, ItemComponent];
const /** @type {?} */ directives = [DraggableDirective, DroppableDirective, DragHandleDirective];
class NgxDnDModule {
}
NgxDnDModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                declarations: [...components, ...directives],
                exports: [...components, ...directives],
                providers: [DrakeStoreService]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { DraggableDirective, DroppableDirective, DragHandleDirective, ItemComponent, ContainerComponent, DrakeStoreService, NgxDnDModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpbWxhbmUtbmd4LWRuZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQHN3aW1sYW5lL25neC1kbmQvbGliL3NlcnZpY2VzL2RyYWtlLXN0b3JlLnNlcnZpY2UudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kL2xpYi9kaXJlY3RpdmVzL25neC1kcm9wcGFibGUuZGlyZWN0aXZlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWRuZC9saWIvZGlyZWN0aXZlcy9uZ3gtZHJhZ2dhYmxlLmRpcmVjdGl2ZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1kbmQvbGliL2RpcmVjdGl2ZXMvbmd4LWRyYWctaGFuZGxlLmRpcmVjdGl2ZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1kbmQvbGliL2NvbXBvbmVudHMvY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kL2xpYi9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kL2xpYi9uZ3gtZG5kLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCAqIGFzIGRyYWd1bGFOYW1lc3BhY2UgZnJvbSAnQHN3aW1sYW5lL2RyYWd1bGEnO1xuaW1wb3J0IHsgRHJvcHBhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9uZ3gtZHJvcHBhYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEcmFnZ2FibGVEaXJlY3RpdmUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL25neC1kcmFnZ2FibGUuZGlyZWN0aXZlJztcblxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kaGVyZ2VzL25nLXBhY2thZ3IvaXNzdWVzLzIxN1xuY29uc3QgZHJhZ3VsYSA9IGRyYWd1bGFOYW1lc3BhY2U7XG5cbi8qKlxuICogQ2VudHJhbCBzZXJ2aWNlIHRoYXQgaGFuZGxlcyBhbGwgZXZlbnRzXG4gKlxuICogQGV4cG9ydFxuICovXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIERyYWtlU3RvcmVTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBkcm9wcGFibGVNYXAgPSBuZXcgV2Vha01hcDxhbnksIERyb3BwYWJsZURpcmVjdGl2ZT4oKTtcbiAgcHJpdmF0ZSBkcmFnZ2FibGVNYXAgPSBuZXcgV2Vha01hcDxhbnksIERyYWdnYWJsZURpcmVjdGl2ZT4oKTtcbiAgcHJpdmF0ZSBkcmFndWxhT3B0aW9uczogZHJhZ3VsYU5hbWVzcGFjZS5EcmFndWxhT3B0aW9ucztcbiAgcHJpdmF0ZSBkcmFrZTogZHJhZ3VsYU5hbWVzcGFjZS5EcmFrZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRyYWd1bGFPcHRpb25zID0gdGhpcy5jcmVhdGVEcmFrZU9wdGlvbnMoKTtcbiAgICB0aGlzLmRyYWtlID0gZHJhZ3VsYShbXSwgdGhpcy5kcmFndWxhT3B0aW9ucyk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xuICB9XG5cbiAgcmVnaXN0ZXIoZHJvcHBhYmxlOiBEcm9wcGFibGVEaXJlY3RpdmUpIHtcbiAgICB0aGlzLmRyb3BwYWJsZU1hcC5zZXQoZHJvcHBhYmxlLmNvbnRhaW5lciwgZHJvcHBhYmxlKTtcbiAgICB0aGlzLmRyYWtlLmNvbnRhaW5lcnMucHVzaChkcm9wcGFibGUuY29udGFpbmVyKTtcbiAgfVxuXG4gIHJlbW92ZShkcm9wcGFibGU6IERyb3BwYWJsZURpcmVjdGl2ZSkge1xuICAgIHRoaXMuZHJvcHBhYmxlTWFwLmRlbGV0ZShkcm9wcGFibGUuY29udGFpbmVyKTtcbiAgICBjb25zdCBpZHggPSB0aGlzLmRyYWtlLmNvbnRhaW5lcnMuaW5kZXhPZihkcm9wcGFibGUuY29udGFpbmVyKTtcbiAgICBpZiAoaWR4ID4gLTEpIHtcbiAgICAgIHRoaXMuZHJha2UuY29udGFpbmVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3RlckRyYWdnYWJsZShkcmFnZ2FibGU6IERyYWdnYWJsZURpcmVjdGl2ZSkge1xuICAgIHRoaXMuZHJhZ2dhYmxlTWFwLnNldChkcmFnZ2FibGUuZWxlbWVudCwgZHJhZ2dhYmxlKTtcbiAgfVxuXG4gIHJlbW92ZURyYWdnYWJsZShkcmFnZ2FibGU6IERyYWdnYWJsZURpcmVjdGl2ZSkge1xuICAgIHRoaXMuZHJhZ2dhYmxlTWFwLmRlbGV0ZShkcmFnZ2FibGUuZWxlbWVudCk7XG4gIH1cblxuICBjcmVhdGVEcmFrZU9wdGlvbnMoKTogZHJhZ3VsYU5hbWVzcGFjZS5EcmFndWxhT3B0aW9ucyB7XG4gICAgY29uc3QgYWNjZXB0cyA9IChlbDogYW55LCB0YXJnZXQ6IGFueSAvKiwgc291cmNlOiBhbnksIHNpYmxpbmc6IGFueSAqLykgPT4ge1xuICAgICAgaWYgKGVsLmNvbnRhaW5zKHRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY29uc3QgZWxlbWVudENvbXBvbmVudCA9IHRoaXMuZHJhZ2dhYmxlTWFwLmdldChlbCk7XG4gICAgICBjb25zdCB0YXJnZXRDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQodGFyZ2V0KTtcbiAgICAgIGlmIChlbGVtZW50Q29tcG9uZW50ICYmIHRhcmdldENvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudENvbXBvbmVudC5kcm9wWm9uZXMuaW5jbHVkZXModGFyZ2V0Q29tcG9uZW50LmRyb3Bab25lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICBjb25zdCBjb3B5ID0gKF86IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChzb3VyY2UpO1xuICAgICAgaWYgKHNvdXJjZUNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gc291cmNlQ29tcG9uZW50LmNvcHk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGNvbnN0IG1vdmVzID0gKGVsPzogYW55LCBzb3VyY2U/OiBhbnksIGhhbmRsZT86IGFueSwgc2libGluZz86IGFueSkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudENvbXBvbmVudCA9IHRoaXMuZHJhZ2dhYmxlTWFwLmdldChlbCk7XG4gICAgICBpZiAoZWxlbWVudENvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudENvbXBvbmVudC5tb3Zlcyhzb3VyY2UsIGhhbmRsZSwgc2libGluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHsgYWNjZXB0cywgY29weSwgbW92ZXMsIHJldmVydE9uU3BpbGw6IHRydWUsIGRpcmVjdGlvbjogJ3ZlcnRpY2FsJyB9O1xuICB9XG5cbiAgcmVnaXN0ZXJFdmVudHMoKTogdm9pZCB7XG4gICAgbGV0IGRyYWdFbG06IGFueTtcbiAgICBsZXQgZHJhZ2dlZEl0ZW06IGFueTtcblxuICAgIHRoaXMuZHJha2Uub24oJ2RyYWcnLCAoZWw6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGRyYWdnZWRJdGVtID0gdW5kZWZpbmVkO1xuICAgICAgZHJhZ0VsbSA9IGVsO1xuXG4gICAgICBpZiAoIWVsIHx8ICFzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5kcmFnZ2FibGVNYXAuaGFzKGVsKSkge1xuICAgICAgICBjb25zdCBlbGVtZW50Q29tcG9uZW50ID0gdGhpcy5kcmFnZ2FibGVNYXAuZ2V0KGVsKTtcbiAgICAgICAgZHJhZ2dlZEl0ZW0gPSBlbGVtZW50Q29tcG9uZW50Lm1vZGVsO1xuXG4gICAgICAgIGVsZW1lbnRDb21wb25lbnQuZHJhZy5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnZHJhZycsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZHJvcHBhYmxlTWFwLmhhcyhzb3VyY2UpKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZUNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChzb3VyY2UpO1xuICAgICAgICB0aGlzLmRyYWd1bGFPcHRpb25zLnJlbW92ZU9uU3BpbGwgPSBzb3VyY2VDb21wb25lbnQucmVtb3ZlT25TcGlsbDtcblxuICAgICAgICBzb3VyY2VDb21wb25lbnQuZHJhZy5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnZHJhZycsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHNvdXJjZUNvbXBvbmVudCxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdkcm9wJywgKGVsOiBhbnksIHRhcmdldDogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgY29uc3QgdGFyZ2V0Q29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KHRhcmdldCk7XG5cbiAgICAgIGlmICghdGFyZ2V0Q29tcG9uZW50KSB7XG4gICAgICAgIC8vIG5vdCBhIHRhcmdldCwgYWJvcnRcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgZHJvcEVsbU1vZGVsID0gZHJhZ2dlZEl0ZW07XG4gICAgICBjb25zdCBkcm9wSW5kZXggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHRhcmdldC5jaGlsZHJlbiwgZWwpO1xuXG4gICAgICBpZiAoZHJvcEluZGV4IDwgMCkge1xuICAgICAgICAvLyBkcm9wSW5kZXggaXMgYmFkLi4uIGNhbmNlbFxuICAgICAgICB0aGlzLmRyYWtlLmNhbmNlbCh0cnVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzb3VyY2VDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoc291cmNlKTtcblxuICAgICAgaWYgKHNvdXJjZUNvbXBvbmVudCkge1xuICAgICAgICBjb25zdCBzb3VyY2VNb2RlbCA9IHNvdXJjZUNvbXBvbmVudC5tb2RlbDtcbiAgICAgICAgY29uc3QgdGFyZ2V0TW9kZWwgPSB0YXJnZXRDb21wb25lbnQubW9kZWw7XG5cbiAgICAgICAgY29uc3QgaGFzRHJhZ01vZGVsID0gISEoc291cmNlTW9kZWwgJiYgZHJhZ2dlZEl0ZW0pO1xuICAgICAgICBjb25zdCBkcmFnSW5kZXggPSBoYXNEcmFnTW9kZWwgPyBzb3VyY2VNb2RlbC5pbmRleE9mKGRyYWdnZWRJdGVtKSA6IC0xO1xuICAgICAgICBpZiAoaGFzRHJhZ01vZGVsICYmIGRyYWdJbmRleCA8IDApIHtcbiAgICAgICAgICAvLyBkcmFnSW5kZXggaXMgYmFkLi4uIGNhbmNlbFxuICAgICAgICAgIHRoaXMuZHJha2UuY2FuY2VsKHRydWUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YXJnZXRNb2RlbCkge1xuICAgICAgICAgIGNvbnN0IHJlb3JkZXIgPSBkcmFnSW5kZXggPiAtMSAmJiBzb3VyY2VNb2RlbCAmJiB0YXJnZXQgPT09IHNvdXJjZTtcbiAgICAgICAgICBjb25zdCBjb3B5ID0gIXNvdXJjZU1vZGVsIHx8IGRyYWdFbG0gIT09IGVsO1xuICAgICAgICAgIGlmIChyZW9yZGVyKSB7XG4gICAgICAgICAgICBzb3VyY2VNb2RlbC5zcGxpY2UoZHJvcEluZGV4LCAwLCBzb3VyY2VNb2RlbC5zcGxpY2UoZHJhZ0luZGV4LCAxKVswXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChlbC5wYXJlbnROb2RlID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvcHkpIHtcbiAgICAgICAgICAgICAgZHJvcEVsbU1vZGVsID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkcm9wRWxtTW9kZWwpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChlbC5wYXJlbnROb2RlICE9PSBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgZWxlbWVudCBiYWNrLCBsZXQgYW5ndWxhciByZW1vdmUgaXRcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWtlLmNhbmNlbCh0cnVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzb3VyY2VNb2RlbC5zcGxpY2UoZHJhZ0luZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhcmdldE1vZGVsLnNwbGljZShkcm9wSW5kZXgsIDAsIGRyb3BFbG1Nb2RlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRhcmdldENvbXBvbmVudC5kcm9wLmVtaXQoe1xuICAgICAgICB0eXBlOiAnZHJvcCcsXG4gICAgICAgIGVsLFxuICAgICAgICBzb3VyY2UsXG4gICAgICAgIHZhbHVlOiBkcm9wRWxtTW9kZWwsXG4gICAgICAgIGRyb3BJbmRleFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdyZW1vdmUnLCAoZWw6IGFueSwgY29udGFpbmVyOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBpZiAodGhpcy5kcm9wcGFibGVNYXAuaGFzKHNvdXJjZSkpIHtcbiAgICAgICAgY29uc3Qgc291cmNlQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KHNvdXJjZSk7XG4gICAgICAgIGNvbnN0IHNvdXJjZU1vZGVsID0gc291cmNlQ29tcG9uZW50Lm1vZGVsO1xuXG4gICAgICAgIGNvbnN0IGRyYWdJbmRleCA9IGRyYWdnZWRJdGVtICYmIHNvdXJjZU1vZGVsID8gc291cmNlTW9kZWwuaW5kZXhPZihkcmFnZ2VkSXRlbSkgOiAtMTtcblxuICAgICAgICBpZiAoZHJhZ0luZGV4ID4gLTEpIHtcbiAgICAgICAgICBpZiAoZWwucGFyZW50Tm9kZSAhPT0gc291cmNlKSB7XG4gICAgICAgICAgICAvLyBhZGQgZWxlbWVudCBiYWNrLCBsZXQgYW5ndWxhciByZW1vdmUgaXRcbiAgICAgICAgICAgIHNvdXJjZS5hcHBlbmRDaGlsZChlbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNvdXJjZU1vZGVsLnNwbGljZShkcmFnSW5kZXgsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgc291cmNlQ29tcG9uZW50LnJlbW92ZS5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAncmVtb3ZlJyxcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZHJha2Uub24oJ2NhbmNlbCcsIChlbDogYW55LCBjb250YWluZXI6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGlmICh0aGlzLmRyb3BwYWJsZU1hcC5oYXMoY29udGFpbmVyKSkge1xuICAgICAgICBjb25zdCBjb250YWluZXJDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoY29udGFpbmVyKTtcbiAgICAgICAgY29udGFpbmVyQ29tcG9uZW50LmNhbmNlbC5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnY2FuY2VsJyxcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZHJha2Uub24oJ292ZXInLCAoZWw6IGFueSwgY29udGFpbmVyOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBpZiAodGhpcy5kcm9wcGFibGVNYXAuaGFzKGNvbnRhaW5lcikpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnRhaW5lckNvbXBvbmVudC5vdmVyLmVtaXQoe1xuICAgICAgICAgIHR5cGU6ICdvdmVyJyxcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZHJha2Uub24oJ291dCcsIChlbDogYW55LCBjb250YWluZXI6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGlmICh0aGlzLmRyb3BwYWJsZU1hcC5oYXMoY29udGFpbmVyKSkge1xuICAgICAgICBjb25zdCBjb250YWluZXJDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoY29udGFpbmVyKTtcbiAgICAgICAgY29udGFpbmVyQ29tcG9uZW50Lm91dC5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnb3V0JyxcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBSZW5kZXJlcjJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IERyYWtlU3RvcmVTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvZHJha2Utc3RvcmUuc2VydmljZSc7XG5cbmxldCBpID0gMTAwMDA7XG5mdW5jdGlvbiBnZXROZXh0SWQoKSB7XG4gIHJldHVybiBpKys7XG59XG5cbi8qKlxuICogTWFrZXMgdGhlIGNvbnRhaW5lciBkcm9wcGFibGUgYW5kIGNoaWxkcmVuIGRyYWdnYWJsZS5cbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZ3hEcm9wcGFibGVdJyB9KVxuZXhwb3J0IGNsYXNzIERyb3BwYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgbW9kZWw6IGFueTtcbiAgQElucHV0KCkgY29weSA9IGZhbHNlO1xuICBASW5wdXQoKSByZW1vdmVPblNwaWxsID0gZmFsc2U7XG4gIEBJbnB1dCgpIG5neERyb3BwYWJsZTogc3RyaW5nO1xuXG4gIEBPdXRwdXQoKSBkcm9wOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBkcmFnOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBvdmVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBvdXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIHJlbW92ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgY2FuY2VsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGdldCBjb250YWluZXIoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGRyb3Bab25lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lIHx8IHRoaXMubmd4RHJvcHBhYmxlIHx8IHRoaXMuZGVmYXVsdFpvbmU7XG4gIH1cbiAgc2V0IGRyb3Bab25lKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fZHJvcFpvbmUgPSB2YWw7XG4gIH1cblxuICBkZWZhdWx0Wm9uZTogc3RyaW5nO1xuICBfZHJvcFpvbmU6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgZHJha2VzU2VydmljZTogRHJha2VTdG9yZVNlcnZpY2UpIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5kZWZhdWx0Wm9uZSA9IGBAQERlZmF1bHREcm9wWm9uZS0ke2dldE5leHRJZCgpfUBAYDtcbiAgICB0aGlzLmRyYWtlc1NlcnZpY2UucmVnaXN0ZXIodGhpcyk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5vdmVyLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuY29udGFpbmVyLCAnZ3Utb3ZlcicpO1xuICAgIH0pO1xuICAgIHRoaXMub3V0LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuY29udGFpbmVyLCAnZ3Utb3ZlcicpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kcmFrZXNTZXJ2aWNlLnJlbW92ZSh0aGlzKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRHJvcHBhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi9uZ3gtZHJvcHBhYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEcmFrZVN0b3JlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2RyYWtlLXN0b3JlLnNlcnZpY2UnO1xuXG4vKipcbiAqIEFkZHMgcHJvcGVydGllcyBhbmQgZXZlbnRzIHRvIGRyYWdnYWJsZSBlbGVtZW50c1xuICpcbiAqIEBleHBvcnRcbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25neERyYWdnYWJsZV0nIH0pXG5leHBvcnQgY2xhc3MgRHJhZ2dhYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBuZ3hEcmFnZ2FibGU6IHN0cmluZ1tdO1xuICBASW5wdXQoKSBtb2RlbDogYW55O1xuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wWm9uZXMoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcFpvbmVzIHx8IHRoaXMubmd4RHJhZ2dhYmxlIHx8IHRoaXMuX3BhcmVudERyb3B6b25lcztcbiAgfVxuICBzZXQgZHJvcFpvbmVzKHZhbDogYW55KSB7XG4gICAgdGhpcy5fZHJvcFpvbmVzID0gdmFsO1xuICB9XG5cbiAgQElucHV0KCdtb3ZlcycpIF9tb3ZlczogYm9vbGVhbiB8ICgoLi4uYXJnczogYW55W10pID0+IGFueSkgPSB0cnVlO1xuXG4gIC8qXG4gIENvbnRlbnRDaGlsZHJlbiBkb2Vzbid0IGdldCBjaGlsZHJlbiBjcmVhdGVkIHdpdGggTmdUZW1wbGF0ZU91dGxldFxuICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTQ4NDJcbiAgSW1wbGVtZW50ZWQgdmlhIHVwZGF0ZUVsZW1lbnRzIG1ldGhvZFxuXG4gIEBDb250ZW50Q2hpbGRyZW4oRHJhZ0hhbmRsZURpcmVjdGl2ZSwge2Rlc2NlbmRhbnRzOiB0cnVlfSlcbiAgaGFuZGxlc0xpc3Q6IFF1ZXJ5TGlzdDxEcmFnSGFuZGxlRGlyZWN0aXZlPjsgKi9cblxuICBoYW5kbGVzOiBhbnlbXSA9IFtdO1xuXG4gIGdldCBoYXNIYW5kbGUoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5oYW5kbGVzLmxlbmd0aDtcbiAgfVxuXG4gIEBPdXRwdXQoKSBkcmFnOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGRyYWdEZWxheTogbnVtYmVyID0gMjAwOyAvLyBtaWxsaXNlY29uZHNcbiAgZHJhZ0RlbGF5ZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIHRvdWNoVGltZW91dDogYW55O1xuXG4gIGdldCBlbGVtZW50KCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIF9kcm9wWm9uZXM6IHN0cmluZ1tdO1xuICBfcGFyZW50RHJvcHpvbmVzOiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgZHJha2VzU2VydmljZTogRHJha2VTdG9yZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBkcm9wcGFibGVEaXJlY3RpdmU6IERyb3BwYWJsZURpcmVjdGl2ZVxuICApIHt9XG5cbiAgLy8gRnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2JldmFjcXVhL2RyYWd1bGEvaXNzdWVzLzI4OSNpc3N1ZWNvbW1lbnQtMjc3MTQzMTcyXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNobW92ZScsIFsnJGV2ZW50J10pXG4gIG9uTW92ZShlOiBFdmVudCkge1xuICAgIGlmICghdGhpcy5fbW92ZXMgfHwgdGhpcy5kcmFnRGVsYXllZCkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRvdWNoVGltZW91dCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigndG91Y2hzdGFydCcpXG4gIG9uRG93bigpIHtcbiAgICBpZiAodGhpcy5fbW92ZXMpIHtcbiAgICAgIHRoaXMudG91Y2hUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuZHJhZ0RlbGF5ZWQgPSBmYWxzZTtcbiAgICAgIH0sIHRoaXMuZHJhZ0RlbGF5KTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd0b3VjaGVuZCcpXG4gIG9uVXAoKSB7XG4gICAgaWYgKHRoaXMuX21vdmVzKSB7XG4gICAgICBjbGVhclRpbWVvdXQoPG51bWJlcj50aGlzLnRvdWNoVGltZW91dCk7XG4gICAgICB0aGlzLmRyYWdEZWxheWVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgdXBkYXRlKCk6IHZvaWQge1xuICAgIHRoaXMuX3BhcmVudERyb3B6b25lcyA9IFt0aGlzLmRyb3BwYWJsZURpcmVjdGl2ZS5kcm9wWm9uZV07XG4gICAgdGhpcy5kcmFrZXNTZXJ2aWNlLnJlZ2lzdGVyRHJhZ2dhYmxlKHRoaXMpO1xuICAgIHRoaXMudXBkYXRlRWxlbWVudHMoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZHJha2VzU2VydmljZS5yZW1vdmVEcmFnZ2FibGUodGhpcyk7XG4gIH1cblxuICB1cGRhdGVFbGVtZW50cygpOiB2b2lkIHtcbiAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IGhhbmRsZXM6IE5vZGVMaXN0ID0gbmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbbmd4ZHJhZ2hhbmRsZV0nKTtcbiAgICB0aGlzLmhhbmRsZXMgPSBBcnJheS5mcm9tKGhhbmRsZXMpLmZpbHRlcigoaDogYW55KSA9PiBmaW5kRmlyc3REcmFnZ2FibGVQYXJlbnQoaCkgPT09IG5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgZnVuY3Rpb24gZmluZEZpcnN0RHJhZ2dhYmxlUGFyZW50KGM6IGFueSkge1xuICAgICAgd2hpbGUgKGMucGFyZW50Tm9kZSkge1xuICAgICAgICBjID0gYy5wYXJlbnROb2RlO1xuICAgICAgICBpZiAoYy5oYXNBdHRyaWJ1dGUgJiYgYy5oYXNBdHRyaWJ1dGUoJ25neGRyYWdnYWJsZScpKSB7XG4gICAgICAgICAgcmV0dXJuIGM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjYW5Nb3ZlKHNvdXJjZT86IGFueSwgaGFuZGxlPzogYW55LCBzaWJsaW5nPzogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9tb3ZlcyA9PT0gJ2Jvb2xlYW4nKSByZXR1cm4gdGhpcy5fbW92ZXM7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9tb3ZlcyA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHRoaXMuX21vdmVzKHRoaXMubW9kZWwsIHNvdXJjZSwgaGFuZGxlLCBzaWJsaW5nKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG1vdmVzKHNvdXJjZTogYW55LCBoYW5kbGU6IGFueSwgc2libGluZzogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmNhbk1vdmUoc291cmNlLCBoYW5kbGUsIHNpYmxpbmcpKSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gdGhpcy5oYXNIYW5kbGUgPyB0aGlzLmhhbmRsZXMuc29tZShoID0+IGhhbmRlbEZvcihoYW5kbGUsIGgpKSA6IHRydWU7XG5cbiAgICBmdW5jdGlvbiBoYW5kZWxGb3IoYzogYW55LCBwOiBhbnkpIHtcbiAgICAgIGlmIChjID09PSBwKSByZXR1cm4gdHJ1ZTtcbiAgICAgIHdoaWxlICgoYyA9IGMucGFyZW50Tm9kZSkgJiYgYyAhPT0gcCk7IC8vIHRzbGludDpkaXNhYmxlLWxpbmVcbiAgICAgIHJldHVybiAhIWM7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlRWxlbWVudHMoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQWRkcyBwcm9wZXJ0aWVzIGFuZCBldmVudHMgdG8gZHJhZyBoYW5kbGUgZWxlbWVudHNcbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZ3hEcmFnSGFuZGxlXScgfSlcbmV4cG9ydCBjbGFzcyBEcmFnSGFuZGxlRGlyZWN0aXZlIHt9XG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENvbnRlbnRDaGlsZCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgRXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEcm9wcGFibGVEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL25neC1kcm9wcGFibGUuZGlyZWN0aXZlJztcblxubGV0IGkgPSAwO1xuZnVuY3Rpb24gZ2V0TmV4dElkKCkge1xuICByZXR1cm4gaSsrO1xufVxuXG4vKipcbiAqIENvbXBvbmVudCB0aGF0IGFsbG93cyBuZXN0ZWQgbmd4RHJvcHBhYmxlIGFuZCBuZ3hEcmFnZ2FibGVzXG4gKlxuICogQGV4cG9ydFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZG5kLWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlOiBgPGRpdlxuICBuZ3hEcm9wcGFibGVcbiAgW2Ryb3Bab25lXT1cImRyb3Bab25lXCJcbiAgW21vZGVsXT1cIm1vZGVsXCJcbiAgW2NvcHldPVwiY29weVwiXG4gIFtuZ0NsYXNzXT1cInsgJ2d1LWVtcHR5JzogIW1vZGVsPy5sZW5ndGggfVwiXG4gIFtyZW1vdmVPblNwaWxsXT1cInJlbW92ZU9uU3BpbGxcIlxuICBjbGFzcz0nbmd4LWRuZC1jb250YWluZXInPlxuICA8bmctY29udGFpbmVyICpuZ0lmPVwibW9kZWxcIj5cbiAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBpdGVtIG9mIG1vZGVsXCI+XG4gICAgICA8bmd4LWRuZC1pdGVtXG4gICAgICAgIG5neERyYWdnYWJsZVxuICAgICAgICBbbW9kZWxdPVwiaXRlbVwiXG4gICAgICAgIFtkcm9wWm9uZV09XCJkcm9wWm9uZVwiXG4gICAgICAgIFtkcm9wWm9uZXNdPVwiZHJvcFpvbmVzXCJcbiAgICAgICAgW2NvcHldPVwiY29weVwiXG4gICAgICAgIFttb3Zlc109XCJtb3Zlc1wiXG4gICAgICAgIFtyZW1vdmVPblNwaWxsXT1cInJlbW92ZU9uU3BpbGxcIlxuICAgICAgICBbZHJvcHBhYmxlSXRlbUNsYXNzXT1cImRyb3BwYWJsZUl0ZW1DbGFzc1wiXG4gICAgICAgIFtkcm9wcGFibGVJdGVtU3R5bGVdPVwiZHJvcHBhYmxlSXRlbVN0eWxlXCI+XG4gICAgICA8L25neC1kbmQtaXRlbT5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgPC9uZy1jb250YWluZXI+XG4gIDxuZy1jb250ZW50ICpuZ0lmPVwiIW1vZGVsXCI+PC9uZy1jb250ZW50PlxuPC9kaXY+XG5gLFxuICBzdHlsZXM6IFtgLm5neC1kbmQtY29udGFpbmVye2JhY2tncm91bmQtY29sb3I6cmdiYSgyNTUsMjU1LDI1NSwuMik7Ym9yZGVyOjJweCBzb2xpZCByZWQ7bWFyZ2luOjEwcHg7cGFkZGluZzoxMHB4fS5uZ3gtZG5kLWNvbnRhaW5lci5ndS1lbXB0eXtib3JkZXI6MnB4IGRvdHRlZCByZWR9Lm5neC1kbmQtY29udGFpbmVyOm50aC1jaGlsZChvZGQpe2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuMil9Lm5neC1kbmQtY29udGFpbmVyIC5leC1tb3ZlZHtiYWNrZ3JvdW5kLWNvbG9yOiNlNzRjM2N9Lm5neC1kbmQtY29udGFpbmVyIC5leC1vdmVye2JhY2tncm91bmQtY29sb3I6cmdiYSgyNTUsMjU1LDI1NSwuMyl9Lm5neC1kbmQtY29udGFpbmVyIC5oYW5kbGV7cGFkZGluZzowIDVweDttYXJnaW4tcmlnaHQ6NXB4O2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuNCk7Y3Vyc29yOm1vdmV9Lm5vLXNlbGVjdHstd2Via2l0LXRvdWNoLWNhbGxvdXQ6bm9uZTstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9LmNsZWFyZml4OjphZnRlcntjb250ZW50OlwiIFwiO2Rpc3BsYXk6YmxvY2s7aGVpZ2h0OjA7Y2xlYXI6Ym90aH1gXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBDb250YWluZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBtb2RlbDogYW55O1xuICBASW5wdXQoKSBjb3B5ID0gZmFsc2U7XG4gIEBJbnB1dCgpIHJlbW92ZU9uU3BpbGwgPSBmYWxzZTtcbiAgQElucHV0KCkgZHJvcHBhYmxlSXRlbUNsYXNzOiBzdHJpbmcgfCAoKG86IGFueSkgPT4gYW55KTtcbiAgQElucHV0KCkgZHJvcHBhYmxlSXRlbVN0eWxlOiBzdHJpbmcgfCAoKG86IGFueSkgPT4gYW55KTtcblxuXG4gIEBJbnB1dCgpIGRyb3Bab25lID0gYEBARGVmYXVsdERyb3Bab25lLSR7Z2V0TmV4dElkKCl9QEBgO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wWm9uZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lcyB8fCB0aGlzLl9kZWZhdWx0Wm9uZXM7XG4gIH1cbiAgc2V0IGRyb3Bab25lcyh2YWwpIHtcbiAgICB0aGlzLl9kcm9wWm9uZXMgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKSBtb3ZlczogKG1vZGVsOiBhbnksIHNvdXJjZTogYW55LCBoYW5kbGU6IGFueSwgc2libGluZzogYW55KSA9PiBib29sZWFuO1xuXG4gIC8vIEBJbnB1dCgpIGNsYXNzZXM6IGFueSA9IHt9O1xuICAvLyBASW5wdXQoKSBkcmFndWxhT3B0aW9uczogYW55O1xuXG4gIEBJbnB1dCgpXG4gIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpXG4gIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpXG4gIEBWaWV3Q2hpbGQoRHJvcHBhYmxlRGlyZWN0aXZlKVxuICBkcm9wcGFibGU6IGFueTtcblxuICBAT3V0cHV0KCkgZHJvcDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgZHJhZzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgb3ZlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgb3V0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSByZW1vdmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIGNhbmNlbDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBfZHJvcFpvbmVzOiBzdHJpbmdbXTtcbiAgX2RlZmF1bHRab25lczogc3RyaW5nW107XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fZGVmYXVsdFpvbmVzID0gW3RoaXMuZHJvcFpvbmVdO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZHJvcHBhYmxlLmRyYWcuc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMuZHJhZy5lbWl0KHYpKTtcbiAgICB0aGlzLmRyb3BwYWJsZS5kcm9wLnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLmRyb3AuZW1pdCh2KSk7XG4gICAgdGhpcy5kcm9wcGFibGUub3Zlci5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5vdmVyLmVtaXQodikpO1xuICAgIHRoaXMuZHJvcHBhYmxlLm91dC5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5vdXQuZW1pdCh2KSk7XG4gICAgdGhpcy5kcm9wcGFibGUucmVtb3ZlLnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLnJlbW92ZS5lbWl0KHYpKTtcbiAgICB0aGlzLmRyb3BwYWJsZS5jYW5jZWwuc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMuY2FuY2VsLmVtaXQodikpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9uLCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb250YWluZXIvY29udGFpbmVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEcmFnZ2FibGVEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL25neC1kcmFnZ2FibGUuZGlyZWN0aXZlJztcblxuLyoqXG4gKiBDb21wb25lbnQgdGhhdCBhbGxvd3MgbmVzdGVkIG5neERyb3BwYWJsZSBhbmQgbmd4RHJhZ2dhYmxlc1xuICogU2hvdWxkIG9ubHkgYmUgdXNlIGluc2lkZSBhIG5neC1kbmQtY29udGFpbmVyXG4gKiBPdXRzaWRlIGEgbmd4LWRuZC1jb250YWluZXIgdXNlIG5neERyb3BwYWJsZVxuICpcbiAqIEBleHBvcnRcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWRuZC1pdGVtJyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGFpbmVyIFtuZ1N3aXRjaF09XCJ0eXBlXCI+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hDYXNlPVwiJ2FycmF5J1wiPlxuICAgIDxuZ3gtZG5kLWNvbnRhaW5lclxuICAgICAgW21vZGVsXT1cIm1vZGVsXCJcbiAgICAgIFt0ZW1wbGF0ZV09XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgW2Ryb3Bab25lXT1cImRyb3Bab25lXCJcbiAgICAgIFtkcm9wWm9uZXNdPVwiZHJvcFpvbmVzXCJcbiAgICAgIFtyZW1vdmVPblNwaWxsXT1cInJlbW92ZU9uU3BpbGxcIlxuICAgICAgW2Ryb3BwYWJsZUl0ZW1DbGFzc109XCJkcm9wcGFibGVJdGVtQ2xhc3NcIlxuICAgICAgW2Ryb3BwYWJsZUl0ZW1TdHlsZV09XCJkcm9wcGFibGVJdGVtU3R5bGVcIlxuICAgICAgW2NvcHldPVwiY29weVwiPlxuICAgIDwvbmd4LWRuZC1jb250YWluZXI+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIidvYmplY3QnXCI+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAqbmdJZj1cImNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImRhdGFcIj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhY29udGFpbmVyLnRlbXBsYXRlXCI+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwibmd4LWRuZC1jb250ZW50XCI+XG4gICAgICAgIHt7bW9kZWwubGFiZWx9fVxuICAgICAgPC9kaXY+XG4gICAgICA8bmd4LWRuZC1jb250YWluZXJcbiAgICAgICAgKm5nSWY9XCJtb2RlbC5jaGlsZHJlblwiXG4gICAgICAgIFttb2RlbF09XCJtb2RlbC5jaGlsZHJlblwiXG4gICAgICAgIFt0ZW1wbGF0ZV09XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgICBbZHJvcFpvbmVdPVwiZHJvcFpvbmVcIlxuICAgICAgICBbZHJvcFpvbmVzXT1cImRyb3Bab25lc1wiXG4gICAgICAgIFtyZW1vdmVPblNwaWxsXT1cInJlbW92ZU9uU3BpbGxcIlxuICAgICAgICBbZHJvcHBhYmxlSXRlbUNsYXNzXT1cImRyb3BwYWJsZUl0ZW1DbGFzc1wiXG4gICAgICAgIFtjb3B5XT1cImNvcHlcIj5cbiAgICAgIDwvbmd4LWRuZC1jb250YWluZXI+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIid1bmRlZmluZWQnXCI+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy1jb250YWluZXIgKm5nU3dpdGNoRGVmYXVsdD5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgICpuZ0lmPVwiY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiZGF0YVwiPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPGRpdlxuICAgICAgKm5nSWY9XCIhY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgIGNsYXNzPVwibmd4LWRuZC1jb250ZW50XCI+XG4gICAgICB7e21vZGVsfX1cbiAgICA8L2Rpdj5cbiAgPC9uZy1jb250YWluZXI+XG5cbjwvbmctY29udGFpbmVyPlxuXG5cblxuXG5cblxuXG5gLFxuICBzdHlsZXM6IFtgLm5neC1kbmQtYm94LC5uZ3gtZG5kLWl0ZW17bWFyZ2luOjEwcHg7cGFkZGluZzoxMHB4O2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuMik7dHJhbnNpdGlvbjpvcGFjaXR5IC40cyBlYXNlLWluLW91dDtib3JkZXI6MXB4IHNvbGlkICNhZGQ4ZTY7ZGlzcGxheTpibG9ja30ubmd4LWRuZC1ib3guaGFzLWhhbmRsZSBbbmd4RHJhZ0hhbmRsZV0sLm5neC1kbmQtYm94Lmhhcy1oYW5kbGUgW25neGRyYWdoYW5kbGVdLC5uZ3gtZG5kLWJveDpub3QoLmhhcy1oYW5kbGUpOm5vdCgubW92ZS1kaXNhYmxlZCksLm5neC1kbmQtaXRlbS5oYXMtaGFuZGxlIFtuZ3hEcmFnSGFuZGxlXSwubmd4LWRuZC1pdGVtLmhhcy1oYW5kbGUgW25neGRyYWdoYW5kbGVdLC5uZ3gtZG5kLWl0ZW06bm90KC5oYXMtaGFuZGxlKTpub3QoLm1vdmUtZGlzYWJsZWQpe2N1cnNvcjptb3ZlO2N1cnNvcjpncmFiO2N1cnNvcjotd2Via2l0LWdyYWJ9Lm5neC1kbmQtYm94IC5uZ3gtZG5kLWNvbnRlbnQsLm5neC1kbmQtaXRlbSAubmd4LWRuZC1jb250ZW50ey13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0ubmd4LWRuZC1ib3g6aG92ZXIsLm5neC1kbmQtaXRlbTpob3Zlcntib3JkZXI6MXB4IHNvbGlkICMwMGZ9Lm5neC1kbmQtYm94e2hlaWdodDo0MHB4O3dpZHRoOjQwcHg7bGluZS1oZWlnaHQ6MjBweDt0ZXh0LWFsaWduOmNlbnRlcjtmbG9hdDpsZWZ0fS5ndS1taXJyb3J7cG9zaXRpb246Zml4ZWQhaW1wb3J0YW50O21hcmdpbjowIWltcG9ydGFudDt6LWluZGV4Ojk5OTkhaW1wb3J0YW50O29wYWNpdHk6Ljh9Lmd1LWhpZGV7ZGlzcGxheTpub25lIWltcG9ydGFudH0uZ3UtdW5zZWxlY3RhYmxley13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZSFpbXBvcnRhbnQ7LW1vei11c2VyLXNlbGVjdDpub25lIWltcG9ydGFudDstbXMtdXNlci1zZWxlY3Q6bm9uZSFpbXBvcnRhbnQ7dXNlci1zZWxlY3Q6bm9uZSFpbXBvcnRhbnR9Lmd1LXRyYW5zaXR7b3BhY2l0eTouMn1gXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgbW9kZWw6IGFueTtcblxuICBASW5wdXQoKVxuICBnZXQgZHJvcFpvbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lIHx8IHRoaXMuY29udGFpbmVyLmRyb3Bab25lO1xuICB9XG4gIHNldCBkcm9wWm9uZSh2YWwpIHtcbiAgICB0aGlzLl9kcm9wWm9uZSA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wWm9uZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lcyB8fCB0aGlzLmNvbnRhaW5lci5kcm9wWm9uZXM7XG4gIH1cbiAgc2V0IGRyb3Bab25lcyh2YWwpIHtcbiAgICB0aGlzLl9kcm9wWm9uZXMgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgZHJvcHBhYmxlSXRlbUNsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLl9kcm9wcGFibGVJdGVtQ2xhc3MgfHwgdGhpcy5jb250YWluZXIuZHJvcHBhYmxlSXRlbUNsYXNzO1xuICB9XG4gIHNldCBkcm9wcGFibGVJdGVtQ2xhc3ModmFsKSB7XG4gICAgdGhpcy5fZHJvcHBhYmxlSXRlbUNsYXNzID0gdmFsO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGRyb3BwYWJsZUl0ZW1TdHlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcHBhYmxlSXRlbVN0eWxlIHx8IHRoaXMuY29udGFpbmVyLmRyb3BwYWJsZUl0ZW1TdHlsZTtcbiAgfVxuICBzZXQgZHJvcHBhYmxlSXRlbVN0eWxlKHZhbCkge1xuICAgIHRoaXMuX2Ryb3BwYWJsZUl0ZW1TdHlsZSA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCByZW1vdmVPblNwaWxsKCkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5fcmVtb3ZlT25TcGlsbCA9PT0gJ2Jvb2xlYW4nID8gdGhpcy5fcmVtb3ZlT25TcGlsbCA6IHRoaXMuY29udGFpbmVyLnJlbW92ZU9uU3BpbGw7XG4gIH1cbiAgc2V0IHJlbW92ZU9uU3BpbGwodmFsKSB7XG4gICAgdGhpcy5fcmVtb3ZlT25TcGlsbCA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBjb3B5KCkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5fY29weSA9PT0gJ2Jvb2xlYW4nID8gdGhpcy5fY29weSA6IHRoaXMuY29udGFpbmVyLmNvcHk7XG4gIH1cbiAgc2V0IGNvcHkodmFsKSB7XG4gICAgdGhpcy5fY29weSA9IHZhbDtcbiAgfVxuXG4gIF9jb3B5ID0gZmFsc2U7XG4gIF9kcm9wWm9uZTogYW55O1xuICBfZHJvcFpvbmVzOiBhbnk7XG4gIF9kcm9wcGFibGVJdGVtQ2xhc3M6IGFueTtcbiAgX2Ryb3BwYWJsZUl0ZW1TdHlsZTogYW55O1xuICBfcmVtb3ZlT25TcGlsbCA9IGZhbHNlO1xuICBkYXRhOiBhbnk7XG5cbiAgZ2V0IGhhc0hhbmRsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kcmFnZ2FibGVEaXJlY3RpdmUuaGFzSGFuZGxlO1xuICB9XG5cbiAgZ2V0IG1vdmVEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuZHJhZ2dhYmxlRGlyZWN0aXZlLmNhbk1vdmUoKTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUnKVxuICBnZXQgc3R5bGVTdHJpbmcoKSB7XG4gICAgY29uc3QgaXRlbVN0eWxlID1cbiAgICAgIHR5cGVvZiB0aGlzLmRyb3BwYWJsZUl0ZW1TdHlsZSA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuZHJvcHBhYmxlSXRlbVN0eWxlKHRoaXMubW9kZWwpIDogdGhpcy5kcm9wcGFibGVJdGVtU3R5bGU7XG5cbiAgICBjb25zdCBjbGFzc2VzID0gW2l0ZW1TdHlsZV07XG4gICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBjbGFzc1N0cmluZygpIHtcbiAgICBjb25zdCBpdGVtQ2xhc3MgPVxuICAgICAgdHlwZW9mIHRoaXMuZHJvcHBhYmxlSXRlbUNsYXNzID09PSAnZnVuY3Rpb24nID8gdGhpcy5kcm9wcGFibGVJdGVtQ2xhc3ModGhpcy5tb2RlbCkgOiB0aGlzLmRyb3BwYWJsZUl0ZW1DbGFzcztcblxuICAgIGNvbnN0IGNsYXNzZXMgPSBbJ25neC1kbmQtaXRlbScsIGl0ZW1DbGFzcyB8fCAnJ107XG4gICAgaWYgKHRoaXMubW92ZURpc2FibGVkKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ21vdmUtZGlzYWJsZWQnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGFzSGFuZGxlKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2hhcy1oYW5kbGUnKTtcbiAgICB9XG4gICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5tb2RlbCkpIHtcbiAgICAgIHJldHVybiAnYXJyYXknO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZW9mIHRoaXMubW9kZWw7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29udGFpbmVyOiBDb250YWluZXJDb21wb25lbnQsIHB1YmxpYyBkcmFnZ2FibGVEaXJlY3RpdmU6IERyYWdnYWJsZURpcmVjdGl2ZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmRhdGEgPSB7XG4gICAgICBtb2RlbDogdGhpcy5tb2RlbCxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIGRyb3Bab25lOiB0aGlzLmRyb3Bab25lLFxuICAgICAgdGVtcGxhdGU6IHRoaXMuY29udGFpbmVyLnRlbXBsYXRlXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IERyYWdnYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ3gtZHJhZ2dhYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEcm9wcGFibGVEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmd4LWRyb3BwYWJsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRHJhZ0hhbmRsZURpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ3gtZHJhZy1oYW5kbGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IENvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXIvY29udGFpbmVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRHJha2VTdG9yZVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2RyYWtlLXN0b3JlLnNlcnZpY2UnO1xuXG5jb25zdCBjb21wb25lbnRzID0gW0NvbnRhaW5lckNvbXBvbmVudCwgSXRlbUNvbXBvbmVudF07XG5jb25zdCBkaXJlY3RpdmVzID0gW0RyYWdnYWJsZURpcmVjdGl2ZSwgRHJvcHBhYmxlRGlyZWN0aXZlLCBEcmFnSGFuZGxlRGlyZWN0aXZlXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogWy4uLmNvbXBvbmVudHMsIC4uLmRpcmVjdGl2ZXNdLFxuICBleHBvcnRzOiBbLi4uY29tcG9uZW50cywgLi4uZGlyZWN0aXZlc10sXG4gIHByb3ZpZGVyczogW0RyYWtlU3RvcmVTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hEbkRNb2R1bGUge31cbiJdLCJuYW1lcyI6WyJpIiwiZ2V0TmV4dElkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBT0EsdUJBQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDOzs7Ozs7QUFRakMsTUFBYSxpQkFBaUI7SUFNNUI7NEJBTHVCLElBQUksT0FBTyxFQUEyQjs0QkFDdEMsSUFBSSxPQUFPLEVBQTJCO1FBSzNELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLElB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