import { Injectable, ɵɵdefineInjectable, EventEmitter, Directive, ElementRef, Renderer2, Input, Output, HostListener, Component, ViewEncapsulation, ContentChild, TemplateRef, ViewChild, HostBinding, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as dragulaNamespace from '@swimlane/dragula';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// see https://github.com/dherges/ng-packagr/issues/217
/** @type {?} */
const dragula = dragulaNamespace;
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
        /** @type {?} */
        const idx = this.drake.containers.indexOf(droppable.container);
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
        /** @type {?} */
        const accepts = (/**
         * @param {?} el
         * @param {?} target
         * @return {?}
         */
        (el, target /*, source: any, sibling: any */) => {
            if (el.contains(target)) {
                return false;
            }
            /** @type {?} */
            const elementComponent = this.draggableMap.get(el);
            /** @type {?} */
            const targetComponent = this.droppableMap.get(target);
            if (elementComponent && targetComponent) {
                return elementComponent.dropZones.includes(targetComponent.dropZone);
            }
            return true;
        });
        /** @type {?} */
        const copy = (/**
         * @param {?} _
         * @param {?} source
         * @return {?}
         */
        (_, source) => {
            /** @type {?} */
            const sourceComponent = this.droppableMap.get(source);
            if (sourceComponent) {
                return sourceComponent.copy;
            }
            return false;
        });
        /** @type {?} */
        const moves = (/**
         * @param {?=} el
         * @param {?=} source
         * @param {?=} handle
         * @param {?=} sibling
         * @return {?}
         */
        (el, source, handle, sibling) => {
            /** @type {?} */
            const elementComponent = this.draggableMap.get(el);
            if (elementComponent) {
                return elementComponent.moves(source, handle, sibling);
            }
            return true;
        });
        /** @type {?} */
        const direction = (/**
         * @param {?} el
         * @param {?} target
         * @param {?} source
         * @return {?}
         */
        (el, target, source) => {
            /** @type {?} */
            const targetComponent = this.droppableMap.get(target);
            return targetComponent.direction || 'vertical';
        });
        return { accepts, copy, moves, revertOnSpill: true, direction };
    }
    /**
     * @return {?}
     */
    registerEvents() {
        /** @type {?} */
        let dragElm;
        /** @type {?} */
        let draggedItem;
        this.drake.on('drag', (/**
         * @param {?} el
         * @param {?} source
         * @return {?}
         */
        (el, source) => {
            draggedItem = undefined;
            dragElm = el;
            if (!el || !source) {
                return;
            }
            if (this.draggableMap.has(el)) {
                /** @type {?} */
                const elementComponent = this.draggableMap.get(el);
                draggedItem = elementComponent.model;
                elementComponent.drag.emit({
                    type: 'drag',
                    el,
                    source,
                    value: draggedItem
                });
            }
            if (this.droppableMap.has(source)) {
                /** @type {?} */
                const sourceComponent = this.droppableMap.get(source);
                this.dragulaOptions.removeOnSpill = sourceComponent.removeOnSpill;
                sourceComponent.drag.emit({
                    type: 'drag',
                    el,
                    source,
                    sourceComponent,
                    value: draggedItem
                });
            }
        }));
        this.drake.on('drop', (/**
         * @param {?} el
         * @param {?} target
         * @param {?} source
         * @return {?}
         */
        (el, target, source) => {
            /** @type {?} */
            const targetComponent = this.droppableMap.get(target);
            if (!targetComponent) {
                // not a target, abort
                return;
            }
            /** @type {?} */
            let dropElmModel = draggedItem;
            /** @type {?} */
            const dropIndex = Array.prototype.indexOf.call(target.children, el);
            if (dropIndex < 0) {
                // dropIndex is bad... cancel
                this.drake.cancel(true);
                return;
            }
            /** @type {?} */
            const sourceComponent = this.droppableMap.get(source);
            if (sourceComponent) {
                /** @type {?} */
                const sourceModel = sourceComponent.model;
                /** @type {?} */
                const targetModel = targetComponent.model;
                /** @type {?} */
                const hasDragModel = !!(sourceModel && draggedItem);
                /** @type {?} */
                const dragIndex = hasDragModel ? sourceModel.indexOf(draggedItem) : -1;
                if (hasDragModel && dragIndex < 0) {
                    // dragIndex is bad... cancel
                    this.drake.cancel(true);
                    return;
                }
                if (targetModel) {
                    /** @type {?} */
                    const reorder = dragIndex > -1 && sourceModel && target === source;
                    /** @type {?} */
                    const copy = !sourceModel || dragElm !== el;
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
        }));
        this.drake.on('remove', (/**
         * @param {?} el
         * @param {?} container
         * @param {?} source
         * @return {?}
         */
        (el, container, source) => {
            if (this.droppableMap.has(source)) {
                /** @type {?} */
                const sourceComponent = this.droppableMap.get(source);
                /** @type {?} */
                const sourceModel = sourceComponent.model;
                /** @type {?} */
                const dragIndex = draggedItem && sourceModel ? sourceModel.indexOf(draggedItem) : -1;
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
        }));
        this.drake.on('cancel', (/**
         * @param {?} el
         * @param {?} container
         * @param {?} source
         * @return {?}
         */
        (el, container, source) => {
            if (this.droppableMap.has(container)) {
                /** @type {?} */
                const containerComponent = this.droppableMap.get(container);
                containerComponent.cancel.emit({
                    type: 'cancel',
                    el,
                    container,
                    source,
                    value: draggedItem
                });
            }
        }));
        this.drake.on('over', (/**
         * @param {?} el
         * @param {?} container
         * @param {?} source
         * @return {?}
         */
        (el, container, source) => {
            if (this.droppableMap.has(container)) {
                /** @type {?} */
                const containerComponent = this.droppableMap.get(container);
                containerComponent.over.emit({
                    type: 'over',
                    el,
                    container,
                    source,
                    value: draggedItem
                });
            }
        }));
        this.drake.on('out', (/**
         * @param {?} el
         * @param {?} container
         * @param {?} source
         * @return {?}
         */
        (el, container, source) => {
            if (this.droppableMap.has(container)) {
                /** @type {?} */
                const containerComponent = this.droppableMap.get(container);
                containerComponent.out.emit({
                    type: 'out',
                    el,
                    container,
                    source,
                    value: draggedItem
                });
            }
        }));
    }
}
DrakeStoreService.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */
DrakeStoreService.ctorParameters = () => [];
/** @nocollapse */ DrakeStoreService.ngInjectableDef = ɵɵdefineInjectable({ factory: function DrakeStoreService_Factory() { return new DrakeStoreService(); }, token: DrakeStoreService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
let i = 10000;
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
        this.direction = 'vertical';
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
        this.over.subscribe((/**
         * @return {?}
         */
        () => {
            this.renderer.addClass(this.container, 'gu-over');
        }));
        this.out.subscribe((/**
         * @return {?}
         */
        () => {
            this.renderer.removeClass(this.container, 'gu-over');
        }));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.drakesService.remove(this);
    }
}
DroppableDirective.decorators = [
    { type: Directive, args: [{ selector: '[ngxDroppable]' },] }
];
/** @nocollapse */
DroppableDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: DrakeStoreService }
];
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Adds properties and events to drag handle elements
 *
 * @export
 */
class DragHandleDirective {
}
DragHandleDirective.decorators = [
    { type: Directive, args: [{ selector: '[ngxDragHandle]' },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
let i$1 = 0;
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
    get classString() {
        /** @type {?} */
        const itemClass = typeof this.droppableItemClass === 'function' ? this.droppableItemClass(this.model) : this.droppableItemClass;
        /** @type {?} */
        const classes = ['ngx-dnd-item', itemClass || ''];
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
                template: "<ng-container [ngSwitch]=\"type\">\n\n  <ng-container *ngSwitchCase=\"'array'\">\n    <ngx-dnd-container\n      [model]=\"model\"\n      [template]=\"container.template\"\n      [dropZone]=\"dropZone\"\n      [dropZones]=\"dropZones\"\n      [removeOnSpill]=\"removeOnSpill\"\n      [droppableItemClass]=\"droppableItemClass\"\n      [droppableItemStyle]=\"droppableItemStyle\"\n      [copy]=\"copy\">\n    </ngx-dnd-container>\n  </ng-container>\n\n  <ng-container *ngSwitchCase=\"'object'\">\n    <ng-template\n      *ngIf=\"container.template\"\n      [ngTemplateOutlet]=\"container.template\"\n      [ngTemplateOutletContext]=\"data\">\n    </ng-template>\n    <ng-container *ngIf=\"!container.template\">\n      <div\n        class=\"ngx-dnd-content\">\n        {{model.label}}\n      </div>\n      <ngx-dnd-container\n        *ngIf=\"model.children\"\n        [model]=\"model.children\"\n        [template]=\"container.template\"\n        [dropZone]=\"dropZone\"\n        [dropZones]=\"dropZones\"\n        [removeOnSpill]=\"removeOnSpill\"\n        [droppableItemClass]=\"droppableItemClass\"\n        [copy]=\"copy\">\n      </ngx-dnd-container>\n    </ng-container>\n  </ng-container>\n\n  <ng-container *ngSwitchCase=\"'undefined'\">\n  </ng-container>\n\n  <ng-container *ngSwitchDefault>\n    <ng-template\n      *ngIf=\"container.template\"\n      [ngTemplateOutlet]=\"container.template\"\n      [ngTemplateOutletContext]=\"data\">\n    </ng-template>\n    <div\n      *ngIf=\"!container.template\"\n      class=\"ngx-dnd-content\">\n      {{model}}\n    </div>\n  </ng-container>\n\n</ng-container>\n\n\n\n\n\n\n\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".ngx-dnd-box,.ngx-dnd-item{margin:10px;padding:10px;background-color:rgba(0,0,0,.2);transition:opacity .4s ease-in-out;border:1px solid #add8e6;display:block}.ngx-dnd-box.has-handle [ngxDragHandle],.ngx-dnd-box.has-handle [ngxdraghandle],.ngx-dnd-box:not(.has-handle):not(.move-disabled),.ngx-dnd-item.has-handle [ngxDragHandle],.ngx-dnd-item.has-handle [ngxdraghandle],.ngx-dnd-item:not(.has-handle):not(.move-disabled){cursor:move;cursor:grab;cursor:-webkit-grab}.ngx-dnd-box .ngx-dnd-content,.ngx-dnd-item .ngx-dnd-content{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ngx-dnd-box:hover,.ngx-dnd-item:hover{border:1px solid #00f}.ngx-dnd-box{height:40px;width:40px;line-height:20px;text-align:center;float:left}.gu-mirror{position:fixed!important;margin:0!important;z-index:9999!important;opacity:.8}.gu-hide{display:none!important}.gu-unselectable{-webkit-user-select:none!important;-moz-user-select:none!important;-ms-user-select:none!important;user-select:none!important}.gu-transit{opacity:.2}"]
            }] }
];
/** @nocollapse */
ItemComponent.ctorParameters = () => [
    { type: ContainerComponent },
    { type: DraggableDirective }
];
ItemComponent.propDecorators = {
    model: [{ type: Input }],
    dropZone: [{ type: Input }],
    dropZones: [{ type: Input }],
    droppableItemClass: [{ type: Input }],
    removeOnSpill: [{ type: Input }],
    copy: [{ type: Input }],
    droppableItemStyle: [{ type: HostBinding, args: ['style',] }, { type: Input }],
    classString: [{ type: HostBinding, args: ['class',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const components = [ContainerComponent, ItemComponent];
/** @type {?} */
const directives = [DraggableDirective, DroppableDirective, DragHandleDirective];
class NgxDnDModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: NgxDnDModule,
            providers: [DrakeStoreService]
        };
    }
}
NgxDnDModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                declarations: [...components, ...directives],
                exports: [...components, ...directives]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { ContainerComponent, DragHandleDirective, DraggableDirective, DrakeStoreService, DroppableDirective, ItemComponent, NgxDnDModule };
//# sourceMappingURL=swimlane-ngx-dnd.js.map
