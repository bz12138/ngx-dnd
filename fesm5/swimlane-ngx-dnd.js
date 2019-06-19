import { Injectable, Directive, Input, Output, ElementRef, EventEmitter, Renderer2, HostListener, Component, ViewEncapsulation, ContentChild, TemplateRef, ViewChild, HostBinding, NgModule, defineInjectable } from '@angular/core';
import * as dragulaNamespace from '@swimlane/dragula';
import { __spread } from 'tslib';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// see https://github.com/dherges/ng-packagr/issues/217
var /** @type {?} */ dragula = dragulaNamespace;
/**
 * Central service that handles all events
 *
 * @export
 */
var DrakeStoreService = /** @class */ (function () {
    function DrakeStoreService() {
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
    DrakeStoreService.prototype.register = /**
     * @param {?} droppable
     * @return {?}
     */
    function (droppable) {
        this.droppableMap.set(droppable.container, droppable);
        this.drake.containers.push(droppable.container);
    };
    /**
     * @param {?} droppable
     * @return {?}
     */
    DrakeStoreService.prototype.remove = /**
     * @param {?} droppable
     * @return {?}
     */
    function (droppable) {
        this.droppableMap.delete(droppable.container);
        var /** @type {?} */ idx = this.drake.containers.indexOf(droppable.container);
        if (idx > -1) {
            this.drake.containers.splice(idx, 1);
        }
    };
    /**
     * @param {?} draggable
     * @return {?}
     */
    DrakeStoreService.prototype.registerDraggable = /**
     * @param {?} draggable
     * @return {?}
     */
    function (draggable) {
        this.draggableMap.set(draggable.element, draggable);
    };
    /**
     * @param {?} draggable
     * @return {?}
     */
    DrakeStoreService.prototype.removeDraggable = /**
     * @param {?} draggable
     * @return {?}
     */
    function (draggable) {
        this.draggableMap.delete(draggable.element);
    };
    /**
     * @return {?}
     */
    DrakeStoreService.prototype.createDrakeOptions = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ accepts = function (el, target /*, source: any, sibling: any */) {
            if (el.contains(target)) {
                return false;
            }
            var /** @type {?} */ elementComponent = _this.draggableMap.get(el);
            var /** @type {?} */ targetComponent = _this.droppableMap.get(target);
            if (elementComponent && targetComponent) {
                return elementComponent.dropZones.includes(targetComponent.dropZone);
            }
            return true;
        };
        var /** @type {?} */ copy = function (_, source) {
            var /** @type {?} */ sourceComponent = _this.droppableMap.get(source);
            if (sourceComponent) {
                return sourceComponent.copy;
            }
            return false;
        };
        var /** @type {?} */ moves = function (el, source, handle, sibling) {
            var /** @type {?} */ elementComponent = _this.draggableMap.get(el);
            if (elementComponent) {
                return elementComponent.moves(source, handle, sibling);
            }
            return true;
        };
        return { accepts: accepts, copy: copy, moves: moves, revertOnSpill: true, direction: 'vertical' };
    };
    /**
     * @return {?}
     */
    DrakeStoreService.prototype.registerEvents = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ dragElm;
        var /** @type {?} */ draggedItem;
        this.drake.on('drag', function (el, source) {
            draggedItem = undefined;
            dragElm = el;
            if (!el || !source) {
                return;
            }
            if (_this.draggableMap.has(el)) {
                var /** @type {?} */ elementComponent = _this.draggableMap.get(el);
                draggedItem = elementComponent.model;
                elementComponent.drag.emit({
                    type: 'drag',
                    el: el,
                    source: source,
                    value: draggedItem
                });
            }
            if (_this.droppableMap.has(source)) {
                var /** @type {?} */ sourceComponent = _this.droppableMap.get(source);
                _this.dragulaOptions.removeOnSpill = sourceComponent.removeOnSpill;
                sourceComponent.drag.emit({
                    type: 'drag',
                    el: el,
                    source: source,
                    sourceComponent: sourceComponent,
                    value: draggedItem
                });
            }
        });
        this.drake.on('drop', function (el, target, source) {
            var /** @type {?} */ targetComponent = _this.droppableMap.get(target);
            if (!targetComponent) {
                // not a target, abort
                return;
            }
            var /** @type {?} */ dropElmModel = draggedItem;
            var /** @type {?} */ dropIndex = Array.prototype.indexOf.call(target.children, el);
            if (dropIndex < 0) {
                // dropIndex is bad... cancel
                _this.drake.cancel(true);
                return;
            }
            var /** @type {?} */ sourceComponent = _this.droppableMap.get(source);
            if (sourceComponent) {
                var /** @type {?} */ sourceModel = sourceComponent.model;
                var /** @type {?} */ targetModel = targetComponent.model;
                var /** @type {?} */ hasDragModel = !!(sourceModel && draggedItem);
                var /** @type {?} */ dragIndex = hasDragModel ? sourceModel.indexOf(draggedItem) : -1;
                if (hasDragModel && dragIndex < 0) {
                    // dragIndex is bad... cancel
                    _this.drake.cancel(true);
                    return;
                }
                if (targetModel) {
                    var /** @type {?} */ reorder = dragIndex > -1 && sourceModel && target === source;
                    var /** @type {?} */ copy = !sourceModel || dragElm !== el;
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
                                _this.drake.cancel(true);
                            }
                            sourceModel.splice(dragIndex, 1);
                        }
                        targetModel.splice(dropIndex, 0, dropElmModel);
                    }
                }
            }
            targetComponent.drop.emit({
                type: 'drop',
                el: el,
                source: source,
                value: dropElmModel,
                dropIndex: dropIndex
            });
        });
        this.drake.on('remove', function (el, container, source) {
            if (_this.droppableMap.has(source)) {
                var /** @type {?} */ sourceComponent = _this.droppableMap.get(source);
                var /** @type {?} */ sourceModel = sourceComponent.model;
                var /** @type {?} */ dragIndex = draggedItem && sourceModel ? sourceModel.indexOf(draggedItem) : -1;
                if (dragIndex > -1) {
                    if (el.parentNode !== source) {
                        // add element back, let angular remove it
                        source.appendChild(el);
                    }
                    sourceModel.splice(dragIndex, 1);
                }
                sourceComponent.remove.emit({
                    type: 'remove',
                    el: el,
                    container: container,
                    source: source,
                    value: draggedItem
                });
            }
        });
        this.drake.on('cancel', function (el, container, source) {
            if (_this.droppableMap.has(container)) {
                var /** @type {?} */ containerComponent = _this.droppableMap.get(container);
                containerComponent.cancel.emit({
                    type: 'cancel',
                    el: el,
                    container: container,
                    source: source,
                    value: draggedItem
                });
            }
        });
        this.drake.on('over', function (el, container, source) {
            if (_this.droppableMap.has(container)) {
                var /** @type {?} */ containerComponent = _this.droppableMap.get(container);
                containerComponent.over.emit({
                    type: 'over',
                    el: el,
                    container: container,
                    source: source,
                    value: draggedItem
                });
            }
        });
        this.drake.on('out', function (el, container, source) {
            if (_this.droppableMap.has(container)) {
                var /** @type {?} */ containerComponent = _this.droppableMap.get(container);
                containerComponent.out.emit({
                    type: 'out',
                    el: el,
                    container: container,
                    source: source,
                    value: draggedItem
                });
            }
        });
    };
    DrakeStoreService.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] },
    ];
    /** @nocollapse */
    DrakeStoreService.ctorParameters = function () { return []; };
    /** @nocollapse */ DrakeStoreService.ngInjectableDef = defineInjectable({ factory: function DrakeStoreService_Factory() { return new DrakeStoreService(); }, token: DrakeStoreService, providedIn: "root" });
    return DrakeStoreService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var /** @type {?} */ i = 10000;
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
var DroppableDirective = /** @class */ (function () {
    function DroppableDirective(el, renderer, drakesService) {
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
    Object.defineProperty(DroppableDirective.prototype, "container", {
        get: /**
         * @return {?}
         */
        function () {
            return this.el.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DroppableDirective.prototype, "dropZone", {
        get: /**
         * @return {?}
         */
        function () {
            return this._dropZone || this.ngxDroppable || this.defaultZone;
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
    /**
     * @return {?}
     */
    DroppableDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.defaultZone = "@@DefaultDropZone-" + getNextId() + "@@";
        this.drakesService.register(this);
    };
    /**
     * @return {?}
     */
    DroppableDirective.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.over.subscribe(function () {
            _this.renderer.addClass(_this.container, 'gu-over');
        });
        this.out.subscribe(function () {
            _this.renderer.removeClass(_this.container, 'gu-over');
        });
    };
    /**
     * @return {?}
     */
    DroppableDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.drakesService.remove(this);
    };
    DroppableDirective.decorators = [
        { type: Directive, args: [{ selector: '[ngxDroppable]' },] },
    ];
    /** @nocollapse */
    DroppableDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Renderer2, },
        { type: DrakeStoreService, },
    ]; };
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
    return DroppableDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Adds properties and events to draggable elements
 *
 * @export
 */
var DraggableDirective = /** @class */ (function () {
    function DraggableDirective(el, drakesService, droppableDirective) {
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
    Object.defineProperty(DraggableDirective.prototype, "dropZones", {
        get: /**
         * @return {?}
         */
        function () {
            return this._dropZones || this.ngxDraggable || this._parentDropzones;
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
    Object.defineProperty(DraggableDirective.prototype, "hasHandle", {
        get: /**
         * @return {?}
         */
        function () {
            return !!this.handles.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DraggableDirective.prototype, "element", {
        get: /**
         * @return {?}
         */
        function () {
            return this.el.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} e
     * @return {?}
     */
    DraggableDirective.prototype.onMove = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (!this._moves || this.dragDelayed) {
            e.stopPropagation();
            clearTimeout(this.touchTimeout);
        }
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.onDown = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this._moves) {
            this.touchTimeout = setTimeout(function () {
                _this.dragDelayed = false;
            }, this.dragDelay);
        }
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.onUp = /**
     * @return {?}
     */
    function () {
        if (this._moves) {
            clearTimeout(/** @type {?} */ (this.touchTimeout));
            this.dragDelayed = true;
        }
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.update();
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.update = /**
     * @return {?}
     */
    function () {
        this._parentDropzones = [this.droppableDirective.dropZone];
        this.drakesService.registerDraggable(this);
        this.updateElements();
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.drakesService.removeDraggable(this);
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.updateElements = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ nativeElement = this.el.nativeElement;
        var /** @type {?} */ handles = nativeElement.querySelectorAll('[ngxdraghandle]');
        this.handles = Array.from(handles).filter(function (h) { return findFirstDraggableParent(h) === nativeElement; });
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
    };
    /**
     * @param {?=} source
     * @param {?=} handle
     * @param {?=} sibling
     * @return {?}
     */
    DraggableDirective.prototype.canMove = /**
     * @param {?=} source
     * @param {?=} handle
     * @param {?=} sibling
     * @return {?}
     */
    function (source, handle, sibling) {
        if (typeof this._moves === 'boolean')
            return this._moves;
        if (typeof this._moves === 'function')
            return this._moves(this.model, source, handle, sibling);
        return true;
    };
    /**
     * @param {?} source
     * @param {?} handle
     * @param {?} sibling
     * @return {?}
     */
    DraggableDirective.prototype.moves = /**
     * @param {?} source
     * @param {?} handle
     * @param {?} sibling
     * @return {?}
     */
    function (source, handle, sibling) {
        if (!this.canMove(source, handle, sibling))
            return false;
        return this.hasHandle ? this.handles.some(function (h) { return handelFor(handle, h); }) : true;
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
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        this.updateElements();
    };
    DraggableDirective.decorators = [
        { type: Directive, args: [{ selector: '[ngxDraggable]' },] },
    ];
    /** @nocollapse */
    DraggableDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: DrakeStoreService, },
        { type: DroppableDirective, },
    ]; };
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
    return DraggableDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Adds properties and events to drag handle elements
 *
 * @export
 */
var DragHandleDirective = /** @class */ (function () {
    function DragHandleDirective() {
    }
    DragHandleDirective.decorators = [
        { type: Directive, args: [{ selector: '[ngxDragHandle]' },] },
    ];
    return DragHandleDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var /** @type {?} */ i$1 = 0;
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
var ContainerComponent = /** @class */ (function () {
    function ContainerComponent() {
        this.copy = false;
        this.removeOnSpill = false;
        this.dropZone = "@@DefaultDropZone-" + getNextId$1() + "@@";
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
                    template: "<div\n  ngxDroppable\n  [dropZone]=\"dropZone\"\n  [model]=\"model\"\n  [copy]=\"copy\"\n  [ngClass]=\"{ 'gu-empty': !model?.length }\"\n  [removeOnSpill]=\"removeOnSpill\"\n  class='ngx-dnd-container'>\n  <ng-container *ngIf=\"model\">\n    <ng-container *ngFor=\"let item of model\">\n      <ngx-dnd-item\n        ngxDraggable\n        [model]=\"item\"\n        [dropZone]=\"dropZone\"\n        [dropZones]=\"dropZones\"\n        [copy]=\"copy\"\n        [moves]=\"moves\"\n        [removeOnSpill]=\"removeOnSpill\"\n        [droppableItemClass]=\"droppableItemClass\"\n        [droppableItemStyle]=\"droppableItemStyle\">\n      </ngx-dnd-item>\n    </ng-container>\n  </ng-container>\n  <ng-content *ngIf=\"!model\"></ng-content>\n</div>\n",
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
    Object.defineProperty(ItemComponent.prototype, "styleString", {
        get: /**
         * @return {?}
         */
        function () {
            var /** @type {?} */ itemStyle = typeof this.droppableItemStyle === 'function' ? this.droppableItemStyle(this.model) : this.droppableItemStyle;
            var /** @type {?} */ classes = [itemStyle];
            return classes.join(' ');
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
        "droppableItemStyle": [{ type: Input },],
        "removeOnSpill": [{ type: Input },],
        "copy": [{ type: Input },],
        "styleString": [{ type: HostBinding, args: ['style',] },],
        "classString": [{ type: HostBinding, args: ['class',] },],
    };
    return ItemComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var /** @type {?} */ components = [ContainerComponent, ItemComponent];
var /** @type {?} */ directives = [DraggableDirective, DroppableDirective, DragHandleDirective];
var NgxDnDModule = /** @class */ (function () {
    function NgxDnDModule() {
    }
    NgxDnDModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: __spread(components, directives),
                    exports: __spread(components, directives),
                    providers: [DrakeStoreService]
                },] },
    ];
    return NgxDnDModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { DraggableDirective, DroppableDirective, DragHandleDirective, ItemComponent, ContainerComponent, DrakeStoreService, NgxDnDModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpbWxhbmUtbmd4LWRuZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQHN3aW1sYW5lL25neC1kbmQvbGliL3NlcnZpY2VzL2RyYWtlLXN0b3JlLnNlcnZpY2UudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kL2xpYi9kaXJlY3RpdmVzL25neC1kcm9wcGFibGUuZGlyZWN0aXZlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWRuZC9saWIvZGlyZWN0aXZlcy9uZ3gtZHJhZ2dhYmxlLmRpcmVjdGl2ZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1kbmQvbGliL2RpcmVjdGl2ZXMvbmd4LWRyYWctaGFuZGxlLmRpcmVjdGl2ZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1kbmQvbGliL2NvbXBvbmVudHMvY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kL2xpYi9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kL2xpYi9uZ3gtZG5kLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCAqIGFzIGRyYWd1bGFOYW1lc3BhY2UgZnJvbSAnQHN3aW1sYW5lL2RyYWd1bGEnO1xuaW1wb3J0IHsgRHJvcHBhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9uZ3gtZHJvcHBhYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEcmFnZ2FibGVEaXJlY3RpdmUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL25neC1kcmFnZ2FibGUuZGlyZWN0aXZlJztcblxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kaGVyZ2VzL25nLXBhY2thZ3IvaXNzdWVzLzIxN1xuY29uc3QgZHJhZ3VsYSA9IGRyYWd1bGFOYW1lc3BhY2U7XG5cbi8qKlxuICogQ2VudHJhbCBzZXJ2aWNlIHRoYXQgaGFuZGxlcyBhbGwgZXZlbnRzXG4gKlxuICogQGV4cG9ydFxuICovXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIERyYWtlU3RvcmVTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBkcm9wcGFibGVNYXAgPSBuZXcgV2Vha01hcDxhbnksIERyb3BwYWJsZURpcmVjdGl2ZT4oKTtcbiAgcHJpdmF0ZSBkcmFnZ2FibGVNYXAgPSBuZXcgV2Vha01hcDxhbnksIERyYWdnYWJsZURpcmVjdGl2ZT4oKTtcbiAgcHJpdmF0ZSBkcmFndWxhT3B0aW9uczogZHJhZ3VsYU5hbWVzcGFjZS5EcmFndWxhT3B0aW9ucztcbiAgcHJpdmF0ZSBkcmFrZTogZHJhZ3VsYU5hbWVzcGFjZS5EcmFrZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRyYWd1bGFPcHRpb25zID0gdGhpcy5jcmVhdGVEcmFrZU9wdGlvbnMoKTtcbiAgICB0aGlzLmRyYWtlID0gZHJhZ3VsYShbXSwgdGhpcy5kcmFndWxhT3B0aW9ucyk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xuICB9XG5cbiAgcmVnaXN0ZXIoZHJvcHBhYmxlOiBEcm9wcGFibGVEaXJlY3RpdmUpIHtcbiAgICB0aGlzLmRyb3BwYWJsZU1hcC5zZXQoZHJvcHBhYmxlLmNvbnRhaW5lciwgZHJvcHBhYmxlKTtcbiAgICB0aGlzLmRyYWtlLmNvbnRhaW5lcnMucHVzaChkcm9wcGFibGUuY29udGFpbmVyKTtcbiAgfVxuXG4gIHJlbW92ZShkcm9wcGFibGU6IERyb3BwYWJsZURpcmVjdGl2ZSkge1xuICAgIHRoaXMuZHJvcHBhYmxlTWFwLmRlbGV0ZShkcm9wcGFibGUuY29udGFpbmVyKTtcbiAgICBjb25zdCBpZHggPSB0aGlzLmRyYWtlLmNvbnRhaW5lcnMuaW5kZXhPZihkcm9wcGFibGUuY29udGFpbmVyKTtcbiAgICBpZiAoaWR4ID4gLTEpIHtcbiAgICAgIHRoaXMuZHJha2UuY29udGFpbmVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3RlckRyYWdnYWJsZShkcmFnZ2FibGU6IERyYWdnYWJsZURpcmVjdGl2ZSkge1xuICAgIHRoaXMuZHJhZ2dhYmxlTWFwLnNldChkcmFnZ2FibGUuZWxlbWVudCwgZHJhZ2dhYmxlKTtcbiAgfVxuXG4gIHJlbW92ZURyYWdnYWJsZShkcmFnZ2FibGU6IERyYWdnYWJsZURpcmVjdGl2ZSkge1xuICAgIHRoaXMuZHJhZ2dhYmxlTWFwLmRlbGV0ZShkcmFnZ2FibGUuZWxlbWVudCk7XG4gIH1cblxuICBjcmVhdGVEcmFrZU9wdGlvbnMoKTogZHJhZ3VsYU5hbWVzcGFjZS5EcmFndWxhT3B0aW9ucyB7XG4gICAgY29uc3QgYWNjZXB0cyA9IChlbDogYW55LCB0YXJnZXQ6IGFueSAvKiwgc291cmNlOiBhbnksIHNpYmxpbmc6IGFueSAqLykgPT4ge1xuICAgICAgaWYgKGVsLmNvbnRhaW5zKHRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY29uc3QgZWxlbWVudENvbXBvbmVudCA9IHRoaXMuZHJhZ2dhYmxlTWFwLmdldChlbCk7XG4gICAgICBjb25zdCB0YXJnZXRDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQodGFyZ2V0KTtcbiAgICAgIGlmIChlbGVtZW50Q29tcG9uZW50ICYmIHRhcmdldENvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudENvbXBvbmVudC5kcm9wWm9uZXMuaW5jbHVkZXModGFyZ2V0Q29tcG9uZW50LmRyb3Bab25lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICBjb25zdCBjb3B5ID0gKF86IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChzb3VyY2UpO1xuICAgICAgaWYgKHNvdXJjZUNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gc291cmNlQ29tcG9uZW50LmNvcHk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGNvbnN0IG1vdmVzID0gKGVsPzogYW55LCBzb3VyY2U/OiBhbnksIGhhbmRsZT86IGFueSwgc2libGluZz86IGFueSkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudENvbXBvbmVudCA9IHRoaXMuZHJhZ2dhYmxlTWFwLmdldChlbCk7XG4gICAgICBpZiAoZWxlbWVudENvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudENvbXBvbmVudC5tb3Zlcyhzb3VyY2UsIGhhbmRsZSwgc2libGluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHsgYWNjZXB0cywgY29weSwgbW92ZXMsIHJldmVydE9uU3BpbGw6IHRydWUsIGRpcmVjdGlvbjogJ3ZlcnRpY2FsJyB9O1xuICB9XG5cbiAgcmVnaXN0ZXJFdmVudHMoKTogdm9pZCB7XG4gICAgbGV0IGRyYWdFbG06IGFueTtcbiAgICBsZXQgZHJhZ2dlZEl0ZW06IGFueTtcblxuICAgIHRoaXMuZHJha2Uub24oJ2RyYWcnLCAoZWw6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGRyYWdnZWRJdGVtID0gdW5kZWZpbmVkO1xuICAgICAgZHJhZ0VsbSA9IGVsO1xuXG4gICAgICBpZiAoIWVsIHx8ICFzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5kcmFnZ2FibGVNYXAuaGFzKGVsKSkge1xuICAgICAgICBjb25zdCBlbGVtZW50Q29tcG9uZW50ID0gdGhpcy5kcmFnZ2FibGVNYXAuZ2V0KGVsKTtcbiAgICAgICAgZHJhZ2dlZEl0ZW0gPSBlbGVtZW50Q29tcG9uZW50Lm1vZGVsO1xuXG4gICAgICAgIGVsZW1lbnRDb21wb25lbnQuZHJhZy5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnZHJhZycsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZHJvcHBhYmxlTWFwLmhhcyhzb3VyY2UpKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZUNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChzb3VyY2UpO1xuICAgICAgICB0aGlzLmRyYWd1bGFPcHRpb25zLnJlbW92ZU9uU3BpbGwgPSBzb3VyY2VDb21wb25lbnQucmVtb3ZlT25TcGlsbDtcblxuICAgICAgICBzb3VyY2VDb21wb25lbnQuZHJhZy5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnZHJhZycsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHNvdXJjZUNvbXBvbmVudCxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdkcm9wJywgKGVsOiBhbnksIHRhcmdldDogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgY29uc3QgdGFyZ2V0Q29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KHRhcmdldCk7XG5cbiAgICAgIGlmICghdGFyZ2V0Q29tcG9uZW50KSB7XG4gICAgICAgIC8vIG5vdCBhIHRhcmdldCwgYWJvcnRcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgZHJvcEVsbU1vZGVsID0gZHJhZ2dlZEl0ZW07XG4gICAgICBjb25zdCBkcm9wSW5kZXggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHRhcmdldC5jaGlsZHJlbiwgZWwpO1xuXG4gICAgICBpZiAoZHJvcEluZGV4IDwgMCkge1xuICAgICAgICAvLyBkcm9wSW5kZXggaXMgYmFkLi4uIGNhbmNlbFxuICAgICAgICB0aGlzLmRyYWtlLmNhbmNlbCh0cnVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzb3VyY2VDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoc291cmNlKTtcblxuICAgICAgaWYgKHNvdXJjZUNvbXBvbmVudCkge1xuICAgICAgICBjb25zdCBzb3VyY2VNb2RlbCA9IHNvdXJjZUNvbXBvbmVudC5tb2RlbDtcbiAgICAgICAgY29uc3QgdGFyZ2V0TW9kZWwgPSB0YXJnZXRDb21wb25lbnQubW9kZWw7XG5cbiAgICAgICAgY29uc3QgaGFzRHJhZ01vZGVsID0gISEoc291cmNlTW9kZWwgJiYgZHJhZ2dlZEl0ZW0pO1xuICAgICAgICBjb25zdCBkcmFnSW5kZXggPSBoYXNEcmFnTW9kZWwgPyBzb3VyY2VNb2RlbC5pbmRleE9mKGRyYWdnZWRJdGVtKSA6IC0xO1xuICAgICAgICBpZiAoaGFzRHJhZ01vZGVsICYmIGRyYWdJbmRleCA8IDApIHtcbiAgICAgICAgICAvLyBkcmFnSW5kZXggaXMgYmFkLi4uIGNhbmNlbFxuICAgICAgICAgIHRoaXMuZHJha2UuY2FuY2VsKHRydWUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YXJnZXRNb2RlbCkge1xuICAgICAgICAgIGNvbnN0IHJlb3JkZXIgPSBkcmFnSW5kZXggPiAtMSAmJiBzb3VyY2VNb2RlbCAmJiB0YXJnZXQgPT09IHNvdXJjZTtcbiAgICAgICAgICBjb25zdCBjb3B5ID0gIXNvdXJjZU1vZGVsIHx8IGRyYWdFbG0gIT09IGVsO1xuICAgICAgICAgIGlmIChyZW9yZGVyKSB7XG4gICAgICAgICAgICBzb3VyY2VNb2RlbC5zcGxpY2UoZHJvcEluZGV4LCAwLCBzb3VyY2VNb2RlbC5zcGxpY2UoZHJhZ0luZGV4LCAxKVswXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChlbC5wYXJlbnROb2RlID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvcHkpIHtcbiAgICAgICAgICAgICAgZHJvcEVsbU1vZGVsID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkcm9wRWxtTW9kZWwpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChlbC5wYXJlbnROb2RlICE9PSBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgZWxlbWVudCBiYWNrLCBsZXQgYW5ndWxhciByZW1vdmUgaXRcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWtlLmNhbmNlbCh0cnVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzb3VyY2VNb2RlbC5zcGxpY2UoZHJhZ0luZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhcmdldE1vZGVsLnNwbGljZShkcm9wSW5kZXgsIDAsIGRyb3BFbG1Nb2RlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRhcmdldENvbXBvbmVudC5kcm9wLmVtaXQoe1xuICAgICAgICB0eXBlOiAnZHJvcCcsXG4gICAgICAgIGVsLFxuICAgICAgICBzb3VyY2UsXG4gICAgICAgIHZhbHVlOiBkcm9wRWxtTW9kZWwsXG4gICAgICAgIGRyb3BJbmRleFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdyZW1vdmUnLCAoZWw6IGFueSwgY29udGFpbmVyOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBpZiAodGhpcy5kcm9wcGFibGVNYXAuaGFzKHNvdXJjZSkpIHtcbiAgICAgICAgY29uc3Qgc291cmNlQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KHNvdXJjZSk7XG4gICAgICAgIGNvbnN0IHNvdXJjZU1vZGVsID0gc291cmNlQ29tcG9uZW50Lm1vZGVsO1xuXG4gICAgICAgIGNvbnN0IGRyYWdJbmRleCA9IGRyYWdnZWRJdGVtICYmIHNvdXJjZU1vZGVsID8gc291cmNlTW9kZWwuaW5kZXhPZihkcmFnZ2VkSXRlbSkgOiAtMTtcblxuICAgICAgICBpZiAoZHJhZ0luZGV4ID4gLTEpIHtcbiAgICAgICAgICBpZiAoZWwucGFyZW50Tm9kZSAhPT0gc291cmNlKSB7XG4gICAgICAgICAgICAvLyBhZGQgZWxlbWVudCBiYWNrLCBsZXQgYW5ndWxhciByZW1vdmUgaXRcbiAgICAgICAgICAgIHNvdXJjZS5hcHBlbmRDaGlsZChlbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNvdXJjZU1vZGVsLnNwbGljZShkcmFnSW5kZXgsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgc291cmNlQ29tcG9uZW50LnJlbW92ZS5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAncmVtb3ZlJyxcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZHJha2Uub24oJ2NhbmNlbCcsIChlbDogYW55LCBjb250YWluZXI6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGlmICh0aGlzLmRyb3BwYWJsZU1hcC5oYXMoY29udGFpbmVyKSkge1xuICAgICAgICBjb25zdCBjb250YWluZXJDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoY29udGFpbmVyKTtcbiAgICAgICAgY29udGFpbmVyQ29tcG9uZW50LmNhbmNlbC5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnY2FuY2VsJyxcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZHJha2Uub24oJ292ZXInLCAoZWw6IGFueSwgY29udGFpbmVyOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBpZiAodGhpcy5kcm9wcGFibGVNYXAuaGFzKGNvbnRhaW5lcikpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnRhaW5lckNvbXBvbmVudC5vdmVyLmVtaXQoe1xuICAgICAgICAgIHR5cGU6ICdvdmVyJyxcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZHJha2Uub24oJ291dCcsIChlbDogYW55LCBjb250YWluZXI6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGlmICh0aGlzLmRyb3BwYWJsZU1hcC5oYXMoY29udGFpbmVyKSkge1xuICAgICAgICBjb25zdCBjb250YWluZXJDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoY29udGFpbmVyKTtcbiAgICAgICAgY29udGFpbmVyQ29tcG9uZW50Lm91dC5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnb3V0JyxcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBSZW5kZXJlcjJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IERyYWtlU3RvcmVTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvZHJha2Utc3RvcmUuc2VydmljZSc7XG5cbmxldCBpID0gMTAwMDA7XG5mdW5jdGlvbiBnZXROZXh0SWQoKSB7XG4gIHJldHVybiBpKys7XG59XG5cbi8qKlxuICogTWFrZXMgdGhlIGNvbnRhaW5lciBkcm9wcGFibGUgYW5kIGNoaWxkcmVuIGRyYWdnYWJsZS5cbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZ3hEcm9wcGFibGVdJyB9KVxuZXhwb3J0IGNsYXNzIERyb3BwYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgbW9kZWw6IGFueTtcbiAgQElucHV0KCkgY29weSA9IGZhbHNlO1xuICBASW5wdXQoKSByZW1vdmVPblNwaWxsID0gZmFsc2U7XG4gIEBJbnB1dCgpIG5neERyb3BwYWJsZTogc3RyaW5nO1xuXG4gIEBPdXRwdXQoKSBkcm9wOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBkcmFnOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBvdmVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBvdXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIHJlbW92ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgY2FuY2VsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGdldCBjb250YWluZXIoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGRyb3Bab25lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lIHx8IHRoaXMubmd4RHJvcHBhYmxlIHx8IHRoaXMuZGVmYXVsdFpvbmU7XG4gIH1cbiAgc2V0IGRyb3Bab25lKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fZHJvcFpvbmUgPSB2YWw7XG4gIH1cblxuICBkZWZhdWx0Wm9uZTogc3RyaW5nO1xuICBfZHJvcFpvbmU6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgZHJha2VzU2VydmljZTogRHJha2VTdG9yZVNlcnZpY2UpIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5kZWZhdWx0Wm9uZSA9IGBAQERlZmF1bHREcm9wWm9uZS0ke2dldE5leHRJZCgpfUBAYDtcbiAgICB0aGlzLmRyYWtlc1NlcnZpY2UucmVnaXN0ZXIodGhpcyk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5vdmVyLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuY29udGFpbmVyLCAnZ3Utb3ZlcicpO1xuICAgIH0pO1xuICAgIHRoaXMub3V0LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuY29udGFpbmVyLCAnZ3Utb3ZlcicpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kcmFrZXNTZXJ2aWNlLnJlbW92ZSh0aGlzKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRHJvcHBhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi9uZ3gtZHJvcHBhYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEcmFrZVN0b3JlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2RyYWtlLXN0b3JlLnNlcnZpY2UnO1xuXG4vKipcbiAqIEFkZHMgcHJvcGVydGllcyBhbmQgZXZlbnRzIHRvIGRyYWdnYWJsZSBlbGVtZW50c1xuICpcbiAqIEBleHBvcnRcbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25neERyYWdnYWJsZV0nIH0pXG5leHBvcnQgY2xhc3MgRHJhZ2dhYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBuZ3hEcmFnZ2FibGU6IHN0cmluZ1tdO1xuICBASW5wdXQoKSBtb2RlbDogYW55O1xuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wWm9uZXMoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcFpvbmVzIHx8IHRoaXMubmd4RHJhZ2dhYmxlIHx8IHRoaXMuX3BhcmVudERyb3B6b25lcztcbiAgfVxuICBzZXQgZHJvcFpvbmVzKHZhbDogYW55KSB7XG4gICAgdGhpcy5fZHJvcFpvbmVzID0gdmFsO1xuICB9XG5cbiAgQElucHV0KCdtb3ZlcycpIF9tb3ZlczogYm9vbGVhbiB8ICgoLi4uYXJnczogYW55W10pID0+IGFueSkgPSB0cnVlO1xuXG4gIC8qXG4gIENvbnRlbnRDaGlsZHJlbiBkb2Vzbid0IGdldCBjaGlsZHJlbiBjcmVhdGVkIHdpdGggTmdUZW1wbGF0ZU91dGxldFxuICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTQ4NDJcbiAgSW1wbGVtZW50ZWQgdmlhIHVwZGF0ZUVsZW1lbnRzIG1ldGhvZFxuXG4gIEBDb250ZW50Q2hpbGRyZW4oRHJhZ0hhbmRsZURpcmVjdGl2ZSwge2Rlc2NlbmRhbnRzOiB0cnVlfSlcbiAgaGFuZGxlc0xpc3Q6IFF1ZXJ5TGlzdDxEcmFnSGFuZGxlRGlyZWN0aXZlPjsgKi9cblxuICBoYW5kbGVzOiBhbnlbXSA9IFtdO1xuXG4gIGdldCBoYXNIYW5kbGUoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5oYW5kbGVzLmxlbmd0aDtcbiAgfVxuXG4gIEBPdXRwdXQoKSBkcmFnOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGRyYWdEZWxheTogbnVtYmVyID0gMjAwOyAvLyBtaWxsaXNlY29uZHNcbiAgZHJhZ0RlbGF5ZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIHRvdWNoVGltZW91dDogYW55O1xuXG4gIGdldCBlbGVtZW50KCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIF9kcm9wWm9uZXM6IHN0cmluZ1tdO1xuICBfcGFyZW50RHJvcHpvbmVzOiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgZHJha2VzU2VydmljZTogRHJha2VTdG9yZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBkcm9wcGFibGVEaXJlY3RpdmU6IERyb3BwYWJsZURpcmVjdGl2ZVxuICApIHt9XG5cbiAgLy8gRnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2JldmFjcXVhL2RyYWd1bGEvaXNzdWVzLzI4OSNpc3N1ZWNvbW1lbnQtMjc3MTQzMTcyXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNobW92ZScsIFsnJGV2ZW50J10pXG4gIG9uTW92ZShlOiBFdmVudCkge1xuICAgIGlmICghdGhpcy5fbW92ZXMgfHwgdGhpcy5kcmFnRGVsYXllZCkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRvdWNoVGltZW91dCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigndG91Y2hzdGFydCcpXG4gIG9uRG93bigpIHtcbiAgICBpZiAodGhpcy5fbW92ZXMpIHtcbiAgICAgIHRoaXMudG91Y2hUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuZHJhZ0RlbGF5ZWQgPSBmYWxzZTtcbiAgICAgIH0sIHRoaXMuZHJhZ0RlbGF5KTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd0b3VjaGVuZCcpXG4gIG9uVXAoKSB7XG4gICAgaWYgKHRoaXMuX21vdmVzKSB7XG4gICAgICBjbGVhclRpbWVvdXQoPG51bWJlcj50aGlzLnRvdWNoVGltZW91dCk7XG4gICAgICB0aGlzLmRyYWdEZWxheWVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgdXBkYXRlKCk6IHZvaWQge1xuICAgIHRoaXMuX3BhcmVudERyb3B6b25lcyA9IFt0aGlzLmRyb3BwYWJsZURpcmVjdGl2ZS5kcm9wWm9uZV07XG4gICAgdGhpcy5kcmFrZXNTZXJ2aWNlLnJlZ2lzdGVyRHJhZ2dhYmxlKHRoaXMpO1xuICAgIHRoaXMudXBkYXRlRWxlbWVudHMoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZHJha2VzU2VydmljZS5yZW1vdmVEcmFnZ2FibGUodGhpcyk7XG4gIH1cblxuICB1cGRhdGVFbGVtZW50cygpOiB2b2lkIHtcbiAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IGhhbmRsZXM6IE5vZGVMaXN0ID0gbmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbbmd4ZHJhZ2hhbmRsZV0nKTtcbiAgICB0aGlzLmhhbmRsZXMgPSBBcnJheS5mcm9tKGhhbmRsZXMpLmZpbHRlcigoaDogYW55KSA9PiBmaW5kRmlyc3REcmFnZ2FibGVQYXJlbnQoaCkgPT09IG5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgZnVuY3Rpb24gZmluZEZpcnN0RHJhZ2dhYmxlUGFyZW50KGM6IGFueSkge1xuICAgICAgd2hpbGUgKGMucGFyZW50Tm9kZSkge1xuICAgICAgICBjID0gYy5wYXJlbnROb2RlO1xuICAgICAgICBpZiAoYy5oYXNBdHRyaWJ1dGUgJiYgYy5oYXNBdHRyaWJ1dGUoJ25neGRyYWdnYWJsZScpKSB7XG4gICAgICAgICAgcmV0dXJuIGM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjYW5Nb3ZlKHNvdXJjZT86IGFueSwgaGFuZGxlPzogYW55LCBzaWJsaW5nPzogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9tb3ZlcyA9PT0gJ2Jvb2xlYW4nKSByZXR1cm4gdGhpcy5fbW92ZXM7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9tb3ZlcyA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHRoaXMuX21vdmVzKHRoaXMubW9kZWwsIHNvdXJjZSwgaGFuZGxlLCBzaWJsaW5nKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG1vdmVzKHNvdXJjZTogYW55LCBoYW5kbGU6IGFueSwgc2libGluZzogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmNhbk1vdmUoc291cmNlLCBoYW5kbGUsIHNpYmxpbmcpKSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gdGhpcy5oYXNIYW5kbGUgPyB0aGlzLmhhbmRsZXMuc29tZShoID0+IGhhbmRlbEZvcihoYW5kbGUsIGgpKSA6IHRydWU7XG5cbiAgICBmdW5jdGlvbiBoYW5kZWxGb3IoYzogYW55LCBwOiBhbnkpIHtcbiAgICAgIGlmIChjID09PSBwKSByZXR1cm4gdHJ1ZTtcbiAgICAgIHdoaWxlICgoYyA9IGMucGFyZW50Tm9kZSkgJiYgYyAhPT0gcCk7IC8vIHRzbGludDpkaXNhYmxlLWxpbmVcbiAgICAgIHJldHVybiAhIWM7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlRWxlbWVudHMoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQWRkcyBwcm9wZXJ0aWVzIGFuZCBldmVudHMgdG8gZHJhZyBoYW5kbGUgZWxlbWVudHNcbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZ3hEcmFnSGFuZGxlXScgfSlcbmV4cG9ydCBjbGFzcyBEcmFnSGFuZGxlRGlyZWN0aXZlIHt9XG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENvbnRlbnRDaGlsZCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgRXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEcm9wcGFibGVEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL25neC1kcm9wcGFibGUuZGlyZWN0aXZlJztcblxubGV0IGkgPSAwO1xuZnVuY3Rpb24gZ2V0TmV4dElkKCkge1xuICByZXR1cm4gaSsrO1xufVxuXG4vKipcbiAqIENvbXBvbmVudCB0aGF0IGFsbG93cyBuZXN0ZWQgbmd4RHJvcHBhYmxlIGFuZCBuZ3hEcmFnZ2FibGVzXG4gKlxuICogQGV4cG9ydFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZG5kLWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlOiBgPGRpdlxuICBuZ3hEcm9wcGFibGVcbiAgW2Ryb3Bab25lXT1cImRyb3Bab25lXCJcbiAgW21vZGVsXT1cIm1vZGVsXCJcbiAgW2NvcHldPVwiY29weVwiXG4gIFtuZ0NsYXNzXT1cInsgJ2d1LWVtcHR5JzogIW1vZGVsPy5sZW5ndGggfVwiXG4gIFtyZW1vdmVPblNwaWxsXT1cInJlbW92ZU9uU3BpbGxcIlxuICBjbGFzcz0nbmd4LWRuZC1jb250YWluZXInPlxuICA8bmctY29udGFpbmVyICpuZ0lmPVwibW9kZWxcIj5cbiAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBpdGVtIG9mIG1vZGVsXCI+XG4gICAgICA8bmd4LWRuZC1pdGVtXG4gICAgICAgIG5neERyYWdnYWJsZVxuICAgICAgICBbbW9kZWxdPVwiaXRlbVwiXG4gICAgICAgIFtkcm9wWm9uZV09XCJkcm9wWm9uZVwiXG4gICAgICAgIFtkcm9wWm9uZXNdPVwiZHJvcFpvbmVzXCJcbiAgICAgICAgW2NvcHldPVwiY29weVwiXG4gICAgICAgIFttb3Zlc109XCJtb3Zlc1wiXG4gICAgICAgIFtyZW1vdmVPblNwaWxsXT1cInJlbW92ZU9uU3BpbGxcIlxuICAgICAgICBbZHJvcHBhYmxlSXRlbUNsYXNzXT1cImRyb3BwYWJsZUl0ZW1DbGFzc1wiXG4gICAgICAgIFtkcm9wcGFibGVJdGVtU3R5bGVdPVwiZHJvcHBhYmxlSXRlbVN0eWxlXCI+XG4gICAgICA8L25neC1kbmQtaXRlbT5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgPC9uZy1jb250YWluZXI+XG4gIDxuZy1jb250ZW50ICpuZ0lmPVwiIW1vZGVsXCI+PC9uZy1jb250ZW50PlxuPC9kaXY+XG5gLFxuICBzdHlsZXM6IFtgLm5neC1kbmQtY29udGFpbmVye2JhY2tncm91bmQtY29sb3I6cmdiYSgyNTUsMjU1LDI1NSwuMik7Ym9yZGVyOjJweCBzb2xpZCByZWQ7bWFyZ2luOjEwcHg7cGFkZGluZzoxMHB4fS5uZ3gtZG5kLWNvbnRhaW5lci5ndS1lbXB0eXtib3JkZXI6MnB4IGRvdHRlZCByZWR9Lm5neC1kbmQtY29udGFpbmVyOm50aC1jaGlsZChvZGQpe2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuMil9Lm5neC1kbmQtY29udGFpbmVyIC5leC1tb3ZlZHtiYWNrZ3JvdW5kLWNvbG9yOiNlNzRjM2N9Lm5neC1kbmQtY29udGFpbmVyIC5leC1vdmVye2JhY2tncm91bmQtY29sb3I6cmdiYSgyNTUsMjU1LDI1NSwuMyl9Lm5neC1kbmQtY29udGFpbmVyIC5oYW5kbGV7cGFkZGluZzowIDVweDttYXJnaW4tcmlnaHQ6NXB4O2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuNCk7Y3Vyc29yOm1vdmV9Lm5vLXNlbGVjdHstd2Via2l0LXRvdWNoLWNhbGxvdXQ6bm9uZTstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9LmNsZWFyZml4OjphZnRlcntjb250ZW50OlwiIFwiO2Rpc3BsYXk6YmxvY2s7aGVpZ2h0OjA7Y2xlYXI6Ym90aH1gXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBDb250YWluZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBtb2RlbDogYW55O1xuICBASW5wdXQoKSBjb3B5ID0gZmFsc2U7XG4gIEBJbnB1dCgpIHJlbW92ZU9uU3BpbGwgPSBmYWxzZTtcbiAgQElucHV0KCkgZHJvcHBhYmxlSXRlbUNsYXNzOiBzdHJpbmcgfCAoKG86IGFueSkgPT4gYW55KTtcbiAgQElucHV0KCkgZHJvcHBhYmxlSXRlbVN0eWxlOiBzdHJpbmcgfCAoKG86IGFueSkgPT4gYW55KTtcblxuXG4gIEBJbnB1dCgpIGRyb3Bab25lID0gYEBARGVmYXVsdERyb3Bab25lLSR7Z2V0TmV4dElkKCl9QEBgO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wWm9uZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lcyB8fCB0aGlzLl9kZWZhdWx0Wm9uZXM7XG4gIH1cbiAgc2V0IGRyb3Bab25lcyh2YWwpIHtcbiAgICB0aGlzLl9kcm9wWm9uZXMgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKSBtb3ZlczogKG1vZGVsOiBhbnksIHNvdXJjZTogYW55LCBoYW5kbGU6IGFueSwgc2libGluZzogYW55KSA9PiBib29sZWFuO1xuXG4gIC8vIEBJbnB1dCgpIGNsYXNzZXM6IGFueSA9IHt9O1xuICAvLyBASW5wdXQoKSBkcmFndWxhT3B0aW9uczogYW55O1xuXG4gIEBJbnB1dCgpXG4gIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpXG4gIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpXG4gIEBWaWV3Q2hpbGQoRHJvcHBhYmxlRGlyZWN0aXZlKVxuICBkcm9wcGFibGU6IGFueTtcblxuICBAT3V0cHV0KCkgZHJvcDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgZHJhZzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgb3ZlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgb3V0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSByZW1vdmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIGNhbmNlbDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBfZHJvcFpvbmVzOiBzdHJpbmdbXTtcbiAgX2RlZmF1bHRab25lczogc3RyaW5nW107XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fZGVmYXVsdFpvbmVzID0gW3RoaXMuZHJvcFpvbmVdO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZHJvcHBhYmxlLmRyYWcuc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMuZHJhZy5lbWl0KHYpKTtcbiAgICB0aGlzLmRyb3BwYWJsZS5kcm9wLnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLmRyb3AuZW1pdCh2KSk7XG4gICAgdGhpcy5kcm9wcGFibGUub3Zlci5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5vdmVyLmVtaXQodikpO1xuICAgIHRoaXMuZHJvcHBhYmxlLm91dC5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5vdXQuZW1pdCh2KSk7XG4gICAgdGhpcy5kcm9wcGFibGUucmVtb3ZlLnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLnJlbW92ZS5lbWl0KHYpKTtcbiAgICB0aGlzLmRyb3BwYWJsZS5jYW5jZWwuc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMuY2FuY2VsLmVtaXQodikpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9uLCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb250YWluZXIvY29udGFpbmVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEcmFnZ2FibGVEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL25neC1kcmFnZ2FibGUuZGlyZWN0aXZlJztcblxuLyoqXG4gKiBDb21wb25lbnQgdGhhdCBhbGxvd3MgbmVzdGVkIG5neERyb3BwYWJsZSBhbmQgbmd4RHJhZ2dhYmxlc1xuICogU2hvdWxkIG9ubHkgYmUgdXNlIGluc2lkZSBhIG5neC1kbmQtY29udGFpbmVyXG4gKiBPdXRzaWRlIGEgbmd4LWRuZC1jb250YWluZXIgdXNlIG5neERyb3BwYWJsZVxuICpcbiAqIEBleHBvcnRcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWRuZC1pdGVtJyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGFpbmVyIFtuZ1N3aXRjaF09XCJ0eXBlXCI+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hDYXNlPVwiJ2FycmF5J1wiPlxuICAgIDxuZ3gtZG5kLWNvbnRhaW5lclxuICAgICAgW21vZGVsXT1cIm1vZGVsXCJcbiAgICAgIFt0ZW1wbGF0ZV09XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgW2Ryb3Bab25lXT1cImRyb3Bab25lXCJcbiAgICAgIFtkcm9wWm9uZXNdPVwiZHJvcFpvbmVzXCJcbiAgICAgIFtyZW1vdmVPblNwaWxsXT1cInJlbW92ZU9uU3BpbGxcIlxuICAgICAgW2Ryb3BwYWJsZUl0ZW1DbGFzc109XCJkcm9wcGFibGVJdGVtQ2xhc3NcIlxuICAgICAgW2Ryb3BwYWJsZUl0ZW1TdHlsZV09XCJkcm9wcGFibGVJdGVtU3R5bGVcIlxuICAgICAgW2NvcHldPVwiY29weVwiPlxuICAgIDwvbmd4LWRuZC1jb250YWluZXI+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIidvYmplY3QnXCI+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAqbmdJZj1cImNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImRhdGFcIj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhY29udGFpbmVyLnRlbXBsYXRlXCI+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwibmd4LWRuZC1jb250ZW50XCI+XG4gICAgICAgIHt7bW9kZWwubGFiZWx9fVxuICAgICAgPC9kaXY+XG4gICAgICA8bmd4LWRuZC1jb250YWluZXJcbiAgICAgICAgKm5nSWY9XCJtb2RlbC5jaGlsZHJlblwiXG4gICAgICAgIFttb2RlbF09XCJtb2RlbC5jaGlsZHJlblwiXG4gICAgICAgIFt0ZW1wbGF0ZV09XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgICBbZHJvcFpvbmVdPVwiZHJvcFpvbmVcIlxuICAgICAgICBbZHJvcFpvbmVzXT1cImRyb3Bab25lc1wiXG4gICAgICAgIFtyZW1vdmVPblNwaWxsXT1cInJlbW92ZU9uU3BpbGxcIlxuICAgICAgICBbZHJvcHBhYmxlSXRlbUNsYXNzXT1cImRyb3BwYWJsZUl0ZW1DbGFzc1wiXG4gICAgICAgIFtjb3B5XT1cImNvcHlcIj5cbiAgICAgIDwvbmd4LWRuZC1jb250YWluZXI+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIid1bmRlZmluZWQnXCI+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy1jb250YWluZXIgKm5nU3dpdGNoRGVmYXVsdD5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgICpuZ0lmPVwiY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiZGF0YVwiPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPGRpdlxuICAgICAgKm5nSWY9XCIhY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgIGNsYXNzPVwibmd4LWRuZC1jb250ZW50XCI+XG4gICAgICB7e21vZGVsfX1cbiAgICA8L2Rpdj5cbiAgPC9uZy1jb250YWluZXI+XG5cbjwvbmctY29udGFpbmVyPlxuXG5cblxuXG5cblxuXG5gLFxuICBzdHlsZXM6IFtgLm5neC1kbmQtYm94LC5uZ3gtZG5kLWl0ZW17bWFyZ2luOjEwcHg7cGFkZGluZzoxMHB4O2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuMik7dHJhbnNpdGlvbjpvcGFjaXR5IC40cyBlYXNlLWluLW91dDtib3JkZXI6MXB4IHNvbGlkICNhZGQ4ZTY7ZGlzcGxheTpibG9ja30ubmd4LWRuZC1ib3guaGFzLWhhbmRsZSBbbmd4RHJhZ0hhbmRsZV0sLm5neC1kbmQtYm94Lmhhcy1oYW5kbGUgW25neGRyYWdoYW5kbGVdLC5uZ3gtZG5kLWJveDpub3QoLmhhcy1oYW5kbGUpOm5vdCgubW92ZS1kaXNhYmxlZCksLm5neC1kbmQtaXRlbS5oYXMtaGFuZGxlIFtuZ3hEcmFnSGFuZGxlXSwubmd4LWRuZC1pdGVtLmhhcy1oYW5kbGUgW25neGRyYWdoYW5kbGVdLC5uZ3gtZG5kLWl0ZW06bm90KC5oYXMtaGFuZGxlKTpub3QoLm1vdmUtZGlzYWJsZWQpe2N1cnNvcjptb3ZlO2N1cnNvcjpncmFiO2N1cnNvcjotd2Via2l0LWdyYWJ9Lm5neC1kbmQtYm94IC5uZ3gtZG5kLWNvbnRlbnQsLm5neC1kbmQtaXRlbSAubmd4LWRuZC1jb250ZW50ey13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0ubmd4LWRuZC1ib3g6aG92ZXIsLm5neC1kbmQtaXRlbTpob3Zlcntib3JkZXI6MXB4IHNvbGlkICMwMGZ9Lm5neC1kbmQtYm94e2hlaWdodDo0MHB4O3dpZHRoOjQwcHg7bGluZS1oZWlnaHQ6MjBweDt0ZXh0LWFsaWduOmNlbnRlcjtmbG9hdDpsZWZ0fS5ndS1taXJyb3J7cG9zaXRpb246Zml4ZWQhaW1wb3J0YW50O21hcmdpbjowIWltcG9ydGFudDt6LWluZGV4Ojk5OTkhaW1wb3J0YW50O29wYWNpdHk6Ljh9Lmd1LWhpZGV7ZGlzcGxheTpub25lIWltcG9ydGFudH0uZ3UtdW5zZWxlY3RhYmxley13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZSFpbXBvcnRhbnQ7LW1vei11c2VyLXNlbGVjdDpub25lIWltcG9ydGFudDstbXMtdXNlci1zZWxlY3Q6bm9uZSFpbXBvcnRhbnQ7dXNlci1zZWxlY3Q6bm9uZSFpbXBvcnRhbnR9Lmd1LXRyYW5zaXR7b3BhY2l0eTouMn1gXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgbW9kZWw6IGFueTtcblxuICBASW5wdXQoKVxuICBnZXQgZHJvcFpvbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lIHx8IHRoaXMuY29udGFpbmVyLmRyb3Bab25lO1xuICB9XG4gIHNldCBkcm9wWm9uZSh2YWwpIHtcbiAgICB0aGlzLl9kcm9wWm9uZSA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wWm9uZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lcyB8fCB0aGlzLmNvbnRhaW5lci5kcm9wWm9uZXM7XG4gIH1cbiAgc2V0IGRyb3Bab25lcyh2YWwpIHtcbiAgICB0aGlzLl9kcm9wWm9uZXMgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgZHJvcHBhYmxlSXRlbUNsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLl9kcm9wcGFibGVJdGVtQ2xhc3MgfHwgdGhpcy5jb250YWluZXIuZHJvcHBhYmxlSXRlbUNsYXNzO1xuICB9XG4gIHNldCBkcm9wcGFibGVJdGVtQ2xhc3ModmFsKSB7XG4gICAgdGhpcy5fZHJvcHBhYmxlSXRlbUNsYXNzID0gdmFsO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGRyb3BwYWJsZUl0ZW1TdHlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcHBhYmxlSXRlbVN0eWxlIHx8IHRoaXMuY29udGFpbmVyLmRyb3BwYWJsZUl0ZW1TdHlsZTtcbiAgfVxuICBzZXQgZHJvcHBhYmxlSXRlbVN0eWxlKHZhbCkge1xuICAgIHRoaXMuX2Ryb3BwYWJsZUl0ZW1TdHlsZSA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCByZW1vdmVPblNwaWxsKCkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5fcmVtb3ZlT25TcGlsbCA9PT0gJ2Jvb2xlYW4nID8gdGhpcy5fcmVtb3ZlT25TcGlsbCA6IHRoaXMuY29udGFpbmVyLnJlbW92ZU9uU3BpbGw7XG4gIH1cbiAgc2V0IHJlbW92ZU9uU3BpbGwodmFsKSB7XG4gICAgdGhpcy5fcmVtb3ZlT25TcGlsbCA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBjb3B5KCkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5fY29weSA9PT0gJ2Jvb2xlYW4nID8gdGhpcy5fY29weSA6IHRoaXMuY29udGFpbmVyLmNvcHk7XG4gIH1cbiAgc2V0IGNvcHkodmFsKSB7XG4gICAgdGhpcy5fY29weSA9IHZhbDtcbiAgfVxuXG4gIF9jb3B5ID0gZmFsc2U7XG4gIF9kcm9wWm9uZTogYW55O1xuICBfZHJvcFpvbmVzOiBhbnk7XG4gIF9kcm9wcGFibGVJdGVtQ2xhc3M6IGFueTtcbiAgX2Ryb3BwYWJsZUl0ZW1TdHlsZTogYW55O1xuICBfcmVtb3ZlT25TcGlsbCA9IGZhbHNlO1xuICBkYXRhOiBhbnk7XG5cbiAgZ2V0IGhhc0hhbmRsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kcmFnZ2FibGVEaXJlY3RpdmUuaGFzSGFuZGxlO1xuICB9XG5cbiAgZ2V0IG1vdmVEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuZHJhZ2dhYmxlRGlyZWN0aXZlLmNhbk1vdmUoKTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUnKVxuICBnZXQgc3R5bGVTdHJpbmcoKSB7XG4gICAgY29uc3QgaXRlbVN0eWxlID1cbiAgICAgIHR5cGVvZiB0aGlzLmRyb3BwYWJsZUl0ZW1TdHlsZSA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuZHJvcHBhYmxlSXRlbVN0eWxlKHRoaXMubW9kZWwpIDogdGhpcy5kcm9wcGFibGVJdGVtU3R5bGU7XG5cbiAgICBjb25zdCBjbGFzc2VzID0gW2l0ZW1TdHlsZV07XG4gICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBjbGFzc1N0cmluZygpIHtcbiAgICBjb25zdCBpdGVtQ2xhc3MgPVxuICAgICAgdHlwZW9mIHRoaXMuZHJvcHBhYmxlSXRlbUNsYXNzID09PSAnZnVuY3Rpb24nID8gdGhpcy5kcm9wcGFibGVJdGVtQ2xhc3ModGhpcy5tb2RlbCkgOiB0aGlzLmRyb3BwYWJsZUl0ZW1DbGFzcztcblxuICAgIGNvbnN0IGNsYXNzZXMgPSBbJ25neC1kbmQtaXRlbScsIGl0ZW1DbGFzcyB8fCAnJ107XG4gICAgaWYgKHRoaXMubW92ZURpc2FibGVkKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ21vdmUtZGlzYWJsZWQnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGFzSGFuZGxlKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2hhcy1oYW5kbGUnKTtcbiAgICB9XG4gICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5tb2RlbCkpIHtcbiAgICAgIHJldHVybiAnYXJyYXknO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZW9mIHRoaXMubW9kZWw7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29udGFpbmVyOiBDb250YWluZXJDb21wb25lbnQsIHB1YmxpYyBkcmFnZ2FibGVEaXJlY3RpdmU6IERyYWdnYWJsZURpcmVjdGl2ZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmRhdGEgPSB7XG4gICAgICBtb2RlbDogdGhpcy5tb2RlbCxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIGRyb3Bab25lOiB0aGlzLmRyb3Bab25lLFxuICAgICAgdGVtcGxhdGU6IHRoaXMuY29udGFpbmVyLnRlbXBsYXRlXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IERyYWdnYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ3gtZHJhZ2dhYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEcm9wcGFibGVEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmd4LWRyb3BwYWJsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRHJhZ0hhbmRsZURpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ3gtZHJhZy1oYW5kbGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IENvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXIvY29udGFpbmVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRHJha2VTdG9yZVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2RyYWtlLXN0b3JlLnNlcnZpY2UnO1xuXG5jb25zdCBjb21wb25lbnRzID0gW0NvbnRhaW5lckNvbXBvbmVudCwgSXRlbUNvbXBvbmVudF07XG5jb25zdCBkaXJlY3RpdmVzID0gW0RyYWdnYWJsZURpcmVjdGl2ZSwgRHJvcHBhYmxlRGlyZWN0aXZlLCBEcmFnSGFuZGxlRGlyZWN0aXZlXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogWy4uLmNvbXBvbmVudHMsIC4uLmRpcmVjdGl2ZXNdLFxuICBleHBvcnRzOiBbLi4uY29tcG9uZW50cywgLi4uZGlyZWN0aXZlc10sXG4gIHByb3ZpZGVyczogW0RyYWtlU3RvcmVTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hEbkRNb2R1bGUge31cbiJdLCJuYW1lcyI6WyJpIiwiZ2V0TmV4dElkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQU9BLHFCQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQzs7Ozs7OztJQWMvQjs0QkFMdUIsSUFBSSxPQUFPLEVBQTJCOzRCQUN0QyxJQUFJLE9BQU8sRUFBMkI7UUFLM0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNoRCxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FB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