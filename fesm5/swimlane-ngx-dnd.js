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
        "droppableItemStyle": [{ type: HostBinding, args: ['style',] }, { type: Input },],
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpbWxhbmUtbmd4LWRuZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQHN3aW1sYW5lL25neC1kbmQvbGliL3NlcnZpY2VzL2RyYWtlLXN0b3JlLnNlcnZpY2UudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kL2xpYi9kaXJlY3RpdmVzL25neC1kcm9wcGFibGUuZGlyZWN0aXZlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWRuZC9saWIvZGlyZWN0aXZlcy9uZ3gtZHJhZ2dhYmxlLmRpcmVjdGl2ZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1kbmQvbGliL2RpcmVjdGl2ZXMvbmd4LWRyYWctaGFuZGxlLmRpcmVjdGl2ZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1kbmQvbGliL2NvbXBvbmVudHMvY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kL2xpYi9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kL2xpYi9uZ3gtZG5kLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCAqIGFzIGRyYWd1bGFOYW1lc3BhY2UgZnJvbSAnQHN3aW1sYW5lL2RyYWd1bGEnO1xuaW1wb3J0IHsgRHJvcHBhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9uZ3gtZHJvcHBhYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEcmFnZ2FibGVEaXJlY3RpdmUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL25neC1kcmFnZ2FibGUuZGlyZWN0aXZlJztcblxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kaGVyZ2VzL25nLXBhY2thZ3IvaXNzdWVzLzIxN1xuY29uc3QgZHJhZ3VsYSA9IGRyYWd1bGFOYW1lc3BhY2U7XG5cbi8qKlxuICogQ2VudHJhbCBzZXJ2aWNlIHRoYXQgaGFuZGxlcyBhbGwgZXZlbnRzXG4gKlxuICogQGV4cG9ydFxuICovXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIERyYWtlU3RvcmVTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBkcm9wcGFibGVNYXAgPSBuZXcgV2Vha01hcDxhbnksIERyb3BwYWJsZURpcmVjdGl2ZT4oKTtcbiAgcHJpdmF0ZSBkcmFnZ2FibGVNYXAgPSBuZXcgV2Vha01hcDxhbnksIERyYWdnYWJsZURpcmVjdGl2ZT4oKTtcbiAgcHJpdmF0ZSBkcmFndWxhT3B0aW9uczogZHJhZ3VsYU5hbWVzcGFjZS5EcmFndWxhT3B0aW9ucztcbiAgcHJpdmF0ZSBkcmFrZTogZHJhZ3VsYU5hbWVzcGFjZS5EcmFrZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRyYWd1bGFPcHRpb25zID0gdGhpcy5jcmVhdGVEcmFrZU9wdGlvbnMoKTtcbiAgICB0aGlzLmRyYWtlID0gZHJhZ3VsYShbXSwgdGhpcy5kcmFndWxhT3B0aW9ucyk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xuICB9XG5cbiAgcmVnaXN0ZXIoZHJvcHBhYmxlOiBEcm9wcGFibGVEaXJlY3RpdmUpIHtcbiAgICB0aGlzLmRyb3BwYWJsZU1hcC5zZXQoZHJvcHBhYmxlLmNvbnRhaW5lciwgZHJvcHBhYmxlKTtcbiAgICB0aGlzLmRyYWtlLmNvbnRhaW5lcnMucHVzaChkcm9wcGFibGUuY29udGFpbmVyKTtcbiAgfVxuXG4gIHJlbW92ZShkcm9wcGFibGU6IERyb3BwYWJsZURpcmVjdGl2ZSkge1xuICAgIHRoaXMuZHJvcHBhYmxlTWFwLmRlbGV0ZShkcm9wcGFibGUuY29udGFpbmVyKTtcbiAgICBjb25zdCBpZHggPSB0aGlzLmRyYWtlLmNvbnRhaW5lcnMuaW5kZXhPZihkcm9wcGFibGUuY29udGFpbmVyKTtcbiAgICBpZiAoaWR4ID4gLTEpIHtcbiAgICAgIHRoaXMuZHJha2UuY29udGFpbmVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3RlckRyYWdnYWJsZShkcmFnZ2FibGU6IERyYWdnYWJsZURpcmVjdGl2ZSkge1xuICAgIHRoaXMuZHJhZ2dhYmxlTWFwLnNldChkcmFnZ2FibGUuZWxlbWVudCwgZHJhZ2dhYmxlKTtcbiAgfVxuXG4gIHJlbW92ZURyYWdnYWJsZShkcmFnZ2FibGU6IERyYWdnYWJsZURpcmVjdGl2ZSkge1xuICAgIHRoaXMuZHJhZ2dhYmxlTWFwLmRlbGV0ZShkcmFnZ2FibGUuZWxlbWVudCk7XG4gIH1cblxuICBjcmVhdGVEcmFrZU9wdGlvbnMoKTogZHJhZ3VsYU5hbWVzcGFjZS5EcmFndWxhT3B0aW9ucyB7XG4gICAgY29uc3QgYWNjZXB0cyA9IChlbDogYW55LCB0YXJnZXQ6IGFueSAvKiwgc291cmNlOiBhbnksIHNpYmxpbmc6IGFueSAqLykgPT4ge1xuICAgICAgaWYgKGVsLmNvbnRhaW5zKHRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY29uc3QgZWxlbWVudENvbXBvbmVudCA9IHRoaXMuZHJhZ2dhYmxlTWFwLmdldChlbCk7XG4gICAgICBjb25zdCB0YXJnZXRDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQodGFyZ2V0KTtcbiAgICAgIGlmIChlbGVtZW50Q29tcG9uZW50ICYmIHRhcmdldENvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudENvbXBvbmVudC5kcm9wWm9uZXMuaW5jbHVkZXModGFyZ2V0Q29tcG9uZW50LmRyb3Bab25lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICBjb25zdCBjb3B5ID0gKF86IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChzb3VyY2UpO1xuICAgICAgaWYgKHNvdXJjZUNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gc291cmNlQ29tcG9uZW50LmNvcHk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGNvbnN0IG1vdmVzID0gKGVsPzogYW55LCBzb3VyY2U/OiBhbnksIGhhbmRsZT86IGFueSwgc2libGluZz86IGFueSkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudENvbXBvbmVudCA9IHRoaXMuZHJhZ2dhYmxlTWFwLmdldChlbCk7XG4gICAgICBpZiAoZWxlbWVudENvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudENvbXBvbmVudC5tb3Zlcyhzb3VyY2UsIGhhbmRsZSwgc2libGluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHsgYWNjZXB0cywgY29weSwgbW92ZXMsIHJldmVydE9uU3BpbGw6IHRydWUsIGRpcmVjdGlvbjogJ3ZlcnRpY2FsJyB9O1xuICB9XG5cbiAgcmVnaXN0ZXJFdmVudHMoKTogdm9pZCB7XG4gICAgbGV0IGRyYWdFbG06IGFueTtcbiAgICBsZXQgZHJhZ2dlZEl0ZW06IGFueTtcblxuICAgIHRoaXMuZHJha2Uub24oJ2RyYWcnLCAoZWw6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGRyYWdnZWRJdGVtID0gdW5kZWZpbmVkO1xuICAgICAgZHJhZ0VsbSA9IGVsO1xuXG4gICAgICBpZiAoIWVsIHx8ICFzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5kcmFnZ2FibGVNYXAuaGFzKGVsKSkge1xuICAgICAgICBjb25zdCBlbGVtZW50Q29tcG9uZW50ID0gdGhpcy5kcmFnZ2FibGVNYXAuZ2V0KGVsKTtcbiAgICAgICAgZHJhZ2dlZEl0ZW0gPSBlbGVtZW50Q29tcG9uZW50Lm1vZGVsO1xuXG4gICAgICAgIGVsZW1lbnRDb21wb25lbnQuZHJhZy5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnZHJhZycsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZHJvcHBhYmxlTWFwLmhhcyhzb3VyY2UpKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZUNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChzb3VyY2UpO1xuICAgICAgICB0aGlzLmRyYWd1bGFPcHRpb25zLnJlbW92ZU9uU3BpbGwgPSBzb3VyY2VDb21wb25lbnQucmVtb3ZlT25TcGlsbDtcblxuICAgICAgICBzb3VyY2VDb21wb25lbnQuZHJhZy5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnZHJhZycsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHNvdXJjZUNvbXBvbmVudCxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdkcm9wJywgKGVsOiBhbnksIHRhcmdldDogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgY29uc3QgdGFyZ2V0Q29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KHRhcmdldCk7XG5cbiAgICAgIGlmICghdGFyZ2V0Q29tcG9uZW50KSB7XG4gICAgICAgIC8vIG5vdCBhIHRhcmdldCwgYWJvcnRcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgZHJvcEVsbU1vZGVsID0gZHJhZ2dlZEl0ZW07XG4gICAgICBjb25zdCBkcm9wSW5kZXggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHRhcmdldC5jaGlsZHJlbiwgZWwpO1xuXG4gICAgICBpZiAoZHJvcEluZGV4IDwgMCkge1xuICAgICAgICAvLyBkcm9wSW5kZXggaXMgYmFkLi4uIGNhbmNlbFxuICAgICAgICB0aGlzLmRyYWtlLmNhbmNlbCh0cnVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzb3VyY2VDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoc291cmNlKTtcblxuICAgICAgaWYgKHNvdXJjZUNvbXBvbmVudCkge1xuICAgICAgICBjb25zdCBzb3VyY2VNb2RlbCA9IHNvdXJjZUNvbXBvbmVudC5tb2RlbDtcbiAgICAgICAgY29uc3QgdGFyZ2V0TW9kZWwgPSB0YXJnZXRDb21wb25lbnQubW9kZWw7XG5cbiAgICAgICAgY29uc3QgaGFzRHJhZ01vZGVsID0gISEoc291cmNlTW9kZWwgJiYgZHJhZ2dlZEl0ZW0pO1xuICAgICAgICBjb25zdCBkcmFnSW5kZXggPSBoYXNEcmFnTW9kZWwgPyBzb3VyY2VNb2RlbC5pbmRleE9mKGRyYWdnZWRJdGVtKSA6IC0xO1xuICAgICAgICBpZiAoaGFzRHJhZ01vZGVsICYmIGRyYWdJbmRleCA8IDApIHtcbiAgICAgICAgICAvLyBkcmFnSW5kZXggaXMgYmFkLi4uIGNhbmNlbFxuICAgICAgICAgIHRoaXMuZHJha2UuY2FuY2VsKHRydWUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YXJnZXRNb2RlbCkge1xuICAgICAgICAgIGNvbnN0IHJlb3JkZXIgPSBkcmFnSW5kZXggPiAtMSAmJiBzb3VyY2VNb2RlbCAmJiB0YXJnZXQgPT09IHNvdXJjZTtcbiAgICAgICAgICBjb25zdCBjb3B5ID0gIXNvdXJjZU1vZGVsIHx8IGRyYWdFbG0gIT09IGVsO1xuICAgICAgICAgIGlmIChyZW9yZGVyKSB7XG4gICAgICAgICAgICBzb3VyY2VNb2RlbC5zcGxpY2UoZHJvcEluZGV4LCAwLCBzb3VyY2VNb2RlbC5zcGxpY2UoZHJhZ0luZGV4LCAxKVswXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChlbC5wYXJlbnROb2RlID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvcHkpIHtcbiAgICAgICAgICAgICAgZHJvcEVsbU1vZGVsID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkcm9wRWxtTW9kZWwpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChlbC5wYXJlbnROb2RlICE9PSBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgZWxlbWVudCBiYWNrLCBsZXQgYW5ndWxhciByZW1vdmUgaXRcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWtlLmNhbmNlbCh0cnVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzb3VyY2VNb2RlbC5zcGxpY2UoZHJhZ0luZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhcmdldE1vZGVsLnNwbGljZShkcm9wSW5kZXgsIDAsIGRyb3BFbG1Nb2RlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRhcmdldENvbXBvbmVudC5kcm9wLmVtaXQoe1xuICAgICAgICB0eXBlOiAnZHJvcCcsXG4gICAgICAgIGVsLFxuICAgICAgICBzb3VyY2UsXG4gICAgICAgIHZhbHVlOiBkcm9wRWxtTW9kZWwsXG4gICAgICAgIGRyb3BJbmRleFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdyZW1vdmUnLCAoZWw6IGFueSwgY29udGFpbmVyOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBpZiAodGhpcy5kcm9wcGFibGVNYXAuaGFzKHNvdXJjZSkpIHtcbiAgICAgICAgY29uc3Qgc291cmNlQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KHNvdXJjZSk7XG4gICAgICAgIGNvbnN0IHNvdXJjZU1vZGVsID0gc291cmNlQ29tcG9uZW50Lm1vZGVsO1xuXG4gICAgICAgIGNvbnN0IGRyYWdJbmRleCA9IGRyYWdnZWRJdGVtICYmIHNvdXJjZU1vZGVsID8gc291cmNlTW9kZWwuaW5kZXhPZihkcmFnZ2VkSXRlbSkgOiAtMTtcblxuICAgICAgICBpZiAoZHJhZ0luZGV4ID4gLTEpIHtcbiAgICAgICAgICBpZiAoZWwucGFyZW50Tm9kZSAhPT0gc291cmNlKSB7XG4gICAgICAgICAgICAvLyBhZGQgZWxlbWVudCBiYWNrLCBsZXQgYW5ndWxhciByZW1vdmUgaXRcbiAgICAgICAgICAgIHNvdXJjZS5hcHBlbmRDaGlsZChlbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNvdXJjZU1vZGVsLnNwbGljZShkcmFnSW5kZXgsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgc291cmNlQ29tcG9uZW50LnJlbW92ZS5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAncmVtb3ZlJyxcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZHJha2Uub24oJ2NhbmNlbCcsIChlbDogYW55LCBjb250YWluZXI6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGlmICh0aGlzLmRyb3BwYWJsZU1hcC5oYXMoY29udGFpbmVyKSkge1xuICAgICAgICBjb25zdCBjb250YWluZXJDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoY29udGFpbmVyKTtcbiAgICAgICAgY29udGFpbmVyQ29tcG9uZW50LmNhbmNlbC5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnY2FuY2VsJyxcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZHJha2Uub24oJ292ZXInLCAoZWw6IGFueSwgY29udGFpbmVyOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBpZiAodGhpcy5kcm9wcGFibGVNYXAuaGFzKGNvbnRhaW5lcikpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnRhaW5lckNvbXBvbmVudC5vdmVyLmVtaXQoe1xuICAgICAgICAgIHR5cGU6ICdvdmVyJyxcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZHJha2Uub24oJ291dCcsIChlbDogYW55LCBjb250YWluZXI6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGlmICh0aGlzLmRyb3BwYWJsZU1hcC5oYXMoY29udGFpbmVyKSkge1xuICAgICAgICBjb25zdCBjb250YWluZXJDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoY29udGFpbmVyKTtcbiAgICAgICAgY29udGFpbmVyQ29tcG9uZW50Lm91dC5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnb3V0JyxcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBSZW5kZXJlcjJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IERyYWtlU3RvcmVTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvZHJha2Utc3RvcmUuc2VydmljZSc7XG5cbmxldCBpID0gMTAwMDA7XG5mdW5jdGlvbiBnZXROZXh0SWQoKSB7XG4gIHJldHVybiBpKys7XG59XG5cbi8qKlxuICogTWFrZXMgdGhlIGNvbnRhaW5lciBkcm9wcGFibGUgYW5kIGNoaWxkcmVuIGRyYWdnYWJsZS5cbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZ3hEcm9wcGFibGVdJyB9KVxuZXhwb3J0IGNsYXNzIERyb3BwYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgbW9kZWw6IGFueTtcbiAgQElucHV0KCkgY29weSA9IGZhbHNlO1xuICBASW5wdXQoKSByZW1vdmVPblNwaWxsID0gZmFsc2U7XG4gIEBJbnB1dCgpIG5neERyb3BwYWJsZTogc3RyaW5nO1xuXG4gIEBPdXRwdXQoKSBkcm9wOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBkcmFnOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBvdmVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBvdXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIHJlbW92ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgY2FuY2VsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGdldCBjb250YWluZXIoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGRyb3Bab25lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lIHx8IHRoaXMubmd4RHJvcHBhYmxlIHx8IHRoaXMuZGVmYXVsdFpvbmU7XG4gIH1cbiAgc2V0IGRyb3Bab25lKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fZHJvcFpvbmUgPSB2YWw7XG4gIH1cblxuICBkZWZhdWx0Wm9uZTogc3RyaW5nO1xuICBfZHJvcFpvbmU6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgZHJha2VzU2VydmljZTogRHJha2VTdG9yZVNlcnZpY2UpIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5kZWZhdWx0Wm9uZSA9IGBAQERlZmF1bHREcm9wWm9uZS0ke2dldE5leHRJZCgpfUBAYDtcbiAgICB0aGlzLmRyYWtlc1NlcnZpY2UucmVnaXN0ZXIodGhpcyk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5vdmVyLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuY29udGFpbmVyLCAnZ3Utb3ZlcicpO1xuICAgIH0pO1xuICAgIHRoaXMub3V0LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuY29udGFpbmVyLCAnZ3Utb3ZlcicpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kcmFrZXNTZXJ2aWNlLnJlbW92ZSh0aGlzKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRHJvcHBhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi9uZ3gtZHJvcHBhYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEcmFrZVN0b3JlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2RyYWtlLXN0b3JlLnNlcnZpY2UnO1xuXG4vKipcbiAqIEFkZHMgcHJvcGVydGllcyBhbmQgZXZlbnRzIHRvIGRyYWdnYWJsZSBlbGVtZW50c1xuICpcbiAqIEBleHBvcnRcbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25neERyYWdnYWJsZV0nIH0pXG5leHBvcnQgY2xhc3MgRHJhZ2dhYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBuZ3hEcmFnZ2FibGU6IHN0cmluZ1tdO1xuICBASW5wdXQoKSBtb2RlbDogYW55O1xuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wWm9uZXMoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcFpvbmVzIHx8IHRoaXMubmd4RHJhZ2dhYmxlIHx8IHRoaXMuX3BhcmVudERyb3B6b25lcztcbiAgfVxuICBzZXQgZHJvcFpvbmVzKHZhbDogYW55KSB7XG4gICAgdGhpcy5fZHJvcFpvbmVzID0gdmFsO1xuICB9XG5cbiAgQElucHV0KCdtb3ZlcycpIF9tb3ZlczogYm9vbGVhbiB8ICgoLi4uYXJnczogYW55W10pID0+IGFueSkgPSB0cnVlO1xuXG4gIC8qXG4gIENvbnRlbnRDaGlsZHJlbiBkb2Vzbid0IGdldCBjaGlsZHJlbiBjcmVhdGVkIHdpdGggTmdUZW1wbGF0ZU91dGxldFxuICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTQ4NDJcbiAgSW1wbGVtZW50ZWQgdmlhIHVwZGF0ZUVsZW1lbnRzIG1ldGhvZFxuXG4gIEBDb250ZW50Q2hpbGRyZW4oRHJhZ0hhbmRsZURpcmVjdGl2ZSwge2Rlc2NlbmRhbnRzOiB0cnVlfSlcbiAgaGFuZGxlc0xpc3Q6IFF1ZXJ5TGlzdDxEcmFnSGFuZGxlRGlyZWN0aXZlPjsgKi9cblxuICBoYW5kbGVzOiBhbnlbXSA9IFtdO1xuXG4gIGdldCBoYXNIYW5kbGUoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5oYW5kbGVzLmxlbmd0aDtcbiAgfVxuXG4gIEBPdXRwdXQoKSBkcmFnOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGRyYWdEZWxheTogbnVtYmVyID0gMjAwOyAvLyBtaWxsaXNlY29uZHNcbiAgZHJhZ0RlbGF5ZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIHRvdWNoVGltZW91dDogYW55O1xuXG4gIGdldCBlbGVtZW50KCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIF9kcm9wWm9uZXM6IHN0cmluZ1tdO1xuICBfcGFyZW50RHJvcHpvbmVzOiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgZHJha2VzU2VydmljZTogRHJha2VTdG9yZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBkcm9wcGFibGVEaXJlY3RpdmU6IERyb3BwYWJsZURpcmVjdGl2ZVxuICApIHt9XG5cbiAgLy8gRnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2JldmFjcXVhL2RyYWd1bGEvaXNzdWVzLzI4OSNpc3N1ZWNvbW1lbnQtMjc3MTQzMTcyXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNobW92ZScsIFsnJGV2ZW50J10pXG4gIG9uTW92ZShlOiBFdmVudCkge1xuICAgIGlmICghdGhpcy5fbW92ZXMgfHwgdGhpcy5kcmFnRGVsYXllZCkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRvdWNoVGltZW91dCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigndG91Y2hzdGFydCcpXG4gIG9uRG93bigpIHtcbiAgICBpZiAodGhpcy5fbW92ZXMpIHtcbiAgICAgIHRoaXMudG91Y2hUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuZHJhZ0RlbGF5ZWQgPSBmYWxzZTtcbiAgICAgIH0sIHRoaXMuZHJhZ0RlbGF5KTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd0b3VjaGVuZCcpXG4gIG9uVXAoKSB7XG4gICAgaWYgKHRoaXMuX21vdmVzKSB7XG4gICAgICBjbGVhclRpbWVvdXQoPG51bWJlcj50aGlzLnRvdWNoVGltZW91dCk7XG4gICAgICB0aGlzLmRyYWdEZWxheWVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgdXBkYXRlKCk6IHZvaWQge1xuICAgIHRoaXMuX3BhcmVudERyb3B6b25lcyA9IFt0aGlzLmRyb3BwYWJsZURpcmVjdGl2ZS5kcm9wWm9uZV07XG4gICAgdGhpcy5kcmFrZXNTZXJ2aWNlLnJlZ2lzdGVyRHJhZ2dhYmxlKHRoaXMpO1xuICAgIHRoaXMudXBkYXRlRWxlbWVudHMoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZHJha2VzU2VydmljZS5yZW1vdmVEcmFnZ2FibGUodGhpcyk7XG4gIH1cblxuICB1cGRhdGVFbGVtZW50cygpOiB2b2lkIHtcbiAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IGhhbmRsZXM6IE5vZGVMaXN0ID0gbmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbbmd4ZHJhZ2hhbmRsZV0nKTtcbiAgICB0aGlzLmhhbmRsZXMgPSBBcnJheS5mcm9tKGhhbmRsZXMpLmZpbHRlcigoaDogYW55KSA9PiBmaW5kRmlyc3REcmFnZ2FibGVQYXJlbnQoaCkgPT09IG5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgZnVuY3Rpb24gZmluZEZpcnN0RHJhZ2dhYmxlUGFyZW50KGM6IGFueSkge1xuICAgICAgd2hpbGUgKGMucGFyZW50Tm9kZSkge1xuICAgICAgICBjID0gYy5wYXJlbnROb2RlO1xuICAgICAgICBpZiAoYy5oYXNBdHRyaWJ1dGUgJiYgYy5oYXNBdHRyaWJ1dGUoJ25neGRyYWdnYWJsZScpKSB7XG4gICAgICAgICAgcmV0dXJuIGM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjYW5Nb3ZlKHNvdXJjZT86IGFueSwgaGFuZGxlPzogYW55LCBzaWJsaW5nPzogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9tb3ZlcyA9PT0gJ2Jvb2xlYW4nKSByZXR1cm4gdGhpcy5fbW92ZXM7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9tb3ZlcyA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHRoaXMuX21vdmVzKHRoaXMubW9kZWwsIHNvdXJjZSwgaGFuZGxlLCBzaWJsaW5nKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG1vdmVzKHNvdXJjZTogYW55LCBoYW5kbGU6IGFueSwgc2libGluZzogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmNhbk1vdmUoc291cmNlLCBoYW5kbGUsIHNpYmxpbmcpKSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gdGhpcy5oYXNIYW5kbGUgPyB0aGlzLmhhbmRsZXMuc29tZShoID0+IGhhbmRlbEZvcihoYW5kbGUsIGgpKSA6IHRydWU7XG5cbiAgICBmdW5jdGlvbiBoYW5kZWxGb3IoYzogYW55LCBwOiBhbnkpIHtcbiAgICAgIGlmIChjID09PSBwKSByZXR1cm4gdHJ1ZTtcbiAgICAgIHdoaWxlICgoYyA9IGMucGFyZW50Tm9kZSkgJiYgYyAhPT0gcCk7IC8vIHRzbGludDpkaXNhYmxlLWxpbmVcbiAgICAgIHJldHVybiAhIWM7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlRWxlbWVudHMoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQWRkcyBwcm9wZXJ0aWVzIGFuZCBldmVudHMgdG8gZHJhZyBoYW5kbGUgZWxlbWVudHNcbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZ3hEcmFnSGFuZGxlXScgfSlcbmV4cG9ydCBjbGFzcyBEcmFnSGFuZGxlRGlyZWN0aXZlIHt9XG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENvbnRlbnRDaGlsZCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgRXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEcm9wcGFibGVEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL25neC1kcm9wcGFibGUuZGlyZWN0aXZlJztcblxubGV0IGkgPSAwO1xuZnVuY3Rpb24gZ2V0TmV4dElkKCkge1xuICByZXR1cm4gaSsrO1xufVxuXG4vKipcbiAqIENvbXBvbmVudCB0aGF0IGFsbG93cyBuZXN0ZWQgbmd4RHJvcHBhYmxlIGFuZCBuZ3hEcmFnZ2FibGVzXG4gKlxuICogQGV4cG9ydFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZG5kLWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlOiBgPGRpdlxuICBuZ3hEcm9wcGFibGVcbiAgW2Ryb3Bab25lXT1cImRyb3Bab25lXCJcbiAgW21vZGVsXT1cIm1vZGVsXCJcbiAgW2NvcHldPVwiY29weVwiXG4gIFtuZ0NsYXNzXT1cInsgJ2d1LWVtcHR5JzogIW1vZGVsPy5sZW5ndGggfVwiXG4gIFtyZW1vdmVPblNwaWxsXT1cInJlbW92ZU9uU3BpbGxcIlxuICBjbGFzcz0nbmd4LWRuZC1jb250YWluZXInPlxuICA8bmctY29udGFpbmVyICpuZ0lmPVwibW9kZWxcIj5cbiAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBpdGVtIG9mIG1vZGVsXCI+XG4gICAgICA8bmd4LWRuZC1pdGVtXG4gICAgICAgIG5neERyYWdnYWJsZVxuICAgICAgICBbbW9kZWxdPVwiaXRlbVwiXG4gICAgICAgIFtkcm9wWm9uZV09XCJkcm9wWm9uZVwiXG4gICAgICAgIFtkcm9wWm9uZXNdPVwiZHJvcFpvbmVzXCJcbiAgICAgICAgW2NvcHldPVwiY29weVwiXG4gICAgICAgIFttb3Zlc109XCJtb3Zlc1wiXG4gICAgICAgIFtyZW1vdmVPblNwaWxsXT1cInJlbW92ZU9uU3BpbGxcIlxuICAgICAgICBbZHJvcHBhYmxlSXRlbUNsYXNzXT1cImRyb3BwYWJsZUl0ZW1DbGFzc1wiXG4gICAgICAgIFtkcm9wcGFibGVJdGVtU3R5bGVdPVwiZHJvcHBhYmxlSXRlbVN0eWxlXCI+XG4gICAgICA8L25neC1kbmQtaXRlbT5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgPC9uZy1jb250YWluZXI+XG4gIDxuZy1jb250ZW50ICpuZ0lmPVwiIW1vZGVsXCI+PC9uZy1jb250ZW50PlxuPC9kaXY+XG5gLFxuICBzdHlsZXM6IFtgLm5neC1kbmQtY29udGFpbmVye2JhY2tncm91bmQtY29sb3I6cmdiYSgyNTUsMjU1LDI1NSwuMik7Ym9yZGVyOjJweCBzb2xpZCByZWQ7bWFyZ2luOjEwcHg7cGFkZGluZzoxMHB4fS5uZ3gtZG5kLWNvbnRhaW5lci5ndS1lbXB0eXtib3JkZXI6MnB4IGRvdHRlZCByZWR9Lm5neC1kbmQtY29udGFpbmVyOm50aC1jaGlsZChvZGQpe2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuMil9Lm5neC1kbmQtY29udGFpbmVyIC5leC1tb3ZlZHtiYWNrZ3JvdW5kLWNvbG9yOiNlNzRjM2N9Lm5neC1kbmQtY29udGFpbmVyIC5leC1vdmVye2JhY2tncm91bmQtY29sb3I6cmdiYSgyNTUsMjU1LDI1NSwuMyl9Lm5neC1kbmQtY29udGFpbmVyIC5oYW5kbGV7cGFkZGluZzowIDVweDttYXJnaW4tcmlnaHQ6NXB4O2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuNCk7Y3Vyc29yOm1vdmV9Lm5vLXNlbGVjdHstd2Via2l0LXRvdWNoLWNhbGxvdXQ6bm9uZTstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9LmNsZWFyZml4OjphZnRlcntjb250ZW50OlwiIFwiO2Rpc3BsYXk6YmxvY2s7aGVpZ2h0OjA7Y2xlYXI6Ym90aH1gXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBDb250YWluZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBtb2RlbDogYW55O1xuICBASW5wdXQoKSBjb3B5ID0gZmFsc2U7XG4gIEBJbnB1dCgpIHJlbW92ZU9uU3BpbGwgPSBmYWxzZTtcbiAgQElucHV0KCkgZHJvcHBhYmxlSXRlbUNsYXNzOiBzdHJpbmcgfCAoKG86IGFueSkgPT4gYW55KTtcbiAgQElucHV0KCkgZHJvcHBhYmxlSXRlbVN0eWxlOiBzdHJpbmcgfCAoKG86IGFueSkgPT4gYW55KTtcblxuXG4gIEBJbnB1dCgpIGRyb3Bab25lID0gYEBARGVmYXVsdERyb3Bab25lLSR7Z2V0TmV4dElkKCl9QEBgO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wWm9uZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lcyB8fCB0aGlzLl9kZWZhdWx0Wm9uZXM7XG4gIH1cbiAgc2V0IGRyb3Bab25lcyh2YWwpIHtcbiAgICB0aGlzLl9kcm9wWm9uZXMgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKSBtb3ZlczogKG1vZGVsOiBhbnksIHNvdXJjZTogYW55LCBoYW5kbGU6IGFueSwgc2libGluZzogYW55KSA9PiBib29sZWFuO1xuXG4gIC8vIEBJbnB1dCgpIGNsYXNzZXM6IGFueSA9IHt9O1xuICAvLyBASW5wdXQoKSBkcmFndWxhT3B0aW9uczogYW55O1xuXG4gIEBJbnB1dCgpXG4gIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpXG4gIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpXG4gIEBWaWV3Q2hpbGQoRHJvcHBhYmxlRGlyZWN0aXZlKVxuICBkcm9wcGFibGU6IGFueTtcblxuICBAT3V0cHV0KCkgZHJvcDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgZHJhZzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgb3ZlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgb3V0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSByZW1vdmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIGNhbmNlbDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBfZHJvcFpvbmVzOiBzdHJpbmdbXTtcbiAgX2RlZmF1bHRab25lczogc3RyaW5nW107XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fZGVmYXVsdFpvbmVzID0gW3RoaXMuZHJvcFpvbmVdO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZHJvcHBhYmxlLmRyYWcuc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMuZHJhZy5lbWl0KHYpKTtcbiAgICB0aGlzLmRyb3BwYWJsZS5kcm9wLnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLmRyb3AuZW1pdCh2KSk7XG4gICAgdGhpcy5kcm9wcGFibGUub3Zlci5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5vdmVyLmVtaXQodikpO1xuICAgIHRoaXMuZHJvcHBhYmxlLm91dC5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5vdXQuZW1pdCh2KSk7XG4gICAgdGhpcy5kcm9wcGFibGUucmVtb3ZlLnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLnJlbW92ZS5lbWl0KHYpKTtcbiAgICB0aGlzLmRyb3BwYWJsZS5jYW5jZWwuc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMuY2FuY2VsLmVtaXQodikpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9uLCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb250YWluZXIvY29udGFpbmVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEcmFnZ2FibGVEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL25neC1kcmFnZ2FibGUuZGlyZWN0aXZlJztcblxuLyoqXG4gKiBDb21wb25lbnQgdGhhdCBhbGxvd3MgbmVzdGVkIG5neERyb3BwYWJsZSBhbmQgbmd4RHJhZ2dhYmxlc1xuICogU2hvdWxkIG9ubHkgYmUgdXNlIGluc2lkZSBhIG5neC1kbmQtY29udGFpbmVyXG4gKiBPdXRzaWRlIGEgbmd4LWRuZC1jb250YWluZXIgdXNlIG5neERyb3BwYWJsZVxuICpcbiAqIEBleHBvcnRcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWRuZC1pdGVtJyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGFpbmVyIFtuZ1N3aXRjaF09XCJ0eXBlXCI+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hDYXNlPVwiJ2FycmF5J1wiPlxuICAgIDxuZ3gtZG5kLWNvbnRhaW5lclxuICAgICAgW21vZGVsXT1cIm1vZGVsXCJcbiAgICAgIFt0ZW1wbGF0ZV09XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgW2Ryb3Bab25lXT1cImRyb3Bab25lXCJcbiAgICAgIFtkcm9wWm9uZXNdPVwiZHJvcFpvbmVzXCJcbiAgICAgIFtyZW1vdmVPblNwaWxsXT1cInJlbW92ZU9uU3BpbGxcIlxuICAgICAgW2Ryb3BwYWJsZUl0ZW1DbGFzc109XCJkcm9wcGFibGVJdGVtQ2xhc3NcIlxuICAgICAgW2Ryb3BwYWJsZUl0ZW1TdHlsZV09XCJkcm9wcGFibGVJdGVtU3R5bGVcIlxuICAgICAgW2NvcHldPVwiY29weVwiPlxuICAgIDwvbmd4LWRuZC1jb250YWluZXI+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIidvYmplY3QnXCI+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAqbmdJZj1cImNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImRhdGFcIj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhY29udGFpbmVyLnRlbXBsYXRlXCI+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwibmd4LWRuZC1jb250ZW50XCI+XG4gICAgICAgIHt7bW9kZWwubGFiZWx9fVxuICAgICAgPC9kaXY+XG4gICAgICA8bmd4LWRuZC1jb250YWluZXJcbiAgICAgICAgKm5nSWY9XCJtb2RlbC5jaGlsZHJlblwiXG4gICAgICAgIFttb2RlbF09XCJtb2RlbC5jaGlsZHJlblwiXG4gICAgICAgIFt0ZW1wbGF0ZV09XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgICBbZHJvcFpvbmVdPVwiZHJvcFpvbmVcIlxuICAgICAgICBbZHJvcFpvbmVzXT1cImRyb3Bab25lc1wiXG4gICAgICAgIFtyZW1vdmVPblNwaWxsXT1cInJlbW92ZU9uU3BpbGxcIlxuICAgICAgICBbZHJvcHBhYmxlSXRlbUNsYXNzXT1cImRyb3BwYWJsZUl0ZW1DbGFzc1wiXG4gICAgICAgIFtjb3B5XT1cImNvcHlcIj5cbiAgICAgIDwvbmd4LWRuZC1jb250YWluZXI+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIid1bmRlZmluZWQnXCI+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy1jb250YWluZXIgKm5nU3dpdGNoRGVmYXVsdD5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgICpuZ0lmPVwiY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiZGF0YVwiPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPGRpdlxuICAgICAgKm5nSWY9XCIhY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgIGNsYXNzPVwibmd4LWRuZC1jb250ZW50XCI+XG4gICAgICB7e21vZGVsfX1cbiAgICA8L2Rpdj5cbiAgPC9uZy1jb250YWluZXI+XG5cbjwvbmctY29udGFpbmVyPlxuXG5cblxuXG5cblxuXG5gLFxuICBzdHlsZXM6IFtgLm5neC1kbmQtYm94LC5uZ3gtZG5kLWl0ZW17bWFyZ2luOjEwcHg7cGFkZGluZzoxMHB4O2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuMik7dHJhbnNpdGlvbjpvcGFjaXR5IC40cyBlYXNlLWluLW91dDtib3JkZXI6MXB4IHNvbGlkICNhZGQ4ZTY7ZGlzcGxheTpibG9ja30ubmd4LWRuZC1ib3guaGFzLWhhbmRsZSBbbmd4RHJhZ0hhbmRsZV0sLm5neC1kbmQtYm94Lmhhcy1oYW5kbGUgW25neGRyYWdoYW5kbGVdLC5uZ3gtZG5kLWJveDpub3QoLmhhcy1oYW5kbGUpOm5vdCgubW92ZS1kaXNhYmxlZCksLm5neC1kbmQtaXRlbS5oYXMtaGFuZGxlIFtuZ3hEcmFnSGFuZGxlXSwubmd4LWRuZC1pdGVtLmhhcy1oYW5kbGUgW25neGRyYWdoYW5kbGVdLC5uZ3gtZG5kLWl0ZW06bm90KC5oYXMtaGFuZGxlKTpub3QoLm1vdmUtZGlzYWJsZWQpe2N1cnNvcjptb3ZlO2N1cnNvcjpncmFiO2N1cnNvcjotd2Via2l0LWdyYWJ9Lm5neC1kbmQtYm94IC5uZ3gtZG5kLWNvbnRlbnQsLm5neC1kbmQtaXRlbSAubmd4LWRuZC1jb250ZW50ey13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0ubmd4LWRuZC1ib3g6aG92ZXIsLm5neC1kbmQtaXRlbTpob3Zlcntib3JkZXI6MXB4IHNvbGlkICMwMGZ9Lm5neC1kbmQtYm94e2hlaWdodDo0MHB4O3dpZHRoOjQwcHg7bGluZS1oZWlnaHQ6MjBweDt0ZXh0LWFsaWduOmNlbnRlcjtmbG9hdDpsZWZ0fS5ndS1taXJyb3J7cG9zaXRpb246Zml4ZWQhaW1wb3J0YW50O21hcmdpbjowIWltcG9ydGFudDt6LWluZGV4Ojk5OTkhaW1wb3J0YW50O29wYWNpdHk6Ljh9Lmd1LWhpZGV7ZGlzcGxheTpub25lIWltcG9ydGFudH0uZ3UtdW5zZWxlY3RhYmxley13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZSFpbXBvcnRhbnQ7LW1vei11c2VyLXNlbGVjdDpub25lIWltcG9ydGFudDstbXMtdXNlci1zZWxlY3Q6bm9uZSFpbXBvcnRhbnQ7dXNlci1zZWxlY3Q6bm9uZSFpbXBvcnRhbnR9Lmd1LXRyYW5zaXR7b3BhY2l0eTouMn1gXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgbW9kZWw6IGFueTtcblxuICBASW5wdXQoKVxuICBnZXQgZHJvcFpvbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lIHx8IHRoaXMuY29udGFpbmVyLmRyb3Bab25lO1xuICB9XG4gIHNldCBkcm9wWm9uZSh2YWwpIHtcbiAgICB0aGlzLl9kcm9wWm9uZSA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wWm9uZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3Bab25lcyB8fCB0aGlzLmNvbnRhaW5lci5kcm9wWm9uZXM7XG4gIH1cbiAgc2V0IGRyb3Bab25lcyh2YWwpIHtcbiAgICB0aGlzLl9kcm9wWm9uZXMgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgZHJvcHBhYmxlSXRlbUNsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLl9kcm9wcGFibGVJdGVtQ2xhc3MgfHwgdGhpcy5jb250YWluZXIuZHJvcHBhYmxlSXRlbUNsYXNzO1xuICB9XG4gIHNldCBkcm9wcGFibGVJdGVtQ2xhc3ModmFsKSB7XG4gICAgdGhpcy5fZHJvcHBhYmxlSXRlbUNsYXNzID0gdmFsO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZScpXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wcGFibGVJdGVtU3R5bGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3BwYWJsZUl0ZW1TdHlsZSB8fCB0aGlzLmNvbnRhaW5lci5kcm9wcGFibGVJdGVtU3R5bGU7XG4gIH1cbiAgc2V0IGRyb3BwYWJsZUl0ZW1TdHlsZSh2YWwpIHtcbiAgICB0aGlzLl9kcm9wcGFibGVJdGVtU3R5bGUgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgcmVtb3ZlT25TcGlsbCgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuX3JlbW92ZU9uU3BpbGwgPT09ICdib29sZWFuJyA/IHRoaXMuX3JlbW92ZU9uU3BpbGwgOiB0aGlzLmNvbnRhaW5lci5yZW1vdmVPblNwaWxsO1xuICB9XG4gIHNldCByZW1vdmVPblNwaWxsKHZhbCkge1xuICAgIHRoaXMuX3JlbW92ZU9uU3BpbGwgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgY29weSgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuX2NvcHkgPT09ICdib29sZWFuJyA/IHRoaXMuX2NvcHkgOiB0aGlzLmNvbnRhaW5lci5jb3B5O1xuICB9XG4gIHNldCBjb3B5KHZhbCkge1xuICAgIHRoaXMuX2NvcHkgPSB2YWw7XG4gIH1cblxuICBfY29weSA9IGZhbHNlO1xuICBfZHJvcFpvbmU6IGFueTtcbiAgX2Ryb3Bab25lczogYW55O1xuICBfZHJvcHBhYmxlSXRlbUNsYXNzOiBhbnk7XG4gIF9kcm9wcGFibGVJdGVtU3R5bGU6IGFueTtcbiAgX3JlbW92ZU9uU3BpbGwgPSBmYWxzZTtcbiAgZGF0YTogYW55O1xuXG4gIGdldCBoYXNIYW5kbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZHJhZ2dhYmxlRGlyZWN0aXZlLmhhc0hhbmRsZTtcbiAgfVxuXG4gIGdldCBtb3ZlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmRyYWdnYWJsZURpcmVjdGl2ZS5jYW5Nb3ZlKCk7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlJylcbiAgZ2V0IHN0eWxlU3RyaW5nKCkge1xuICAgIGNvbnN0IGl0ZW1TdHlsZSA9XG4gICAgICB0eXBlb2YgdGhpcy5kcm9wcGFibGVJdGVtU3R5bGUgPT09ICdmdW5jdGlvbicgPyB0aGlzLmRyb3BwYWJsZUl0ZW1TdHlsZSh0aGlzLm1vZGVsKSA6IHRoaXMuZHJvcHBhYmxlSXRlbVN0eWxlO1xuXG4gICAgY29uc3QgY2xhc3NlcyA9IFtpdGVtU3R5bGVdO1xuICAgIHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxuICBnZXQgY2xhc3NTdHJpbmcoKSB7XG4gICAgY29uc3QgaXRlbUNsYXNzID1cbiAgICAgIHR5cGVvZiB0aGlzLmRyb3BwYWJsZUl0ZW1DbGFzcyA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuZHJvcHBhYmxlSXRlbUNsYXNzKHRoaXMubW9kZWwpIDogdGhpcy5kcm9wcGFibGVJdGVtQ2xhc3M7XG5cbiAgICBjb25zdCBjbGFzc2VzID0gWyduZ3gtZG5kLWl0ZW0nLCBpdGVtQ2xhc3MgfHwgJyddO1xuICAgIGlmICh0aGlzLm1vdmVEaXNhYmxlZCkge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdtb3ZlLWRpc2FibGVkJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmhhc0hhbmRsZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdoYXMtaGFuZGxlJyk7XG4gICAgfVxuICAgIHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMubW9kZWwpKSB7XG4gICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLm1vZGVsO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIGNvbnRhaW5lcjogQ29udGFpbmVyQ29tcG9uZW50LCBwdWJsaWMgZHJhZ2dhYmxlRGlyZWN0aXZlOiBEcmFnZ2FibGVEaXJlY3RpdmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5kYXRhID0ge1xuICAgICAgbW9kZWw6IHRoaXMubW9kZWwsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBkcm9wWm9uZTogdGhpcy5kcm9wWm9uZSxcbiAgICAgIHRlbXBsYXRlOiB0aGlzLmNvbnRhaW5lci50ZW1wbGF0ZVxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBEcmFnZ2FibGVEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmd4LWRyYWdnYWJsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRHJvcHBhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL25neC1kcm9wcGFibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IERyYWdIYW5kbGVEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmd4LWRyYWctaGFuZGxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQnO1xuaW1wb3J0IHsgSXRlbUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9pdGVtL2l0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IERyYWtlU3RvcmVTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9kcmFrZS1zdG9yZS5zZXJ2aWNlJztcblxuY29uc3QgY29tcG9uZW50cyA9IFtDb250YWluZXJDb21wb25lbnQsIEl0ZW1Db21wb25lbnRdO1xuY29uc3QgZGlyZWN0aXZlcyA9IFtEcmFnZ2FibGVEaXJlY3RpdmUsIERyb3BwYWJsZURpcmVjdGl2ZSwgRHJhZ0hhbmRsZURpcmVjdGl2ZV07XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFsuLi5jb21wb25lbnRzLCAuLi5kaXJlY3RpdmVzXSxcbiAgZXhwb3J0czogWy4uLmNvbXBvbmVudHMsIC4uLmRpcmVjdGl2ZXNdLFxuICBwcm92aWRlcnM6IFtEcmFrZVN0b3JlU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgTmd4RG5ETW9kdWxlIHt9XG4iXSwibmFtZXMiOlsiaSIsImdldE5leHRJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFPQSxxQkFBTSxPQUFPLEdBQUcsZ0JBQWdCLENBQUM7Ozs7Ozs7SUFjL0I7NEJBTHVCLElBQUksT0FBTyxFQUEyQjs0QkFDdEMsSUFBSSxPQUFPLEVBQTJCO1FBSzNELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsRUFB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