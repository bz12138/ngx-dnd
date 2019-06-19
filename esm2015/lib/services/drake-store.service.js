/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as dragulaNamespace from '@swimlane/dragula';
import * as i0 from "@angular/core";
// see https://github.com/dherges/ng-packagr/issues/217
/** @type {?} */
const dragula = dragulaNamespace;
/**
 * Central service that handles all events
 *
 * @export
 */
export class DrakeStoreService {
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
/** @nocollapse */ DrakeStoreService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function DrakeStoreService_Factory() { return new DrakeStoreService(); }, token: DrakeStoreService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    DrakeStoreService.prototype.droppableMap;
    /**
     * @type {?}
     * @private
     */
    DrakeStoreService.prototype.draggableMap;
    /**
     * @type {?}
     * @private
     */
    DrakeStoreService.prototype.dragulaOptions;
    /**
     * @type {?}
     * @private
     */
    DrakeStoreService.prototype.drake;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJha2Utc3RvcmUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL2RyYWtlLXN0b3JlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxLQUFLLGdCQUFnQixNQUFNLG1CQUFtQixDQUFDOzs7O01BS2hELE9BQU8sR0FBRyxnQkFBZ0I7Ozs7OztBQVFoQyxNQUFNLE9BQU8saUJBQWlCO0lBTTVCO1FBTFEsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBMkIsQ0FBQztRQUN0RCxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUEyQixDQUFDO1FBSzVELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQzs7Ozs7SUFFRCxRQUFRLENBQUMsU0FBNkI7UUFDcEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7Ozs7O0lBRUQsTUFBTSxDQUFDLFNBQTZCO1FBQ2xDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7Y0FDeEMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1FBQzlELElBQUksR0FBRyxH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QUFDO2FBQ0o7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUs7Ozs7OztRQUFFLENBQUMsRUFBTyxFQUFFLFNBQWMsRUFBRSxNQUFXLEVBQUUsRUFBRTtZQUM1RCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFOztzQkFDOUIsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO2dCQUMzRCxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO29CQUMxQixJQUFJLEVBQUUsS0FBSztvQkFDWCxFQUFFO29CQUNGLFNBQVM7b0JBQ1QsTUFBTTtvQkFDTixLQUFLLEVBQUUsV0FBVztpQkFDbkIsQ0FBQyxDQUFDO2FBQ0o7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7OztZQTVPRixVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7Ozs7Ozs7O0lBRWhDLHlDQUE4RDs7Ozs7SUFDOUQseUNBQThEOzs7OztJQUM5RCwyQ0FBd0Q7Ozs7O0lBQ3hELGtDQUFzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0ICogYXMgZHJhZ3VsYU5hbWVzcGFjZSBmcm9tICdAc3dpbWxhbmUvZHJhZ3VsYSc7XG5pbXBvcnQgeyBEcm9wcGFibGVEaXJlY3RpdmUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL25neC1kcm9wcGFibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IERyYWdnYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvbmd4LWRyYWdnYWJsZS5kaXJlY3RpdmUnO1xuXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RoZXJnZXMvbmctcGFja2Fnci9pc3N1ZXMvMjE3XG5jb25zdCBkcmFndWxhID0gZHJhZ3VsYU5hbWVzcGFjZTtcblxuLyoqXG4gKiBDZW50cmFsIHNlcnZpY2UgdGhhdCBoYW5kbGVzIGFsbCBldmVudHNcbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgRHJha2VTdG9yZVNlcnZpY2Uge1xuICBwcml2YXRlIGRyb3BwYWJsZU1hcCA9IG5ldyBXZWFrTWFwPGFueSwgRHJvcHBhYmxlRGlyZWN0aXZlPigpO1xuICBwcml2YXRlIGRyYWdnYWJsZU1hcCA9IG5ldyBXZWFrTWFwPGFueSwgRHJhZ2dhYmxlRGlyZWN0aXZlPigpO1xuICBwcml2YXRlIGRyYWd1bGFPcHRpb25zOiBkcmFndWxhTmFtZXNwYWNlLkRyYWd1bGFPcHRpb25zO1xuICBwcml2YXRlIGRyYWtlOiBkcmFndWxhTmFtZXNwYWNlLkRyYWtlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZHJhZ3VsYU9wdGlvbnMgPSB0aGlzLmNyZWF0ZURyYWtlT3B0aW9ucygpO1xuICAgIHRoaXMuZHJha2UgPSBkcmFndWxhKFtdLCB0aGlzLmRyYWd1bGFPcHRpb25zKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7ICAgIFxuICB9XG5cbiAgcmVnaXN0ZXIoZHJvcHBhYmxlOiBEcm9wcGFibGVEaXJlY3RpdmUpIHtcbiAgICB0aGlzLmRyb3BwYWJsZU1hcC5zZXQoZHJvcHBhYmxlLmNvbnRhaW5lciwgZHJvcHBhYmxlKTtcbiAgICB0aGlzLmRyYWtlLmNvbnRhaW5lcnMucHVzaChkcm9wcGFibGUuY29udGFpbmVyKTtcbiAgfVxuXG4gIHJlbW92ZShkcm9wcGFibGU6IERyb3BwYWJsZURpcmVjdGl2ZSkge1xuICAgIHRoaXMuZHJvcHBhYmxlTWFwLmRlbGV0ZShkcm9wcGFibGUuY29udGFpbmVyKTtcbiAgICBjb25zdCBpZHggPSB0aGlzLmRyYWtlLmNvbnRhaW5lcnMuaW5kZXhPZihkcm9wcGFibGUuY29udGFpbmVyKTtcbiAgICBpZiAoaWR4ID4gLTEpIHtcbiAgICAgIHRoaXMuZHJha2UuY29udGFpbmVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3RlckRyYWdnYWJsZShkcmFnZ2FibGU6IERyYWdnYWJsZURpcmVjdGl2ZSkge1xuICAgIHRoaXMuZHJhZ2dhYmxlTWFwLnNldChkcmFnZ2FibGUuZWxlbWVudCwgZHJhZ2dhYmxlKTtcbiAgfVxuXG4gIHJlbW92ZURyYWdnYWJsZShkcmFnZ2FibGU6IERyYWdnYWJsZURpcmVjdGl2ZSkge1xuICAgIHRoaXMuZHJhZ2dhYmxlTWFwLmRlbGV0ZShkcmFnZ2FibGUuZWxlbWVudCk7XG4gIH1cblxuICBjcmVhdGVEcmFrZU9wdGlvbnMoKTogZHJhZ3VsYU5hbWVzcGFjZS5EcmFndWxhT3B0aW9ucyB7XG4gICAgY29uc3QgYWNjZXB0cyA9IChlbDogYW55LCB0YXJnZXQ6IGFueSAvKiwgc291cmNlOiBhbnksIHNpYmxpbmc6IGFueSAqLykgPT4ge1xuICAgICAgaWYgKGVsLmNvbnRhaW5zKHRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY29uc3QgZWxlbWVudENvbXBvbmVudCA9IHRoaXMuZHJhZ2dhYmxlTWFwLmdldChlbCk7XG4gICAgICBjb25zdCB0YXJnZXRDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQodGFyZ2V0KTtcbiAgICAgIGlmIChlbGVtZW50Q29tcG9uZW50ICYmIHRhcmdldENvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudENvbXBvbmVudC5kcm9wWm9uZXMuaW5jbHVkZXModGFyZ2V0Q29tcG9uZW50LmRyb3Bab25lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICBjb25zdCBjb3B5ID0gKF86IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZUNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChzb3VyY2UpO1xuICAgICAgaWYgKHNvdXJjZUNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gc291cmNlQ29tcG9uZW50LmNvcHk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGNvbnN0IG1vdmVzID0gKGVsPzogYW55LCBzb3VyY2U/OiBhbnksIGhhbmRsZT86IGFueSwgc2libGluZz86IGFueSkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudENvbXBvbmVudCA9IHRoaXMuZHJhZ2dhYmxlTWFwLmdldChlbCk7XG4gICAgICBpZiAoZWxlbWVudENvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudENvbXBvbmVudC5tb3Zlcyhzb3VyY2UsIGhhbmRsZSwgc2libGluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgY29uc3QgZGlyZWN0aW9uOiBhbnkgPSAoZWw6IGFueSwgdGFyZ2V0OiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXRDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQodGFyZ2V0KTtcbiAgICAgIHJldHVybiB0YXJnZXRDb21wb25lbnQuZGlyZWN0aW9uIHx8ICd2ZXJ0aWNhbCc7XG4gICAgfTtcblxuICAgIHJldHVybiB7IGFjY2VwdHMsIGNvcHksIG1vdmVzLCByZXZlcnRPblNwaWxsOiB0cnVlLCBkaXJlY3Rpb24gfTtcbiAgfVxuXG4gIHJlZ2lzdGVyRXZlbnRzKCk6IHZvaWQge1xuICAgIGxldCBkcmFnRWxtOiBhbnk7XG4gICAgbGV0IGRyYWdnZWRJdGVtOiBhbnk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdkcmFnJywgKGVsOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBkcmFnZ2VkSXRlbSA9IHVuZGVmaW5lZDtcbiAgICAgIGRyYWdFbG0gPSBlbDtcblxuICAgICAgaWYgKCFlbCB8fCAhc291cmNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlTWFwLmhhcyhlbCkpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudENvbXBvbmVudCA9IHRoaXMuZHJhZ2dhYmxlTWFwLmdldChlbCk7XG4gICAgICAgIGRyYWdnZWRJdGVtID0gZWxlbWVudENvbXBvbmVudC5tb2RlbDtcblxuICAgICAgICBlbGVtZW50Q29tcG9uZW50LmRyYWcuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ2RyYWcnLFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmRyb3BwYWJsZU1hcC5oYXMoc291cmNlKSkge1xuICAgICAgICBjb25zdCBzb3VyY2VDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoc291cmNlKTtcbiAgICAgICAgdGhpcy5kcmFndWxhT3B0aW9ucy5yZW1vdmVPblNwaWxsID0gc291cmNlQ29tcG9uZW50LnJlbW92ZU9uU3BpbGw7XG5cbiAgICAgICAgc291cmNlQ29tcG9uZW50LmRyYWcuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ2RyYWcnLFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICBzb3VyY2VDb21wb25lbnQsXG4gICAgICAgICAgdmFsdWU6IGRyYWdnZWRJdGVtXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5kcmFrZS5vbignZHJvcCcsIChlbDogYW55LCB0YXJnZXQ6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldENvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldCh0YXJnZXQpO1xuXG4gICAgICBpZiAoIXRhcmdldENvbXBvbmVudCkge1xuICAgICAgICAvLyBub3QgYSB0YXJnZXQsIGFib3J0XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IGRyb3BFbG1Nb2RlbCA9IGRyYWdnZWRJdGVtO1xuICAgICAgY29uc3QgZHJvcEluZGV4ID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbCh0YXJnZXQuY2hpbGRyZW4sIGVsKTtcblxuICAgICAgaWYgKGRyb3BJbmRleCA8IDApIHtcbiAgICAgICAgLy8gZHJvcEluZGV4IGlzIGJhZC4uLiBjYW5jZWxcbiAgICAgICAgdGhpcy5kcmFrZS5jYW5jZWwodHJ1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc291cmNlQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KHNvdXJjZSk7XG5cbiAgICAgIGlmIChzb3VyY2VDb21wb25lbnQpIHtcbiAgICAgICAgY29uc3Qgc291cmNlTW9kZWwgPSBzb3VyY2VDb21wb25lbnQubW9kZWw7XG4gICAgICAgIGNvbnN0IHRhcmdldE1vZGVsID0gdGFyZ2V0Q29tcG9uZW50Lm1vZGVsO1xuXG4gICAgICAgIGNvbnN0IGhhc0RyYWdNb2RlbCA9ICEhKHNvdXJjZU1vZGVsICYmIGRyYWdnZWRJdGVtKTtcbiAgICAgICAgY29uc3QgZHJhZ0luZGV4ID0gaGFzRHJhZ01vZGVsID8gc291cmNlTW9kZWwuaW5kZXhPZihkcmFnZ2VkSXRlbSkgOiAtMTtcbiAgICAgICAgaWYgKGhhc0RyYWdNb2RlbCAmJiBkcmFnSW5kZXggPCAwKSB7XG4gICAgICAgICAgLy8gZHJhZ0luZGV4IGlzIGJhZC4uLiBjYW5jZWxcbiAgICAgICAgICB0aGlzLmRyYWtlLmNhbmNlbCh0cnVlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGFyZ2V0TW9kZWwpIHtcbiAgICAgICAgICBjb25zdCByZW9yZGVyID0gZHJhZ0luZGV4ID4gLTEgJiYgc291cmNlTW9kZWwgJiYgdGFyZ2V0ID09PSBzb3VyY2U7XG4gICAgICAgICAgY29uc3QgY29weSA9ICFzb3VyY2VNb2RlbCB8fCBkcmFnRWxtICE9PSBlbDtcbiAgICAgICAgICBpZiAocmVvcmRlcikge1xuICAgICAgICAgICAgc291cmNlTW9kZWwuc3BsaWNlKGRyb3BJbmRleCwgMCwgc291cmNlTW9kZWwuc3BsaWNlKGRyYWdJbmRleCwgMSlbMF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZWwucGFyZW50Tm9kZSA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgIHRhcmdldC5yZW1vdmVDaGlsZChlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb3B5KSB7XG4gICAgICAgICAgICAgIGRyb3BFbG1Nb2RlbCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZHJvcEVsbU1vZGVsKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoZWwucGFyZW50Tm9kZSAhPT0gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgLy8gYWRkIGVsZW1lbnQgYmFjaywgbGV0IGFuZ3VsYXIgcmVtb3ZlIGl0XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFrZS5jYW5jZWwodHJ1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc291cmNlTW9kZWwuc3BsaWNlKGRyYWdJbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXRNb2RlbC5zcGxpY2UoZHJvcEluZGV4LCAwLCBkcm9wRWxtTW9kZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0YXJnZXRDb21wb25lbnQuZHJvcC5lbWl0KHtcbiAgICAgICAgdHlwZTogJ2Ryb3AnLFxuICAgICAgICBlbCxcbiAgICAgICAgc291cmNlLFxuICAgICAgICB2YWx1ZTogZHJvcEVsbU1vZGVsLFxuICAgICAgICBkcm9wSW5kZXhcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kcmFrZS5vbigncmVtb3ZlJywgKGVsOiBhbnksIGNvbnRhaW5lcjogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgaWYgKHRoaXMuZHJvcHBhYmxlTWFwLmhhcyhzb3VyY2UpKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZUNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChzb3VyY2UpO1xuICAgICAgICBjb25zdCBzb3VyY2VNb2RlbCA9IHNvdXJjZUNvbXBvbmVudC5tb2RlbDtcblxuICAgICAgICBjb25zdCBkcmFnSW5kZXggPSBkcmFnZ2VkSXRlbSAmJiBzb3VyY2VNb2RlbCA/IHNvdXJjZU1vZGVsLmluZGV4T2YoZHJhZ2dlZEl0ZW0pIDogLTE7XG5cbiAgICAgICAgaWYgKGRyYWdJbmRleCA+IC0xKSB7XG4gICAgICAgICAgaWYgKGVsLnBhcmVudE5vZGUgIT09IHNvdXJjZSkge1xuICAgICAgICAgICAgLy8gYWRkIGVsZW1lbnQgYmFjaywgbGV0IGFuZ3VsYXIgcmVtb3ZlIGl0XG4gICAgICAgICAgICBzb3VyY2UuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzb3VyY2VNb2RlbC5zcGxpY2UoZHJhZ0luZGV4LCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNvdXJjZUNvbXBvbmVudC5yZW1vdmUuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ3JlbW92ZScsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdjYW5jZWwnLCAoZWw6IGFueSwgY29udGFpbmVyOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBpZiAodGhpcy5kcm9wcGFibGVNYXAuaGFzKGNvbnRhaW5lcikpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnRhaW5lckNvbXBvbmVudC5jYW5jZWwuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ2NhbmNlbCcsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdvdmVyJywgKGVsOiBhbnksIGNvbnRhaW5lcjogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgaWYgKHRoaXMuZHJvcHBhYmxlTWFwLmhhcyhjb250YWluZXIpKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lckNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChjb250YWluZXIpO1xuICAgICAgICBjb250YWluZXJDb21wb25lbnQub3Zlci5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnb3ZlcicsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdvdXQnLCAoZWw6IGFueSwgY29udGFpbmVyOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBpZiAodGhpcy5kcm9wcGFibGVNYXAuaGFzKGNvbnRhaW5lcikpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnRhaW5lckNvbXBvbmVudC5vdXQuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ291dCcsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==