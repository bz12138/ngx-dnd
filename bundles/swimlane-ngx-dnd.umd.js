(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@swimlane/dragula'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@swimlane/ngx-dnd', ['exports', '@angular/core', '@swimlane/dragula', '@angular/common'], factory) :
    (factory((global.swimlane = global.swimlane || {}, global.swimlane['ngx-dnd'] = {}),global.ng.core,null,global.ng.common));
}(this, (function (exports,i0,dragulaNamespace,common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

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
            { type: i0.Injectable, args: [{ providedIn: 'root' },] },
        ];
        /** @nocollapse */
        DrakeStoreService.ctorParameters = function () { return []; };
        /** @nocollapse */ DrakeStoreService.ngInjectableDef = i0.defineInjectable({ factory: function DrakeStoreService_Factory() { return new DrakeStoreService(); }, token: DrakeStoreService, providedIn: "root" });
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
            this.drop = new i0.EventEmitter();
            this.drag = new i0.EventEmitter();
            this.over = new i0.EventEmitter();
            this.out = new i0.EventEmitter();
            this.remove = new i0.EventEmitter();
            this.cancel = new i0.EventEmitter();
        }
        Object.defineProperty(DroppableDirective.prototype, "container", {
            get: /**
             * @return {?}
             */ function () {
                return this.el.nativeElement;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DroppableDirective.prototype, "dropZone", {
            get: /**
             * @return {?}
             */ function () {
                return this._dropZone || this.ngxDroppable || this.defaultZone;
            },
            set: /**
             * @param {?} val
             * @return {?}
             */ function (val) {
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
            { type: i0.Directive, args: [{ selector: '[ngxDroppable]' },] },
        ];
        /** @nocollapse */
        DroppableDirective.ctorParameters = function () {
            return [
                { type: i0.ElementRef, },
                { type: i0.Renderer2, },
                { type: DrakeStoreService, },
            ];
        };
        DroppableDirective.propDecorators = {
            "model": [{ type: i0.Input },],
            "copy": [{ type: i0.Input },],
            "removeOnSpill": [{ type: i0.Input },],
            "ngxDroppable": [{ type: i0.Input },],
            "drop": [{ type: i0.Output },],
            "drag": [{ type: i0.Output },],
            "over": [{ type: i0.Output },],
            "out": [{ type: i0.Output },],
            "remove": [{ type: i0.Output },],
            "cancel": [{ type: i0.Output },],
            "dropZone": [{ type: i0.Input },],
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
            this.drag = new i0.EventEmitter();
            this.dragDelay = 200; // milliseconds
            this.dragDelayed = true;
        }
        Object.defineProperty(DraggableDirective.prototype, "dropZones", {
            get: /**
             * @return {?}
             */ function () {
                return this._dropZones || this.ngxDraggable || this._parentDropzones;
            },
            set: /**
             * @param {?} val
             * @return {?}
             */ function (val) {
                this._dropZones = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DraggableDirective.prototype, "hasHandle", {
            get: /**
             * @return {?}
             */ function () {
                return !!this.handles.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DraggableDirective.prototype, "element", {
            get: /**
             * @return {?}
             */ function () {
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
            { type: i0.Directive, args: [{ selector: '[ngxDraggable]' },] },
        ];
        /** @nocollapse */
        DraggableDirective.ctorParameters = function () {
            return [
                { type: i0.ElementRef, },
                { type: DrakeStoreService, },
                { type: DroppableDirective, },
            ];
        };
        DraggableDirective.propDecorators = {
            "ngxDraggable": [{ type: i0.Input },],
            "model": [{ type: i0.Input },],
            "dropZones": [{ type: i0.Input },],
            "_moves": [{ type: i0.Input, args: ['moves',] },],
            "drag": [{ type: i0.Output },],
            "onMove": [{ type: i0.HostListener, args: ['touchmove', ['$event'],] },],
            "onDown": [{ type: i0.HostListener, args: ['touchstart',] },],
            "onUp": [{ type: i0.HostListener, args: ['touchend',] },],
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
            { type: i0.Directive, args: [{ selector: '[ngxDragHandle]' },] },
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
            this.drop = new i0.EventEmitter();
            this.drag = new i0.EventEmitter();
            this.over = new i0.EventEmitter();
            this.out = new i0.EventEmitter();
            this.remove = new i0.EventEmitter();
            this.cancel = new i0.EventEmitter();
        }
        Object.defineProperty(ContainerComponent.prototype, "dropZones", {
            get: /**
             * @return {?}
             */ function () {
                return this._dropZones || this._defaultZones;
            },
            set: /**
             * @param {?} val
             * @return {?}
             */ function (val) {
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
            { type: i0.Component, args: [{
                        selector: 'ngx-dnd-container',
                        template: "<div\n  ngxDroppable\n  [dropZone]=\"dropZone\"\n  [model]=\"model\"\n  [copy]=\"copy\"\n  [ngClass]=\"{ 'gu-empty': !model?.length }\"\n  [removeOnSpill]=\"removeOnSpill\"\n  class='ngx-dnd-container'>\n  <ng-container *ngIf=\"model\">\n    <ng-container *ngFor=\"let item of model\">\n      <ngx-dnd-item\n        ngxDraggable\n        [model]=\"item\"\n        [dropZone]=\"dropZone\"\n        [dropZones]=\"dropZones\"\n        [copy]=\"copy\"\n        [moves]=\"moves\"\n        [removeOnSpill]=\"removeOnSpill\"\n        [droppableItemClass]=\"droppableItemClass\"\n        [droppableItemStyle]=\"droppableItemStyle\">\n      </ngx-dnd-item>\n    </ng-container>\n  </ng-container>\n  <ng-content *ngIf=\"!model\"></ng-content>\n</div>\n",
                        styles: [".ngx-dnd-container{background-color:rgba(255,255,255,.2);border:2px solid red;margin:10px;padding:10px}.ngx-dnd-container.gu-empty{border:2px dotted red}.ngx-dnd-container:nth-child(odd){background-color:rgba(0,0,0,.2)}.ngx-dnd-container .ex-moved{background-color:#e74c3c}.ngx-dnd-container .ex-over{background-color:rgba(255,255,255,.3)}.ngx-dnd-container .handle{padding:0 5px;margin-right:5px;background-color:rgba(0,0,0,.4);cursor:move}.no-select{-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.clearfix::after{content:\" \";display:block;height:0;clear:both}"],
                        encapsulation: i0.ViewEncapsulation.None
                    },] },
        ];
        /** @nocollapse */
        ContainerComponent.propDecorators = {
            "model": [{ type: i0.Input },],
            "copy": [{ type: i0.Input },],
            "removeOnSpill": [{ type: i0.Input },],
            "droppableItemClass": [{ type: i0.Input },],
            "droppableItemStyle": [{ type: i0.Input },],
            "dropZone": [{ type: i0.Input },],
            "dropZones": [{ type: i0.Input },],
            "moves": [{ type: i0.Input },],
            "template": [{ type: i0.Input }, { type: i0.ContentChild, args: [i0.TemplateRef,] },],
            "droppable": [{ type: i0.Input }, { type: i0.ViewChild, args: [DroppableDirective,] },],
            "drop": [{ type: i0.Output },],
            "drag": [{ type: i0.Output },],
            "over": [{ type: i0.Output },],
            "out": [{ type: i0.Output },],
            "remove": [{ type: i0.Output },],
            "cancel": [{ type: i0.Output },],
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
             */ function () {
                return this._dropZone || this.container.dropZone;
            },
            set: /**
             * @param {?} val
             * @return {?}
             */ function (val) {
                this._dropZone = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemComponent.prototype, "dropZones", {
            get: /**
             * @return {?}
             */ function () {
                return this._dropZones || this.container.dropZones;
            },
            set: /**
             * @param {?} val
             * @return {?}
             */ function (val) {
                this._dropZones = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemComponent.prototype, "droppableItemClass", {
            get: /**
             * @return {?}
             */ function () {
                return this._droppableItemClass || this.container.droppableItemClass;
            },
            set: /**
             * @param {?} val
             * @return {?}
             */ function (val) {
                this._droppableItemClass = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemComponent.prototype, "droppableItemStyle", {
            get: /**
             * @return {?}
             */ function () {
                return this._droppableItemStyle || this.container.droppableItemStyle;
            },
            set: /**
             * @param {?} val
             * @return {?}
             */ function (val) {
                this._droppableItemStyle = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemComponent.prototype, "removeOnSpill", {
            get: /**
             * @return {?}
             */ function () {
                return typeof this._removeOnSpill === 'boolean' ? this._removeOnSpill : this.container.removeOnSpill;
            },
            set: /**
             * @param {?} val
             * @return {?}
             */ function (val) {
                this._removeOnSpill = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemComponent.prototype, "copy", {
            get: /**
             * @return {?}
             */ function () {
                return typeof this._copy === 'boolean' ? this._copy : this.container.copy;
            },
            set: /**
             * @param {?} val
             * @return {?}
             */ function (val) {
                this._copy = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemComponent.prototype, "hasHandle", {
            get: /**
             * @return {?}
             */ function () {
                return this.draggableDirective.hasHandle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemComponent.prototype, "moveDisabled", {
            get: /**
             * @return {?}
             */ function () {
                return !this.draggableDirective.canMove();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemComponent.prototype, "styleString", {
            get: /**
             * @return {?}
             */ function () {
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
             */ function () {
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
             */ function () {
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
            { type: i0.Component, args: [{
                        selector: 'ngx-dnd-item',
                        template: "<ng-container [ngSwitch]=\"type\">\n\n  <ng-container *ngSwitchCase=\"'array'\">\n    <ngx-dnd-container\n      [model]=\"model\"\n      [template]=\"container.template\"\n      [dropZone]=\"dropZone\"\n      [dropZones]=\"dropZones\"\n      [removeOnSpill]=\"removeOnSpill\"\n      [droppableItemClass]=\"droppableItemClass\"\n      [droppableItemStyle]=\"droppableItemStyle\"\n      [copy]=\"copy\">\n    </ngx-dnd-container>\n  </ng-container>\n\n  <ng-container *ngSwitchCase=\"'object'\">\n    <ng-template\n      *ngIf=\"container.template\"\n      [ngTemplateOutlet]=\"container.template\"\n      [ngTemplateOutletContext]=\"data\">\n    </ng-template>\n    <ng-container *ngIf=\"!container.template\">\n      <div\n        class=\"ngx-dnd-content\">\n        {{model.label}}\n      </div>\n      <ngx-dnd-container\n        *ngIf=\"model.children\"\n        [model]=\"model.children\"\n        [template]=\"container.template\"\n        [dropZone]=\"dropZone\"\n        [dropZones]=\"dropZones\"\n        [removeOnSpill]=\"removeOnSpill\"\n        [droppableItemClass]=\"droppableItemClass\"\n        [copy]=\"copy\">\n      </ngx-dnd-container>\n    </ng-container>\n  </ng-container>\n\n  <ng-container *ngSwitchCase=\"'undefined'\">\n  </ng-container>\n\n  <ng-container *ngSwitchDefault>\n    <ng-template\n      *ngIf=\"container.template\"\n      [ngTemplateOutlet]=\"container.template\"\n      [ngTemplateOutletContext]=\"data\">\n    </ng-template>\n    <div\n      *ngIf=\"!container.template\"\n      class=\"ngx-dnd-content\">\n      {{model}}\n    </div>\n  </ng-container>\n\n</ng-container>\n\n\n\n\n\n\n\n",
                        styles: [".ngx-dnd-box,.ngx-dnd-item{margin:10px;padding:10px;background-color:rgba(0,0,0,.2);transition:opacity .4s ease-in-out;border:1px solid #add8e6;display:block}.ngx-dnd-box.has-handle [ngxDragHandle],.ngx-dnd-box.has-handle [ngxdraghandle],.ngx-dnd-box:not(.has-handle):not(.move-disabled),.ngx-dnd-item.has-handle [ngxDragHandle],.ngx-dnd-item.has-handle [ngxdraghandle],.ngx-dnd-item:not(.has-handle):not(.move-disabled){cursor:move;cursor:grab;cursor:-webkit-grab}.ngx-dnd-box .ngx-dnd-content,.ngx-dnd-item .ngx-dnd-content{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ngx-dnd-box:hover,.ngx-dnd-item:hover{border:1px solid #00f}.ngx-dnd-box{height:40px;width:40px;line-height:20px;text-align:center;float:left}.gu-mirror{position:fixed!important;margin:0!important;z-index:9999!important;opacity:.8}.gu-hide{display:none!important}.gu-unselectable{-webkit-user-select:none!important;-moz-user-select:none!important;-ms-user-select:none!important;user-select:none!important}.gu-transit{opacity:.2}"],
                        encapsulation: i0.ViewEncapsulation.None
                    },] },
        ];
        /** @nocollapse */
        ItemComponent.ctorParameters = function () {
            return [
                { type: ContainerComponent, },
                { type: DraggableDirective, },
            ];
        };
        ItemComponent.propDecorators = {
            "model": [{ type: i0.Input },],
            "dropZone": [{ type: i0.Input },],
            "dropZones": [{ type: i0.Input },],
            "droppableItemClass": [{ type: i0.Input },],
            "droppableItemStyle": [{ type: i0.HostBinding, args: ['style',] }, { type: i0.Input },],
            "removeOnSpill": [{ type: i0.Input },],
            "copy": [{ type: i0.Input },],
            "styleString": [{ type: i0.HostBinding, args: ['style',] },],
            "classString": [{ type: i0.HostBinding, args: ['class',] },],
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
            { type: i0.NgModule, args: [{
                        imports: [common.CommonModule],
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

    exports.DraggableDirective = DraggableDirective;
    exports.DroppableDirective = DroppableDirective;
    exports.DragHandleDirective = DragHandleDirective;
    exports.ItemComponent = ItemComponent;
    exports.ContainerComponent = ContainerComponent;
    exports.DrakeStoreService = DrakeStoreService;
    exports.NgxDnDModule = NgxDnDModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpbWxhbmUtbmd4LWRuZC51bWQuanMubWFwIiwic291cmNlcyI6W251bGwsIm5nOi8vQHN3aW1sYW5lL25neC1kbmQvbGliL3NlcnZpY2VzL2RyYWtlLXN0b3JlLnNlcnZpY2UudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kL2xpYi9kaXJlY3RpdmVzL25neC1kcm9wcGFibGUuZGlyZWN0aXZlLnRzIiwibmc6Ly9Ac3dpbWxhbmUvbmd4LWRuZC9saWIvZGlyZWN0aXZlcy9uZ3gtZHJhZ2dhYmxlLmRpcmVjdGl2ZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1kbmQvbGliL2RpcmVjdGl2ZXMvbmd4LWRyYWctaGFuZGxlLmRpcmVjdGl2ZS50cyIsIm5nOi8vQHN3aW1sYW5lL25neC1kbmQvbGliL2NvbXBvbmVudHMvY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kL2xpYi9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQudHMiLCJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kL2xpYi9uZ3gtZG5kLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IHlbb3BbMF0gJiAyID8gXCJyZXR1cm5cIiA6IG9wWzBdID8gXCJ0aHJvd1wiIDogXCJuZXh0XCJdKSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFswLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0ICogYXMgZHJhZ3VsYU5hbWVzcGFjZSBmcm9tICdAc3dpbWxhbmUvZHJhZ3VsYSc7XG5pbXBvcnQgeyBEcm9wcGFibGVEaXJlY3RpdmUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL25neC1kcm9wcGFibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IERyYWdnYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvbmd4LWRyYWdnYWJsZS5kaXJlY3RpdmUnO1xuXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RoZXJnZXMvbmctcGFja2Fnci9pc3N1ZXMvMjE3XG5jb25zdCBkcmFndWxhID0gZHJhZ3VsYU5hbWVzcGFjZTtcblxuLyoqXG4gKiBDZW50cmFsIHNlcnZpY2UgdGhhdCBoYW5kbGVzIGFsbCBldmVudHNcbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgRHJha2VTdG9yZVNlcnZpY2Uge1xuICBwcml2YXRlIGRyb3BwYWJsZU1hcCA9IG5ldyBXZWFrTWFwPGFueSwgRHJvcHBhYmxlRGlyZWN0aXZlPigpO1xuICBwcml2YXRlIGRyYWdnYWJsZU1hcCA9IG5ldyBXZWFrTWFwPGFueSwgRHJhZ2dhYmxlRGlyZWN0aXZlPigpO1xuICBwcml2YXRlIGRyYWd1bGFPcHRpb25zOiBkcmFndWxhTmFtZXNwYWNlLkRyYWd1bGFPcHRpb25zO1xuICBwcml2YXRlIGRyYWtlOiBkcmFndWxhTmFtZXNwYWNlLkRyYWtlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZHJhZ3VsYU9wdGlvbnMgPSB0aGlzLmNyZWF0ZURyYWtlT3B0aW9ucygpO1xuICAgIHRoaXMuZHJha2UgPSBkcmFndWxhKFtdLCB0aGlzLmRyYWd1bGFPcHRpb25zKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XG4gIH1cblxuICByZWdpc3Rlcihkcm9wcGFibGU6IERyb3BwYWJsZURpcmVjdGl2ZSkge1xuICAgIHRoaXMuZHJvcHBhYmxlTWFwLnNldChkcm9wcGFibGUuY29udGFpbmVyLCBkcm9wcGFibGUpO1xuICAgIHRoaXMuZHJha2UuY29udGFpbmVycy5wdXNoKGRyb3BwYWJsZS5jb250YWluZXIpO1xuICB9XG5cbiAgcmVtb3ZlKGRyb3BwYWJsZTogRHJvcHBhYmxlRGlyZWN0aXZlKSB7XG4gICAgdGhpcy5kcm9wcGFibGVNYXAuZGVsZXRlKGRyb3BwYWJsZS5jb250YWluZXIpO1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuZHJha2UuY29udGFpbmVycy5pbmRleE9mKGRyb3BwYWJsZS5jb250YWluZXIpO1xuICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgdGhpcy5kcmFrZS5jb250YWluZXJzLnNwbGljZShpZHgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyRHJhZ2dhYmxlKGRyYWdnYWJsZTogRHJhZ2dhYmxlRGlyZWN0aXZlKSB7XG4gICAgdGhpcy5kcmFnZ2FibGVNYXAuc2V0KGRyYWdnYWJsZS5lbGVtZW50LCBkcmFnZ2FibGUpO1xuICB9XG5cbiAgcmVtb3ZlRHJhZ2dhYmxlKGRyYWdnYWJsZTogRHJhZ2dhYmxlRGlyZWN0aXZlKSB7XG4gICAgdGhpcy5kcmFnZ2FibGVNYXAuZGVsZXRlKGRyYWdnYWJsZS5lbGVtZW50KTtcbiAgfVxuXG4gIGNyZWF0ZURyYWtlT3B0aW9ucygpOiBkcmFndWxhTmFtZXNwYWNlLkRyYWd1bGFPcHRpb25zIHtcbiAgICBjb25zdCBhY2NlcHRzID0gKGVsOiBhbnksIHRhcmdldDogYW55IC8qLCBzb3VyY2U6IGFueSwgc2libGluZzogYW55ICovKSA9PiB7XG4gICAgICBpZiAoZWwuY29udGFpbnModGFyZ2V0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjb25zdCBlbGVtZW50Q29tcG9uZW50ID0gdGhpcy5kcmFnZ2FibGVNYXAuZ2V0KGVsKTtcbiAgICAgIGNvbnN0IHRhcmdldENvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldCh0YXJnZXQpO1xuICAgICAgaWYgKGVsZW1lbnRDb21wb25lbnQgJiYgdGFyZ2V0Q29tcG9uZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Q29tcG9uZW50LmRyb3Bab25lcy5pbmNsdWRlcyh0YXJnZXRDb21wb25lbnQuZHJvcFpvbmUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIGNvbnN0IGNvcHkgPSAoXzogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KHNvdXJjZSk7XG4gICAgICBpZiAoc291cmNlQ29tcG9uZW50KSB7XG4gICAgICAgIHJldHVybiBzb3VyY2VDb21wb25lbnQuY29weTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgY29uc3QgbW92ZXMgPSAoZWw/OiBhbnksIHNvdXJjZT86IGFueSwgaGFuZGxlPzogYW55LCBzaWJsaW5nPzogYW55KSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50Q29tcG9uZW50ID0gdGhpcy5kcmFnZ2FibGVNYXAuZ2V0KGVsKTtcbiAgICAgIGlmIChlbGVtZW50Q29tcG9uZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Q29tcG9uZW50Lm1vdmVzKHNvdXJjZSwgaGFuZGxlLCBzaWJsaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICByZXR1cm4geyBhY2NlcHRzLCBjb3B5LCBtb3ZlcywgcmV2ZXJ0T25TcGlsbDogdHJ1ZSwgZGlyZWN0aW9uOiAndmVydGljYWwnIH07XG4gIH1cblxuICByZWdpc3RlckV2ZW50cygpOiB2b2lkIHtcbiAgICBsZXQgZHJhZ0VsbTogYW55O1xuICAgIGxldCBkcmFnZ2VkSXRlbTogYW55O1xuXG4gICAgdGhpcy5kcmFrZS5vbignZHJhZycsIChlbDogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgZHJhZ2dlZEl0ZW0gPSB1bmRlZmluZWQ7XG4gICAgICBkcmFnRWxtID0gZWw7XG5cbiAgICAgIGlmICghZWwgfHwgIXNvdXJjZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmRyYWdnYWJsZU1hcC5oYXMoZWwpKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRDb21wb25lbnQgPSB0aGlzLmRyYWdnYWJsZU1hcC5nZXQoZWwpO1xuICAgICAgICBkcmFnZ2VkSXRlbSA9IGVsZW1lbnRDb21wb25lbnQubW9kZWw7XG5cbiAgICAgICAgZWxlbWVudENvbXBvbmVudC5kcmFnLmVtaXQoe1xuICAgICAgICAgIHR5cGU6ICdkcmFnJyxcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgdmFsdWU6IGRyYWdnZWRJdGVtXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5kcm9wcGFibGVNYXAuaGFzKHNvdXJjZSkpIHtcbiAgICAgICAgY29uc3Qgc291cmNlQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KHNvdXJjZSk7XG4gICAgICAgIHRoaXMuZHJhZ3VsYU9wdGlvbnMucmVtb3ZlT25TcGlsbCA9IHNvdXJjZUNvbXBvbmVudC5yZW1vdmVPblNwaWxsO1xuXG4gICAgICAgIHNvdXJjZUNvbXBvbmVudC5kcmFnLmVtaXQoe1xuICAgICAgICAgIHR5cGU6ICdkcmFnJyxcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgc291cmNlQ29tcG9uZW50LFxuICAgICAgICAgIHZhbHVlOiBkcmFnZ2VkSXRlbVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZHJha2Uub24oJ2Ryb3AnLCAoZWw6IGFueSwgdGFyZ2V0OiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXRDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQodGFyZ2V0KTtcblxuICAgICAgaWYgKCF0YXJnZXRDb21wb25lbnQpIHtcbiAgICAgICAgLy8gbm90IGEgdGFyZ2V0LCBhYm9ydFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBkcm9wRWxtTW9kZWwgPSBkcmFnZ2VkSXRlbTtcbiAgICAgIGNvbnN0IGRyb3BJbmRleCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwodGFyZ2V0LmNoaWxkcmVuLCBlbCk7XG5cbiAgICAgIGlmIChkcm9wSW5kZXggPCAwKSB7XG4gICAgICAgIC8vIGRyb3BJbmRleCBpcyBiYWQuLi4gY2FuY2VsXG4gICAgICAgIHRoaXMuZHJha2UuY2FuY2VsKHRydWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNvdXJjZUNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChzb3VyY2UpO1xuXG4gICAgICBpZiAoc291cmNlQ29tcG9uZW50KSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZU1vZGVsID0gc291cmNlQ29tcG9uZW50Lm1vZGVsO1xuICAgICAgICBjb25zdCB0YXJnZXRNb2RlbCA9IHRhcmdldENvbXBvbmVudC5tb2RlbDtcblxuICAgICAgICBjb25zdCBoYXNEcmFnTW9kZWwgPSAhIShzb3VyY2VNb2RlbCAmJiBkcmFnZ2VkSXRlbSk7XG4gICAgICAgIGNvbnN0IGRyYWdJbmRleCA9IGhhc0RyYWdNb2RlbCA/IHNvdXJjZU1vZGVsLmluZGV4T2YoZHJhZ2dlZEl0ZW0pIDogLTE7XG4gICAgICAgIGlmIChoYXNEcmFnTW9kZWwgJiYgZHJhZ0luZGV4IDwgMCkge1xuICAgICAgICAgIC8vIGRyYWdJbmRleCBpcyBiYWQuLi4gY2FuY2VsXG4gICAgICAgICAgdGhpcy5kcmFrZS5jYW5jZWwodHJ1ZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhcmdldE1vZGVsKSB7XG4gICAgICAgICAgY29uc3QgcmVvcmRlciA9IGRyYWdJbmRleCA+IC0xICYmIHNvdXJjZU1vZGVsICYmIHRhcmdldCA9PT0gc291cmNlO1xuICAgICAgICAgIGNvbnN0IGNvcHkgPSAhc291cmNlTW9kZWwgfHwgZHJhZ0VsbSAhPT0gZWw7XG4gICAgICAgICAgaWYgKHJlb3JkZXIpIHtcbiAgICAgICAgICAgIHNvdXJjZU1vZGVsLnNwbGljZShkcm9wSW5kZXgsIDAsIHNvdXJjZU1vZGVsLnNwbGljZShkcmFnSW5kZXgsIDEpWzBdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGVsLnBhcmVudE5vZGUgPT09IHRhcmdldCkge1xuICAgICAgICAgICAgICB0YXJnZXQucmVtb3ZlQ2hpbGQoZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29weSkge1xuICAgICAgICAgICAgICBkcm9wRWxtTW9kZWwgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRyb3BFbG1Nb2RlbCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKGVsLnBhcmVudE5vZGUgIT09IHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIC8vIGFkZCBlbGVtZW50IGJhY2ssIGxldCBhbmd1bGFyIHJlbW92ZSBpdFxuICAgICAgICAgICAgICAgIHRoaXMuZHJha2UuY2FuY2VsKHRydWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNvdXJjZU1vZGVsLnNwbGljZShkcmFnSW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFyZ2V0TW9kZWwuc3BsaWNlKGRyb3BJbmRleCwgMCwgZHJvcEVsbU1vZGVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGFyZ2V0Q29tcG9uZW50LmRyb3AuZW1pdCh7XG4gICAgICAgIHR5cGU6ICdkcm9wJyxcbiAgICAgICAgZWwsXG4gICAgICAgIHNvdXJjZSxcbiAgICAgICAgdmFsdWU6IGRyb3BFbG1Nb2RlbCxcbiAgICAgICAgZHJvcEluZGV4XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuZHJha2Uub24oJ3JlbW92ZScsIChlbDogYW55LCBjb250YWluZXI6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGlmICh0aGlzLmRyb3BwYWJsZU1hcC5oYXMoc291cmNlKSkge1xuICAgICAgICBjb25zdCBzb3VyY2VDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoc291cmNlKTtcbiAgICAgICAgY29uc3Qgc291cmNlTW9kZWwgPSBzb3VyY2VDb21wb25lbnQubW9kZWw7XG5cbiAgICAgICAgY29uc3QgZHJhZ0luZGV4ID0gZHJhZ2dlZEl0ZW0gJiYgc291cmNlTW9kZWwgPyBzb3VyY2VNb2RlbC5pbmRleE9mKGRyYWdnZWRJdGVtKSA6IC0xO1xuXG4gICAgICAgIGlmIChkcmFnSW5kZXggPiAtMSkge1xuICAgICAgICAgIGlmIChlbC5wYXJlbnROb2RlICE9PSBzb3VyY2UpIHtcbiAgICAgICAgICAgIC8vIGFkZCBlbGVtZW50IGJhY2ssIGxldCBhbmd1bGFyIHJlbW92ZSBpdFxuICAgICAgICAgICAgc291cmNlLmFwcGVuZENoaWxkKGVsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc291cmNlTW9kZWwuc3BsaWNlKGRyYWdJbmRleCwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBzb3VyY2VDb21wb25lbnQucmVtb3ZlLmVtaXQoe1xuICAgICAgICAgIHR5cGU6ICdyZW1vdmUnLFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgdmFsdWU6IGRyYWdnZWRJdGVtXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5kcmFrZS5vbignY2FuY2VsJywgKGVsOiBhbnksIGNvbnRhaW5lcjogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgaWYgKHRoaXMuZHJvcHBhYmxlTWFwLmhhcyhjb250YWluZXIpKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lckNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChjb250YWluZXIpO1xuICAgICAgICBjb250YWluZXJDb21wb25lbnQuY2FuY2VsLmVtaXQoe1xuICAgICAgICAgIHR5cGU6ICdjYW5jZWwnLFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgdmFsdWU6IGRyYWdnZWRJdGVtXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5kcmFrZS5vbignb3ZlcicsIChlbDogYW55LCBjb250YWluZXI6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGlmICh0aGlzLmRyb3BwYWJsZU1hcC5oYXMoY29udGFpbmVyKSkge1xuICAgICAgICBjb25zdCBjb250YWluZXJDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoY29udGFpbmVyKTtcbiAgICAgICAgY29udGFpbmVyQ29tcG9uZW50Lm92ZXIuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ292ZXInLFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgdmFsdWU6IGRyYWdnZWRJdGVtXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5kcmFrZS5vbignb3V0JywgKGVsOiBhbnksIGNvbnRhaW5lcjogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgaWYgKHRoaXMuZHJvcHBhYmxlTWFwLmhhcyhjb250YWluZXIpKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lckNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChjb250YWluZXIpO1xuICAgICAgICBjb250YWluZXJDb21wb25lbnQub3V0LmVtaXQoe1xuICAgICAgICAgIHR5cGU6ICdvdXQnLFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgdmFsdWU6IGRyYWdnZWRJdGVtXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIE9uSW5pdCxcbiAgT25EZXN0cm95LFxuICBBZnRlclZpZXdJbml0LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIFJlbmRlcmVyMlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRHJha2VTdG9yZVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9kcmFrZS1zdG9yZS5zZXJ2aWNlJztcblxubGV0IGkgPSAxMDAwMDtcbmZ1bmN0aW9uIGdldE5leHRJZCgpIHtcbiAgcmV0dXJuIGkrKztcbn1cblxuLyoqXG4gKiBNYWtlcyB0aGUgY29udGFpbmVyIGRyb3BwYWJsZSBhbmQgY2hpbGRyZW4gZHJhZ2dhYmxlLlxuICpcbiAqIEBleHBvcnRcbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25neERyb3BwYWJsZV0nIH0pXG5leHBvcnQgY2xhc3MgRHJvcHBhYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBtb2RlbDogYW55O1xuICBASW5wdXQoKSBjb3B5ID0gZmFsc2U7XG4gIEBJbnB1dCgpIHJlbW92ZU9uU3BpbGwgPSBmYWxzZTtcbiAgQElucHV0KCkgbmd4RHJvcHBhYmxlOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgpIGRyb3A6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIGRyYWc6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIG92ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIG91dDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgcmVtb3ZlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBjYW5jZWw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgZ2V0IGNvbnRhaW5lcigpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgZHJvcFpvbmUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcFpvbmUgfHwgdGhpcy5uZ3hEcm9wcGFibGUgfHwgdGhpcy5kZWZhdWx0Wm9uZTtcbiAgfVxuICBzZXQgZHJvcFpvbmUodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9kcm9wWm9uZSA9IHZhbDtcbiAgfVxuXG4gIGRlZmF1bHRab25lOiBzdHJpbmc7XG4gIF9kcm9wWm9uZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBkcmFrZXNTZXJ2aWNlOiBEcmFrZVN0b3JlU2VydmljZSkge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmRlZmF1bHRab25lID0gYEBARGVmYXVsdERyb3Bab25lLSR7Z2V0TmV4dElkKCl9QEBgO1xuICAgIHRoaXMuZHJha2VzU2VydmljZS5yZWdpc3Rlcih0aGlzKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLm92ZXIuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5jb250YWluZXIsICdndS1vdmVyJyk7XG4gICAgfSk7XG4gICAgdGhpcy5vdXQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5jb250YWluZXIsICdndS1vdmVyJyk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRyYWtlc1NlcnZpY2UucmVtb3ZlKHRoaXMpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEcm9wcGFibGVEaXJlY3RpdmUgfSBmcm9tICcuL25neC1kcm9wcGFibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IERyYWtlU3RvcmVTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvZHJha2Utc3RvcmUuc2VydmljZSc7XG5cbi8qKlxuICogQWRkcyBwcm9wZXJ0aWVzIGFuZCBldmVudHMgdG8gZHJhZ2dhYmxlIGVsZW1lbnRzXG4gKlxuICogQGV4cG9ydFxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbmd4RHJhZ2dhYmxlXScgfSlcbmV4cG9ydCBjbGFzcyBEcmFnZ2FibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIG5neERyYWdnYWJsZTogc3RyaW5nW107XG4gIEBJbnB1dCgpIG1vZGVsOiBhbnk7XG5cbiAgQElucHV0KClcbiAgZ2V0IGRyb3Bab25lcygpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9kcm9wWm9uZXMgfHwgdGhpcy5uZ3hEcmFnZ2FibGUgfHwgdGhpcy5fcGFyZW50RHJvcHpvbmVzO1xuICB9XG4gIHNldCBkcm9wWm9uZXModmFsOiBhbnkpIHtcbiAgICB0aGlzLl9kcm9wWm9uZXMgPSB2YWw7XG4gIH1cblxuICBASW5wdXQoJ21vdmVzJykgX21vdmVzOiBib29sZWFuIHwgKCguLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9IHRydWU7XG5cbiAgLypcbiAgQ29udGVudENoaWxkcmVuIGRvZXNuJ3QgZ2V0IGNoaWxkcmVuIGNyZWF0ZWQgd2l0aCBOZ1RlbXBsYXRlT3V0bGV0XG4gIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xNDg0MlxuICBJbXBsZW1lbnRlZCB2aWEgdXBkYXRlRWxlbWVudHMgbWV0aG9kXG5cbiAgQENvbnRlbnRDaGlsZHJlbihEcmFnSGFuZGxlRGlyZWN0aXZlLCB7ZGVzY2VuZGFudHM6IHRydWV9KVxuICBoYW5kbGVzTGlzdDogUXVlcnlMaXN0PERyYWdIYW5kbGVEaXJlY3RpdmU+OyAqL1xuXG4gIGhhbmRsZXM6IGFueVtdID0gW107XG5cbiAgZ2V0IGhhc0hhbmRsZSgpIHtcbiAgICByZXR1cm4gISF0aGlzLmhhbmRsZXMubGVuZ3RoO1xuICB9XG5cbiAgQE91dHB1dCgpIGRyYWc6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgZHJhZ0RlbGF5OiBudW1iZXIgPSAyMDA7IC8vIG1pbGxpc2Vjb25kc1xuICBkcmFnRGVsYXllZDogYm9vbGVhbiA9IHRydWU7XG5cbiAgdG91Y2hUaW1lb3V0OiBhbnk7XG5cbiAgZ2V0IGVsZW1lbnQoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgX2Ryb3Bab25lczogc3RyaW5nW107XG4gIF9wYXJlbnREcm9wem9uZXM6IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBkcmFrZXNTZXJ2aWNlOiBEcmFrZVN0b3JlU2VydmljZSxcbiAgICBwcml2YXRlIGRyb3BwYWJsZURpcmVjdGl2ZTogRHJvcHBhYmxlRGlyZWN0aXZlXG4gICkge31cblxuICAvLyBGcm9tOiBodHRwczovL2dpdGh1Yi5jb20vYmV2YWNxdWEvZHJhZ3VsYS9pc3N1ZXMvMjg5I2lzc3VlY29tbWVudC0yNzcxNDMxNzJcbiAgQEhvc3RMaXN0ZW5lcigndG91Y2htb3ZlJywgWyckZXZlbnQnXSlcbiAgb25Nb3ZlKGU6IEV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLl9tb3ZlcyB8fCB0aGlzLmRyYWdEZWxheWVkKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG91Y2hUaW1lb3V0KTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd0b3VjaHN0YXJ0JylcbiAgb25Eb3duKCkge1xuICAgIGlmICh0aGlzLl9tb3Zlcykge1xuICAgICAgdGhpcy50b3VjaFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5kcmFnRGVsYXllZCA9IGZhbHNlO1xuICAgICAgfSwgdGhpcy5kcmFnRGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNoZW5kJylcbiAgb25VcCgpIHtcbiAgICBpZiAodGhpcy5fbW92ZXMpIHtcbiAgICAgIGNsZWFyVGltZW91dCg8bnVtYmVyPnRoaXMudG91Y2hUaW1lb3V0KTtcbiAgICAgIHRoaXMuZHJhZ0RlbGF5ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICB1cGRhdGUoKTogdm9pZCB7XG4gICAgdGhpcy5fcGFyZW50RHJvcHpvbmVzID0gW3RoaXMuZHJvcHBhYmxlRGlyZWN0aXZlLmRyb3Bab25lXTtcbiAgICB0aGlzLmRyYWtlc1NlcnZpY2UucmVnaXN0ZXJEcmFnZ2FibGUodGhpcyk7XG4gICAgdGhpcy51cGRhdGVFbGVtZW50cygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kcmFrZXNTZXJ2aWNlLnJlbW92ZURyYWdnYWJsZSh0aGlzKTtcbiAgfVxuXG4gIHVwZGF0ZUVsZW1lbnRzKCk6IHZvaWQge1xuICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgaGFuZGxlczogTm9kZUxpc3QgPSBuYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuZ3hkcmFnaGFuZGxlXScpO1xuICAgIHRoaXMuaGFuZGxlcyA9IEFycmF5LmZyb20oaGFuZGxlcykuZmlsdGVyKChoOiBhbnkpID0+IGZpbmRGaXJzdERyYWdnYWJsZVBhcmVudChoKSA9PT0gbmF0aXZlRWxlbWVudCk7XG5cbiAgICBmdW5jdGlvbiBmaW5kRmlyc3REcmFnZ2FibGVQYXJlbnQoYzogYW55KSB7XG4gICAgICB3aGlsZSAoYy5wYXJlbnROb2RlKSB7XG4gICAgICAgIGMgPSBjLnBhcmVudE5vZGU7XG4gICAgICAgIGlmIChjLmhhc0F0dHJpYnV0ZSAmJiBjLmhhc0F0dHJpYnV0ZSgnbmd4ZHJhZ2dhYmxlJykpIHtcbiAgICAgICAgICByZXR1cm4gYztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNhbk1vdmUoc291cmNlPzogYW55LCBoYW5kbGU/OiBhbnksIHNpYmxpbmc/OiBhbnkpOiBib29sZWFuIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX21vdmVzID09PSAnYm9vbGVhbicpIHJldHVybiB0aGlzLl9tb3ZlcztcbiAgICBpZiAodHlwZW9mIHRoaXMuX21vdmVzID09PSAnZnVuY3Rpb24nKSByZXR1cm4gdGhpcy5fbW92ZXModGhpcy5tb2RlbCwgc291cmNlLCBoYW5kbGUsIHNpYmxpbmcpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbW92ZXMoc291cmNlOiBhbnksIGhhbmRsZTogYW55LCBzaWJsaW5nOiBhbnkpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuY2FuTW92ZShzb3VyY2UsIGhhbmRsZSwgc2libGluZykpIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0aGlzLmhhc0hhbmRsZSA/IHRoaXMuaGFuZGxlcy5zb21lKGggPT4gaGFuZGVsRm9yKGhhbmRsZSwgaCkpIDogdHJ1ZTtcblxuICAgIGZ1bmN0aW9uIGhhbmRlbEZvcihjOiBhbnksIHA6IGFueSkge1xuICAgICAgaWYgKGMgPT09IHApIHJldHVybiB0cnVlO1xuICAgICAgd2hpbGUgKChjID0gYy5wYXJlbnROb2RlKSAmJiBjICE9PSBwKTsgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuICAgICAgcmV0dXJuICEhYztcbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGVFbGVtZW50cygpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBBZGRzIHByb3BlcnRpZXMgYW5kIGV2ZW50cyB0byBkcmFnIGhhbmRsZSBlbGVtZW50c1xuICpcbiAqIEBleHBvcnRcbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25neERyYWdIYW5kbGVdJyB9KVxuZXhwb3J0IGNsYXNzIERyYWdIYW5kbGVEaXJlY3RpdmUge31cbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBBZnRlclZpZXdJbml0LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQ29udGVudENoaWxkLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBFdmVudEVtaXR0ZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IERyb3BwYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvbmd4LWRyb3BwYWJsZS5kaXJlY3RpdmUnO1xuXG5sZXQgaSA9IDA7XG5mdW5jdGlvbiBnZXROZXh0SWQoKSB7XG4gIHJldHVybiBpKys7XG59XG5cbi8qKlxuICogQ29tcG9uZW50IHRoYXQgYWxsb3dzIG5lc3RlZCBuZ3hEcm9wcGFibGUgYW5kIG5neERyYWdnYWJsZXNcbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1kbmQtY29udGFpbmVyJyxcbiAgdGVtcGxhdGU6IGA8ZGl2XG4gIG5neERyb3BwYWJsZVxuICBbZHJvcFpvbmVdPVwiZHJvcFpvbmVcIlxuICBbbW9kZWxdPVwibW9kZWxcIlxuICBbY29weV09XCJjb3B5XCJcbiAgW25nQ2xhc3NdPVwieyAnZ3UtZW1wdHknOiAhbW9kZWw/Lmxlbmd0aCB9XCJcbiAgW3JlbW92ZU9uU3BpbGxdPVwicmVtb3ZlT25TcGlsbFwiXG4gIGNsYXNzPSduZ3gtZG5kLWNvbnRhaW5lcic+XG4gIDxuZy1jb250YWluZXIgKm5nSWY9XCJtb2RlbFwiPlxuICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGl0ZW0gb2YgbW9kZWxcIj5cbiAgICAgIDxuZ3gtZG5kLWl0ZW1cbiAgICAgICAgbmd4RHJhZ2dhYmxlXG4gICAgICAgIFttb2RlbF09XCJpdGVtXCJcbiAgICAgICAgW2Ryb3Bab25lXT1cImRyb3Bab25lXCJcbiAgICAgICAgW2Ryb3Bab25lc109XCJkcm9wWm9uZXNcIlxuICAgICAgICBbY29weV09XCJjb3B5XCJcbiAgICAgICAgW21vdmVzXT1cIm1vdmVzXCJcbiAgICAgICAgW3JlbW92ZU9uU3BpbGxdPVwicmVtb3ZlT25TcGlsbFwiXG4gICAgICAgIFtkcm9wcGFibGVJdGVtQ2xhc3NdPVwiZHJvcHBhYmxlSXRlbUNsYXNzXCJcbiAgICAgICAgW2Ryb3BwYWJsZUl0ZW1TdHlsZV09XCJkcm9wcGFibGVJdGVtU3R5bGVcIj5cbiAgICAgIDwvbmd4LWRuZC1pdGVtPlxuICAgIDwvbmctY29udGFpbmVyPlxuICA8L25nLWNvbnRhaW5lcj5cbiAgPG5nLWNvbnRlbnQgKm5nSWY9XCIhbW9kZWxcIj48L25nLWNvbnRlbnQ+XG48L2Rpdj5cbmAsXG4gIHN0eWxlczogW2Aubmd4LWRuZC1jb250YWluZXJ7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDI1NSwyNTUsMjU1LC4yKTtib3JkZXI6MnB4IHNvbGlkIHJlZDttYXJnaW46MTBweDtwYWRkaW5nOjEwcHh9Lm5neC1kbmQtY29udGFpbmVyLmd1LWVtcHR5e2JvcmRlcjoycHggZG90dGVkIHJlZH0ubmd4LWRuZC1jb250YWluZXI6bnRoLWNoaWxkKG9kZCl7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLC4yKX0ubmd4LWRuZC1jb250YWluZXIgLmV4LW1vdmVke2JhY2tncm91bmQtY29sb3I6I2U3NGMzY30ubmd4LWRuZC1jb250YWluZXIgLmV4LW92ZXJ7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDI1NSwyNTUsMjU1LC4zKX0ubmd4LWRuZC1jb250YWluZXIgLmhhbmRsZXtwYWRkaW5nOjAgNXB4O21hcmdpbi1yaWdodDo1cHg7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLC40KTtjdXJzb3I6bW92ZX0ubm8tc2VsZWN0ey13ZWJraXQtdG91Y2gtY2FsbG91dDpub25lOy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0uY2xlYXJmaXg6OmFmdGVye2NvbnRlbnQ6XCIgXCI7ZGlzcGxheTpibG9jaztoZWlnaHQ6MDtjbGVhcjpib3RofWBdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIENvbnRhaW5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgpIG1vZGVsOiBhbnk7XG4gIEBJbnB1dCgpIGNvcHkgPSBmYWxzZTtcbiAgQElucHV0KCkgcmVtb3ZlT25TcGlsbCA9IGZhbHNlO1xuICBASW5wdXQoKSBkcm9wcGFibGVJdGVtQ2xhc3M6IHN0cmluZyB8ICgobzogYW55KSA9PiBhbnkpO1xuICBASW5wdXQoKSBkcm9wcGFibGVJdGVtU3R5bGU6IHN0cmluZyB8ICgobzogYW55KSA9PiBhbnkpO1xuXG5cbiAgQElucHV0KCkgZHJvcFpvbmUgPSBgQEBEZWZhdWx0RHJvcFpvbmUtJHtnZXROZXh0SWQoKX1AQGA7XG5cbiAgQElucHV0KClcbiAgZ2V0IGRyb3Bab25lcygpIHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcFpvbmVzIHx8IHRoaXMuX2RlZmF1bHRab25lcztcbiAgfVxuICBzZXQgZHJvcFpvbmVzKHZhbCkge1xuICAgIHRoaXMuX2Ryb3Bab25lcyA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpIG1vdmVzOiAobW9kZWw6IGFueSwgc291cmNlOiBhbnksIGhhbmRsZTogYW55LCBzaWJsaW5nOiBhbnkpID0+IGJvb2xlYW47XG5cbiAgLy8gQElucHV0KCkgY2xhc3NlczogYW55ID0ge307XG4gIC8vIEBJbnB1dCgpIGRyYWd1bGFPcHRpb25zOiBhbnk7XG5cbiAgQElucHV0KClcbiAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZilcbiAgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KClcbiAgQFZpZXdDaGlsZChEcm9wcGFibGVEaXJlY3RpdmUpXG4gIGRyb3BwYWJsZTogYW55O1xuXG4gIEBPdXRwdXQoKSBkcm9wOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBkcmFnOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBvdmVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBvdXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIHJlbW92ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgY2FuY2VsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIF9kcm9wWm9uZXM6IHN0cmluZ1tdO1xuICBfZGVmYXVsdFpvbmVzOiBzdHJpbmdbXTtcblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9kZWZhdWx0Wm9uZXMgPSBbdGhpcy5kcm9wWm9uZV07XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5kcm9wcGFibGUuZHJhZy5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5kcmFnLmVtaXQodikpO1xuICAgIHRoaXMuZHJvcHBhYmxlLmRyb3Auc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMuZHJvcC5lbWl0KHYpKTtcbiAgICB0aGlzLmRyb3BwYWJsZS5vdmVyLnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLm92ZXIuZW1pdCh2KSk7XG4gICAgdGhpcy5kcm9wcGFibGUub3V0LnN1YnNjcmliZSgodjogYW55KSA9PiB0aGlzLm91dC5lbWl0KHYpKTtcbiAgICB0aGlzLmRyb3BwYWJsZS5yZW1vdmUuc3Vic2NyaWJlKCh2OiBhbnkpID0+IHRoaXMucmVtb3ZlLmVtaXQodikpO1xuICAgIHRoaXMuZHJvcHBhYmxlLmNhbmNlbC5zdWJzY3JpYmUoKHY6IGFueSkgPT4gdGhpcy5jYW5jZWwuZW1pdCh2KSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgVmlld0VuY2Fwc3VsYXRpb24sIEhvc3RCaW5kaW5nIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4uL2NvbnRhaW5lci9jb250YWluZXIuY29tcG9uZW50JztcbmltcG9ydCB7IERyYWdnYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvbmd4LWRyYWdnYWJsZS5kaXJlY3RpdmUnO1xuXG4vKipcbiAqIENvbXBvbmVudCB0aGF0IGFsbG93cyBuZXN0ZWQgbmd4RHJvcHBhYmxlIGFuZCBuZ3hEcmFnZ2FibGVzXG4gKiBTaG91bGQgb25seSBiZSB1c2UgaW5zaWRlIGEgbmd4LWRuZC1jb250YWluZXJcbiAqIE91dHNpZGUgYSBuZ3gtZG5kLWNvbnRhaW5lciB1c2Ugbmd4RHJvcHBhYmxlXG4gKlxuICogQGV4cG9ydFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZG5kLWl0ZW0nLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250YWluZXIgW25nU3dpdGNoXT1cInR5cGVcIj5cblxuICA8bmctY29udGFpbmVyICpuZ1N3aXRjaENhc2U9XCInYXJyYXknXCI+XG4gICAgPG5neC1kbmQtY29udGFpbmVyXG4gICAgICBbbW9kZWxdPVwibW9kZWxcIlxuICAgICAgW3RlbXBsYXRlXT1cImNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICBbZHJvcFpvbmVdPVwiZHJvcFpvbmVcIlxuICAgICAgW2Ryb3Bab25lc109XCJkcm9wWm9uZXNcIlxuICAgICAgW3JlbW92ZU9uU3BpbGxdPVwicmVtb3ZlT25TcGlsbFwiXG4gICAgICBbZHJvcHBhYmxlSXRlbUNsYXNzXT1cImRyb3BwYWJsZUl0ZW1DbGFzc1wiXG4gICAgICBbZHJvcHBhYmxlSXRlbVN0eWxlXT1cImRyb3BwYWJsZUl0ZW1TdHlsZVwiXG4gICAgICBbY29weV09XCJjb3B5XCI+XG4gICAgPC9uZ3gtZG5kLWNvbnRhaW5lcj5cbiAgPC9uZy1jb250YWluZXI+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hDYXNlPVwiJ29iamVjdCdcIj5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgICpuZ0lmPVwiY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiZGF0YVwiPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFjb250YWluZXIudGVtcGxhdGVcIj5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJuZ3gtZG5kLWNvbnRlbnRcIj5cbiAgICAgICAge3ttb2RlbC5sYWJlbH19XG4gICAgICA8L2Rpdj5cbiAgICAgIDxuZ3gtZG5kLWNvbnRhaW5lclxuICAgICAgICAqbmdJZj1cIm1vZGVsLmNoaWxkcmVuXCJcbiAgICAgICAgW21vZGVsXT1cIm1vZGVsLmNoaWxkcmVuXCJcbiAgICAgICAgW3RlbXBsYXRlXT1cImNvbnRhaW5lci50ZW1wbGF0ZVwiXG4gICAgICAgIFtkcm9wWm9uZV09XCJkcm9wWm9uZVwiXG4gICAgICAgIFtkcm9wWm9uZXNdPVwiZHJvcFpvbmVzXCJcbiAgICAgICAgW3JlbW92ZU9uU3BpbGxdPVwicmVtb3ZlT25TcGlsbFwiXG4gICAgICAgIFtkcm9wcGFibGVJdGVtQ2xhc3NdPVwiZHJvcHBhYmxlSXRlbUNsYXNzXCJcbiAgICAgICAgW2NvcHldPVwiY29weVwiPlxuICAgICAgPC9uZ3gtZG5kLWNvbnRhaW5lcj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgPC9uZy1jb250YWluZXI+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hDYXNlPVwiJ3VuZGVmaW5lZCdcIj5cbiAgPC9uZy1jb250YWluZXI+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hEZWZhdWx0PlxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgKm5nSWY9XCJjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJkYXRhXCI+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8ZGl2XG4gICAgICAqbmdJZj1cIiFjb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgY2xhc3M9XCJuZ3gtZG5kLWNvbnRlbnRcIj5cbiAgICAgIHt7bW9kZWx9fVxuICAgIDwvZGl2PlxuICA8L25nLWNvbnRhaW5lcj5cblxuPC9uZy1jb250YWluZXI+XG5cblxuXG5cblxuXG5cbmAsXG4gIHN0eWxlczogW2Aubmd4LWRuZC1ib3gsLm5neC1kbmQtaXRlbXttYXJnaW46MTBweDtwYWRkaW5nOjEwcHg7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLC4yKTt0cmFuc2l0aW9uOm9wYWNpdHkgLjRzIGVhc2UtaW4tb3V0O2JvcmRlcjoxcHggc29saWQgI2FkZDhlNjtkaXNwbGF5OmJsb2NrfS5uZ3gtZG5kLWJveC5oYXMtaGFuZGxlIFtuZ3hEcmFnSGFuZGxlXSwubmd4LWRuZC1ib3guaGFzLWhhbmRsZSBbbmd4ZHJhZ2hhbmRsZV0sLm5neC1kbmQtYm94Om5vdCguaGFzLWhhbmRsZSk6bm90KC5tb3ZlLWRpc2FibGVkKSwubmd4LWRuZC1pdGVtLmhhcy1oYW5kbGUgW25neERyYWdIYW5kbGVdLC5uZ3gtZG5kLWl0ZW0uaGFzLWhhbmRsZSBbbmd4ZHJhZ2hhbmRsZV0sLm5neC1kbmQtaXRlbTpub3QoLmhhcy1oYW5kbGUpOm5vdCgubW92ZS1kaXNhYmxlZCl7Y3Vyc29yOm1vdmU7Y3Vyc29yOmdyYWI7Y3Vyc29yOi13ZWJraXQtZ3JhYn0ubmd4LWRuZC1ib3ggLm5neC1kbmQtY29udGVudCwubmd4LWRuZC1pdGVtIC5uZ3gtZG5kLWNvbnRlbnR7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lfS5uZ3gtZG5kLWJveDpob3Zlciwubmd4LWRuZC1pdGVtOmhvdmVye2JvcmRlcjoxcHggc29saWQgIzAwZn0ubmd4LWRuZC1ib3h7aGVpZ2h0OjQwcHg7d2lkdGg6NDBweDtsaW5lLWhlaWdodDoyMHB4O3RleHQtYWxpZ246Y2VudGVyO2Zsb2F0OmxlZnR9Lmd1LW1pcnJvcntwb3NpdGlvbjpmaXhlZCFpbXBvcnRhbnQ7bWFyZ2luOjAhaW1wb3J0YW50O3otaW5kZXg6OTk5OSFpbXBvcnRhbnQ7b3BhY2l0eTouOH0uZ3UtaGlkZXtkaXNwbGF5Om5vbmUhaW1wb3J0YW50fS5ndS11bnNlbGVjdGFibGV7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lIWltcG9ydGFudDstbW96LXVzZXItc2VsZWN0Om5vbmUhaW1wb3J0YW50Oy1tcy11c2VyLXNlbGVjdDpub25lIWltcG9ydGFudDt1c2VyLXNlbGVjdDpub25lIWltcG9ydGFudH0uZ3UtdHJhbnNpdHtvcGFjaXR5Oi4yfWBdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIEl0ZW1Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSBtb2RlbDogYW55O1xuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wWm9uZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcFpvbmUgfHwgdGhpcy5jb250YWluZXIuZHJvcFpvbmU7XG4gIH1cbiAgc2V0IGRyb3Bab25lKHZhbCkge1xuICAgIHRoaXMuX2Ryb3Bab25lID0gdmFsO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGRyb3Bab25lcygpIHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcFpvbmVzIHx8IHRoaXMuY29udGFpbmVyLmRyb3Bab25lcztcbiAgfVxuICBzZXQgZHJvcFpvbmVzKHZhbCkge1xuICAgIHRoaXMuX2Ryb3Bab25lcyA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBkcm9wcGFibGVJdGVtQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Ryb3BwYWJsZUl0ZW1DbGFzcyB8fCB0aGlzLmNvbnRhaW5lci5kcm9wcGFibGVJdGVtQ2xhc3M7XG4gIH1cbiAgc2V0IGRyb3BwYWJsZUl0ZW1DbGFzcyh2YWwpIHtcbiAgICB0aGlzLl9kcm9wcGFibGVJdGVtQ2xhc3MgPSB2YWw7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlJylcbiAgQElucHV0KClcbiAgZ2V0IGRyb3BwYWJsZUl0ZW1TdHlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZHJvcHBhYmxlSXRlbVN0eWxlIHx8IHRoaXMuY29udGFpbmVyLmRyb3BwYWJsZUl0ZW1TdHlsZTtcbiAgfVxuICBzZXQgZHJvcHBhYmxlSXRlbVN0eWxlKHZhbCkge1xuICAgIHRoaXMuX2Ryb3BwYWJsZUl0ZW1TdHlsZSA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCByZW1vdmVPblNwaWxsKCkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5fcmVtb3ZlT25TcGlsbCA9PT0gJ2Jvb2xlYW4nID8gdGhpcy5fcmVtb3ZlT25TcGlsbCA6IHRoaXMuY29udGFpbmVyLnJlbW92ZU9uU3BpbGw7XG4gIH1cbiAgc2V0IHJlbW92ZU9uU3BpbGwodmFsKSB7XG4gICAgdGhpcy5fcmVtb3ZlT25TcGlsbCA9IHZhbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBjb3B5KCkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5fY29weSA9PT0gJ2Jvb2xlYW4nID8gdGhpcy5fY29weSA6IHRoaXMuY29udGFpbmVyLmNvcHk7XG4gIH1cbiAgc2V0IGNvcHkodmFsKSB7XG4gICAgdGhpcy5fY29weSA9IHZhbDtcbiAgfVxuXG4gIF9jb3B5ID0gZmFsc2U7XG4gIF9kcm9wWm9uZTogYW55O1xuICBfZHJvcFpvbmVzOiBhbnk7XG4gIF9kcm9wcGFibGVJdGVtQ2xhc3M6IGFueTtcbiAgX2Ryb3BwYWJsZUl0ZW1TdHlsZTogYW55O1xuICBfcmVtb3ZlT25TcGlsbCA9IGZhbHNlO1xuICBkYXRhOiBhbnk7XG5cbiAgZ2V0IGhhc0hhbmRsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kcmFnZ2FibGVEaXJlY3RpdmUuaGFzSGFuZGxlO1xuICB9XG5cbiAgZ2V0IG1vdmVEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuZHJhZ2dhYmxlRGlyZWN0aXZlLmNhbk1vdmUoKTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUnKVxuICBnZXQgc3R5bGVTdHJpbmcoKSB7XG4gICAgY29uc3QgaXRlbVN0eWxlID1cbiAgICAgIHR5cGVvZiB0aGlzLmRyb3BwYWJsZUl0ZW1TdHlsZSA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuZHJvcHBhYmxlSXRlbVN0eWxlKHRoaXMubW9kZWwpIDogdGhpcy5kcm9wcGFibGVJdGVtU3R5bGU7XG5cbiAgICBjb25zdCBjbGFzc2VzID0gW2l0ZW1TdHlsZV07XG4gICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBjbGFzc1N0cmluZygpIHtcbiAgICBjb25zdCBpdGVtQ2xhc3MgPVxuICAgICAgdHlwZW9mIHRoaXMuZHJvcHBhYmxlSXRlbUNsYXNzID09PSAnZnVuY3Rpb24nID8gdGhpcy5kcm9wcGFibGVJdGVtQ2xhc3ModGhpcy5tb2RlbCkgOiB0aGlzLmRyb3BwYWJsZUl0ZW1DbGFzcztcblxuICAgIGNvbnN0IGNsYXNzZXMgPSBbJ25neC1kbmQtaXRlbScsIGl0ZW1DbGFzcyB8fCAnJ107XG4gICAgaWYgKHRoaXMubW92ZURpc2FibGVkKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ21vdmUtZGlzYWJsZWQnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGFzSGFuZGxlKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2hhcy1oYW5kbGUnKTtcbiAgICB9XG4gICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5tb2RlbCkpIHtcbiAgICAgIHJldHVybiAnYXJyYXknO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZW9mIHRoaXMubW9kZWw7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29udGFpbmVyOiBDb250YWluZXJDb21wb25lbnQsIHB1YmxpYyBkcmFnZ2FibGVEaXJlY3RpdmU6IERyYWdnYWJsZURpcmVjdGl2ZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmRhdGEgPSB7XG4gICAgICBtb2RlbDogdGhpcy5tb2RlbCxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIGRyb3Bab25lOiB0aGlzLmRyb3Bab25lLFxuICAgICAgdGVtcGxhdGU6IHRoaXMuY29udGFpbmVyLnRlbXBsYXRlXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IERyYWdnYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ3gtZHJhZ2dhYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEcm9wcGFibGVEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmd4LWRyb3BwYWJsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRHJhZ0hhbmRsZURpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ3gtZHJhZy1oYW5kbGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IENvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXIvY29udGFpbmVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRHJha2VTdG9yZVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2RyYWtlLXN0b3JlLnNlcnZpY2UnO1xuXG5jb25zdCBjb21wb25lbnRzID0gW0NvbnRhaW5lckNvbXBvbmVudCwgSXRlbUNvbXBvbmVudF07XG5jb25zdCBkaXJlY3RpdmVzID0gW0RyYWdnYWJsZURpcmVjdGl2ZSwgRHJvcHBhYmxlRGlyZWN0aXZlLCBEcmFnSGFuZGxlRGlyZWN0aXZlXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogWy4uLmNvbXBvbmVudHMsIC4uLmRpcmVjdGl2ZXNdLFxuICBleHBvcnRzOiBbLi4uY29tcG9uZW50cywgLi4uZGlyZWN0aXZlc10sXG4gIHByb3ZpZGVyczogW0RyYWtlU3RvcmVTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hEbkRNb2R1bGUge31cbiJdLCJuYW1lcyI6WyJJbmplY3RhYmxlIiwiRXZlbnRFbWl0dGVyIiwiRGlyZWN0aXZlIiwiRWxlbWVudFJlZiIsIlJlbmRlcmVyMiIsIklucHV0IiwiT3V0cHV0IiwiSG9zdExpc3RlbmVyIiwiaSIsImdldE5leHRJZCIsIkNvbXBvbmVudCIsIlZpZXdFbmNhcHN1bGF0aW9uIiwiQ29udGVudENoaWxkIiwiVGVtcGxhdGVSZWYiLCJWaWV3Q2hpbGQiLCJIb3N0QmluZGluZyIsIk5nTW9kdWxlIiwiQ29tbW9uTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFjQSxhQWlHZ0IsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakMsSUFBSTtZQUNBLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUk7Z0JBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUU7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUFFO2dCQUMvQjtZQUNKLElBQUk7Z0JBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQUUs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