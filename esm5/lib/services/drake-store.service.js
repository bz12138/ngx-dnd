/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as dragulaNamespace from '@swimlane/dragula';
import * as i0 from "@angular/core";
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
    /** @nocollapse */ DrakeStoreService.ngInjectableDef = i0.defineInjectable({ factory: function DrakeStoreService_Factory() { return new DrakeStoreService(); }, token: DrakeStoreService, providedIn: "root" });
    return DrakeStoreService;
}());
export { DrakeStoreService };
function DrakeStoreService_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    DrakeStoreService.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    DrakeStoreService.ctorParameters;
    /** @type {?} */
    DrakeStoreService.prototype.droppableMap;
    /** @type {?} */
    DrakeStoreService.prototype.draggableMap;
    /** @type {?} */
    DrakeStoreService.prototype.dragulaOptions;
    /** @type {?} */
    DrakeStoreService.prototype.drake;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJha2Utc3RvcmUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL2RyYWtlLXN0b3JlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxLQUFLLGdCQUFnQixNQUFNLG1CQUFtQixDQUFDOzs7QUFLdEQscUJBQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDOzs7Ozs7O0lBYy9COzRCQUx1QixJQUFJLE9BQU8sRUFBMkI7NEJBQ3RDLElBQUksT0FBTyxFQUEyQjtRQUszRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQ2hELElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ3ZCOzs7OztJQUVELG9DQUFROzs7O0lBQVIsVUFBUyxTQUE2QjtRQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDakQ7Ozs7O0lBRUQsa0NBQU07Ozs7SUFBTixVQUFPLFNBQTZCO1FBQ2xDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5QyxxQkFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvRCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNa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QyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxVQUFDLEVBQU8sRUFBRSxTQUFjLEVBQUUsTUFBVztZQUN4RCxJQUFJLEtBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNwQyxxQkFBTSxrQkFBa0IsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUQsa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztvQkFDMUIsSUFBSSxFQUFFLEtBQUs7b0JBQ1gsRUFBRSxJQUFBO29CQUNGLFNBQVMsV0FBQTtvQkFDVCxNQUFNLFFBQUE7b0JBQ04sS0FBSyxFQUFFLFdBQVc7aUJBQ25CLENBQUMsQ0FBQzthQUNKO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7O2dCQXZPRixVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7Ozs0QkFkbEM7O1NBZWEsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgKiBhcyBkcmFndWxhTmFtZXNwYWNlIGZyb20gJ0Bzd2ltbGFuZS9kcmFndWxhJztcbmltcG9ydCB7IERyb3BwYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvbmd4LWRyb3BwYWJsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRHJhZ2dhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9uZ3gtZHJhZ2dhYmxlLmRpcmVjdGl2ZSc7XG5cbi8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZGhlcmdlcy9uZy1wYWNrYWdyL2lzc3Vlcy8yMTdcbmNvbnN0IGRyYWd1bGEgPSBkcmFndWxhTmFtZXNwYWNlO1xuXG4vKipcbiAqIENlbnRyYWwgc2VydmljZSB0aGF0IGhhbmRsZXMgYWxsIGV2ZW50c1xuICpcbiAqIEBleHBvcnRcbiAqL1xuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBEcmFrZVN0b3JlU2VydmljZSB7XG4gIHByaXZhdGUgZHJvcHBhYmxlTWFwID0gbmV3IFdlYWtNYXA8YW55LCBEcm9wcGFibGVEaXJlY3RpdmU+KCk7XG4gIHByaXZhdGUgZHJhZ2dhYmxlTWFwID0gbmV3IFdlYWtNYXA8YW55LCBEcmFnZ2FibGVEaXJlY3RpdmU+KCk7XG4gIHByaXZhdGUgZHJhZ3VsYU9wdGlvbnM6IGRyYWd1bGFOYW1lc3BhY2UuRHJhZ3VsYU9wdGlvbnM7XG4gIHByaXZhdGUgZHJha2U6IGRyYWd1bGFOYW1lc3BhY2UuRHJha2U7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kcmFndWxhT3B0aW9ucyA9IHRoaXMuY3JlYXRlRHJha2VPcHRpb25zKCk7XG4gICAgdGhpcy5kcmFrZSA9IGRyYWd1bGEoW10sIHRoaXMuZHJhZ3VsYU9wdGlvbnMpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyKGRyb3BwYWJsZTogRHJvcHBhYmxlRGlyZWN0aXZlKSB7XG4gICAgdGhpcy5kcm9wcGFibGVNYXAuc2V0KGRyb3BwYWJsZS5jb250YWluZXIsIGRyb3BwYWJsZSk7XG4gICAgdGhpcy5kcmFrZS5jb250YWluZXJzLnB1c2goZHJvcHBhYmxlLmNvbnRhaW5lcik7XG4gIH1cblxuICByZW1vdmUoZHJvcHBhYmxlOiBEcm9wcGFibGVEaXJlY3RpdmUpIHtcbiAgICB0aGlzLmRyb3BwYWJsZU1hcC5kZWxldGUoZHJvcHBhYmxlLmNvbnRhaW5lcik7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5kcmFrZS5jb250YWluZXJzLmluZGV4T2YoZHJvcHBhYmxlLmNvbnRhaW5lcik7XG4gICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICB0aGlzLmRyYWtlLmNvbnRhaW5lcnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJEcmFnZ2FibGUoZHJhZ2dhYmxlOiBEcmFnZ2FibGVEaXJlY3RpdmUpIHtcbiAgICB0aGlzLmRyYWdnYWJsZU1hcC5zZXQoZHJhZ2dhYmxlLmVsZW1lbnQsIGRyYWdnYWJsZSk7XG4gIH1cblxuICByZW1vdmVEcmFnZ2FibGUoZHJhZ2dhYmxlOiBEcmFnZ2FibGVEaXJlY3RpdmUpIHtcbiAgICB0aGlzLmRyYWdnYWJsZU1hcC5kZWxldGUoZHJhZ2dhYmxlLmVsZW1lbnQpO1xuICB9XG5cbiAgY3JlYXRlRHJha2VPcHRpb25zKCk6IGRyYWd1bGFOYW1lc3BhY2UuRHJhZ3VsYU9wdGlvbnMge1xuICAgIGNvbnN0IGFjY2VwdHMgPSAoZWw6IGFueSwgdGFyZ2V0OiBhbnkgLyosIHNvdXJjZTogYW55LCBzaWJsaW5nOiBhbnkgKi8pID0+IHtcbiAgICAgIGlmIChlbC5jb250YWlucyh0YXJnZXQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVsZW1lbnRDb21wb25lbnQgPSB0aGlzLmRyYWdnYWJsZU1hcC5nZXQoZWwpO1xuICAgICAgY29uc3QgdGFyZ2V0Q29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KHRhcmdldCk7XG4gICAgICBpZiAoZWxlbWVudENvbXBvbmVudCAmJiB0YXJnZXRDb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRDb21wb25lbnQuZHJvcFpvbmVzLmluY2x1ZGVzKHRhcmdldENvbXBvbmVudC5kcm9wWm9uZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgY29uc3QgY29weSA9IChfOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2VDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoc291cmNlKTtcbiAgICAgIGlmIChzb3VyY2VDb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuIHNvdXJjZUNvbXBvbmVudC5jb3B5O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBjb25zdCBtb3ZlcyA9IChlbD86IGFueSwgc291cmNlPzogYW55LCBoYW5kbGU/OiBhbnksIHNpYmxpbmc/OiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnRDb21wb25lbnQgPSB0aGlzLmRyYWdnYWJsZU1hcC5nZXQoZWwpO1xuICAgICAgaWYgKGVsZW1lbnRDb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRDb21wb25lbnQubW92ZXMoc291cmNlLCBoYW5kbGUsIHNpYmxpbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIHJldHVybiB7IGFjY2VwdHMsIGNvcHksIG1vdmVzLCByZXZlcnRPblNwaWxsOiB0cnVlLCBkaXJlY3Rpb246ICd2ZXJ0aWNhbCcgfTtcbiAgfVxuXG4gIHJlZ2lzdGVyRXZlbnRzKCk6IHZvaWQge1xuICAgIGxldCBkcmFnRWxtOiBhbnk7XG4gICAgbGV0IGRyYWdnZWRJdGVtOiBhbnk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdkcmFnJywgKGVsOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBkcmFnZ2VkSXRlbSA9IHVuZGVmaW5lZDtcbiAgICAgIGRyYWdFbG0gPSBlbDtcblxuICAgICAgaWYgKCFlbCB8fCAhc291cmNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlTWFwLmhhcyhlbCkpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudENvbXBvbmVudCA9IHRoaXMuZHJhZ2dhYmxlTWFwLmdldChlbCk7XG4gICAgICAgIGRyYWdnZWRJdGVtID0gZWxlbWVudENvbXBvbmVudC5tb2RlbDtcblxuICAgICAgICBlbGVtZW50Q29tcG9uZW50LmRyYWcuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ2RyYWcnLFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmRyb3BwYWJsZU1hcC5oYXMoc291cmNlKSkge1xuICAgICAgICBjb25zdCBzb3VyY2VDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoc291cmNlKTtcbiAgICAgICAgdGhpcy5kcmFndWxhT3B0aW9ucy5yZW1vdmVPblNwaWxsID0gc291cmNlQ29tcG9uZW50LnJlbW92ZU9uU3BpbGw7XG5cbiAgICAgICAgc291cmNlQ29tcG9uZW50LmRyYWcuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ2RyYWcnLFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICBzb3VyY2VDb21wb25lbnQsXG4gICAgICAgICAgdmFsdWU6IGRyYWdnZWRJdGVtXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5kcmFrZS5vbignZHJvcCcsIChlbDogYW55LCB0YXJnZXQ6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldENvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldCh0YXJnZXQpO1xuXG4gICAgICBpZiAoIXRhcmdldENvbXBvbmVudCkge1xuICAgICAgICAvLyBub3QgYSB0YXJnZXQsIGFib3J0XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IGRyb3BFbG1Nb2RlbCA9IGRyYWdnZWRJdGVtO1xuICAgICAgY29uc3QgZHJvcEluZGV4ID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbCh0YXJnZXQuY2hpbGRyZW4sIGVsKTtcblxuICAgICAgaWYgKGRyb3BJbmRleCA8IDApIHtcbiAgICAgICAgLy8gZHJvcEluZGV4IGlzIGJhZC4uLiBjYW5jZWxcbiAgICAgICAgdGhpcy5kcmFrZS5jYW5jZWwodHJ1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc291cmNlQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KHNvdXJjZSk7XG5cbiAgICAgIGlmIChzb3VyY2VDb21wb25lbnQpIHtcbiAgICAgICAgY29uc3Qgc291cmNlTW9kZWwgPSBzb3VyY2VDb21wb25lbnQubW9kZWw7XG4gICAgICAgIGNvbnN0IHRhcmdldE1vZGVsID0gdGFyZ2V0Q29tcG9uZW50Lm1vZGVsO1xuXG4gICAgICAgIGNvbnN0IGhhc0RyYWdNb2RlbCA9ICEhKHNvdXJjZU1vZGVsICYmIGRyYWdnZWRJdGVtKTtcbiAgICAgICAgY29uc3QgZHJhZ0luZGV4ID0gaGFzRHJhZ01vZGVsID8gc291cmNlTW9kZWwuaW5kZXhPZihkcmFnZ2VkSXRlbSkgOiAtMTtcbiAgICAgICAgaWYgKGhhc0RyYWdNb2RlbCAmJiBkcmFnSW5kZXggPCAwKSB7XG4gICAgICAgICAgLy8gZHJhZ0luZGV4IGlzIGJhZC4uLiBjYW5jZWxcbiAgICAgICAgICB0aGlzLmRyYWtlLmNhbmNlbCh0cnVlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGFyZ2V0TW9kZWwpIHtcbiAgICAgICAgICBjb25zdCByZW9yZGVyID0gZHJhZ0luZGV4ID4gLTEgJiYgc291cmNlTW9kZWwgJiYgdGFyZ2V0ID09PSBzb3VyY2U7XG4gICAgICAgICAgY29uc3QgY29weSA9ICFzb3VyY2VNb2RlbCB8fCBkcmFnRWxtICE9PSBlbDtcbiAgICAgICAgICBpZiAocmVvcmRlcikge1xuICAgICAgICAgICAgc291cmNlTW9kZWwuc3BsaWNlKGRyb3BJbmRleCwgMCwgc291cmNlTW9kZWwuc3BsaWNlKGRyYWdJbmRleCwgMSlbMF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZWwucGFyZW50Tm9kZSA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgIHRhcmdldC5yZW1vdmVDaGlsZChlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb3B5KSB7XG4gICAgICAgICAgICAgIGRyb3BFbG1Nb2RlbCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZHJvcEVsbU1vZGVsKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoZWwucGFyZW50Tm9kZSAhPT0gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgLy8gYWRkIGVsZW1lbnQgYmFjaywgbGV0IGFuZ3VsYXIgcmVtb3ZlIGl0XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFrZS5jYW5jZWwodHJ1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc291cmNlTW9kZWwuc3BsaWNlKGRyYWdJbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXRNb2RlbC5zcGxpY2UoZHJvcEluZGV4LCAwLCBkcm9wRWxtTW9kZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0YXJnZXRDb21wb25lbnQuZHJvcC5lbWl0KHtcbiAgICAgICAgdHlwZTogJ2Ryb3AnLFxuICAgICAgICBlbCxcbiAgICAgICAgc291cmNlLFxuICAgICAgICB2YWx1ZTogZHJvcEVsbU1vZGVsLFxuICAgICAgICBkcm9wSW5kZXhcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kcmFrZS5vbigncmVtb3ZlJywgKGVsOiBhbnksIGNvbnRhaW5lcjogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgaWYgKHRoaXMuZHJvcHBhYmxlTWFwLmhhcyhzb3VyY2UpKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZUNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChzb3VyY2UpO1xuICAgICAgICBjb25zdCBzb3VyY2VNb2RlbCA9IHNvdXJjZUNvbXBvbmVudC5tb2RlbDtcblxuICAgICAgICBjb25zdCBkcmFnSW5kZXggPSBkcmFnZ2VkSXRlbSAmJiBzb3VyY2VNb2RlbCA/IHNvdXJjZU1vZGVsLmluZGV4T2YoZHJhZ2dlZEl0ZW0pIDogLTE7XG5cbiAgICAgICAgaWYgKGRyYWdJbmRleCA+IC0xKSB7XG4gICAgICAgICAgaWYgKGVsLnBhcmVudE5vZGUgIT09IHNvdXJjZSkge1xuICAgICAgICAgICAgLy8gYWRkIGVsZW1lbnQgYmFjaywgbGV0IGFuZ3VsYXIgcmVtb3ZlIGl0XG4gICAgICAgICAgICBzb3VyY2UuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzb3VyY2VNb2RlbC5zcGxpY2UoZHJhZ0luZGV4LCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNvdXJjZUNvbXBvbmVudC5yZW1vdmUuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ3JlbW92ZScsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdjYW5jZWwnLCAoZWw6IGFueSwgY29udGFpbmVyOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBpZiAodGhpcy5kcm9wcGFibGVNYXAuaGFzKGNvbnRhaW5lcikpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnRhaW5lckNvbXBvbmVudC5jYW5jZWwuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ2NhbmNlbCcsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdvdmVyJywgKGVsOiBhbnksIGNvbnRhaW5lcjogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgaWYgKHRoaXMuZHJvcHBhYmxlTWFwLmhhcyhjb250YWluZXIpKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lckNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChjb250YWluZXIpO1xuICAgICAgICBjb250YWluZXJDb21wb25lbnQub3Zlci5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnb3ZlcicsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdvdXQnLCAoZWw6IGFueSwgY29udGFpbmVyOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBpZiAodGhpcy5kcm9wcGFibGVNYXAuaGFzKGNvbnRhaW5lcikpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnRhaW5lckNvbXBvbmVudC5vdXQuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ291dCcsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==