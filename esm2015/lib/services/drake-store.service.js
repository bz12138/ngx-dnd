/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as dragulaNamespace from '@swimlane/dragula';
import * as i0 from "@angular/core";
// see https://github.com/dherges/ng-packagr/issues/217
const /** @type {?} */ dragula = dragulaNamespace;
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
/** @nocollapse */ DrakeStoreService.ngInjectableDef = i0.defineInjectable({ factory: function DrakeStoreService_Factory() { return new DrakeStoreService(); }, token: DrakeStoreService, providedIn: "root" });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJha2Utc3RvcmUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZG5kLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL2RyYWtlLXN0b3JlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxLQUFLLGdCQUFnQixNQUFNLG1CQUFtQixDQUFDOzs7QUFLdEQsdUJBQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDOzs7Ozs7QUFRakMsTUFBTSxPQUFPLGlCQUFpQjtJQU01Qjs0QkFMdUIsSUFBSSxPQUFPLEVBQTJCOzRCQUN0QyxJQUFJLE9BQU8sRUFBMkI7UUFLM0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNoRCxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUN2Qjs7Ozs7SUFFRCxRQUFRLENBQUMsU0FBNkI7UUFDcEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ2pEOzs7OztJQUVELE1BQU0sQ0FBQyxTQUE2QjtRQUNsQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUMsdUJBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDWixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3RDO0tBQ0Y7Ozs7O0lBRUQsaUJBQWlCLENBQUMsU0FBNkI7UUFDN0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztLQUNyRDs7Ozs7SUFFRCxlQUFlLENBQUMsU0FBNkI7UUFDM0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzdDOzs7O0lBRUQsa0JBQWtCO1FBQ2hCLHVCQUFNLE9BQU8sR0FBRyxDQUFDLEVBQU8sRUFBRSxNQUFXLG1DQUFtQyxFQUFFO1lBQ3hFLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDdkIsT0FBTyxLQUFLLENBQUM7YUFDZDtZQUNELHVCQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELHVCQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0RCxJQUFJLGdCQUFnQixJQUFJLGVBQWUsRUFBRTtnQkFDdkMsT0FBTyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUN0RTtZQUNELE9BQU8sSUFBSSxDQUFDO1NBQ2IsQ0FBQztRQUVGLHVCQUFNLElBQUksR0FBRyxDQUFDLENBQU0sRUFBRSxNQUFXLEVBQUUsRUFBRTtZQUNuQyx1QkFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEQsSUFBSSxlQUFlLEVBQUU7Z0JBQ25CLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQzthQUM3QjtZQUNELE9BQU8sS0FBSyxDQUFDO1NBQ2QsQ0FBQztRQUVGLHVCQUFNLEtBQUssR0FBRyxDQUFDLEVBQVEsRUFBRSxNQUFZLEVBQUUsTUFBWSxFQUFFLE9BQWEsRUFBRSxFQUFFO1lBQ3BFLHVCQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELElBQUksZ0JBQWdCLEVBQUU7Z0JBQ3BCLE9BQU8sZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDeEQ7WUFDRCxPQUFPLElBQUksQ0FBQztTQUNiLENBQUM7UUFFRixPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLENBQUM7S0FDN0U7Ozs7SUFFRCxjQUFjO1FBQ1oscUJBQUksT0FBWSxDQUFDO1FBQ2pCLHFCQUFJLFdBQWdCLENBQUM7UUFFckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBTyxFQUFFLE1BQVcsRUFBRSxFQUFFO1lBQzdDLFdBQVcsR0FBRyxTQUFTLENBQUM7WUFDeEIsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUViLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2xCLE9BQU87YUFDUjtZQUVELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQzdCLHVCQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO2dCQUVyQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUN6QixJQUFJLEVBQUUsTUFBTTtvQkFDWixFQUFFO29CQUNGLE1BQU07b0JBQ04sS0FBSyxFQUFFLFdBQVc7aUJBQ25CLENBQUMsQ0FBQzthQUNKO1lBRUQsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDakMsdUJBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN0RCxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsR0FBRyxlQUFlLENBQUMsYUFBYSxDQUFDO2dCQUVsRSxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDeEIsSUFBSSxFQUFFLE1BQU07b0JBQ1osRUFBRTtvQkFDRixNQUFNO29CQUNOLGVBQWU7b0JBQ2YsS0FBSyxFQUFFLFdBQVc7aUJBQ25CLENBQUMsQ0FBQzthQUNKO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBTyxFQUFFLE1BQVcsRUFBRSxNQUFXLEVBQUUsRUFBRTtZQUMxRCx1QkFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFdEQsSUFBSSxDQUFDLGVBQWUsRUFBRTs7Z0JBRXBCLE9BQU87YUFDUjtZQUVELHFCQUFJLFlBQVksR0FBRyxXQUFXLENBQUM7WUFDL0IsdUJBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRXBFLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRTs7Z0JBRWpCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN4QixPQUFPO2FBQ1I7WUFFRCx1QkFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFdEQsSUFBSSxlQUFlLEVBQUU7Z0JBQ25CLHVCQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDO2dCQUMxQyx1QkFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQztnQkFFMUMsdUJBQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsQ0FBQztnQkFDcEQsdUJBQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZFLElBQUksWUFBWSxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUU7O29CQUVqQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDeEIsT0FBTztpQkFDUjtnQkFFRCxJQUFJLFdBQVcsRUFBRTtvQkFDZix1QkFBTSxPQUFPLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLFdBQVcsSUFBSSxNQUFNLEtBQUssTUFBTSxDQUFDO29CQUNuRSx1QkFBTSxJQUFJLEdBQUcsQ0FBQyxXQUFXLElBQUksT0FBTyxLQUFLLEVBQUUsQ0FBQztvQkFDNUMsSUFBSSxPQUFPLEVBQUU7d0JBQ1gsV0FBVyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZFO3lCQUFNO3dCQUNMLElBQUksRUFBRSxDQUFDLFVBQVUsS0FBSyxNQUFNLEVBQUU7NEJBQzVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7eUJBQ3hCO3dCQUVELElBQUksSUFBSSxFQUFFOzRCQUNSLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzt5QkFDekQ7NkJBQU07NEJBQ0wsSUFBSSxFQUFFLENBQUMsVUFBVSxLQUFLLE1BQU0sRUFBRTs7Z0NBRTVCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOzZCQUN6Qjs0QkFDRCxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDbEM7d0JBQ0QsV0FBVyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO3FCQUNoRDtpQkFDRjthQUNGO1lBRUQsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ3hCLElBQUksRUFBRSxNQUFNO2dCQUNaLEVBQUU7Z0JBQ0YsTUFBTTtnQkFDTixLQUFLLEVBQUUsWUFBWTtnQkFDbkIsU0FBUzthQUNWLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQU8sRUFBRSxTQUFjLEVBQUUsTUFBVyxFQUFFLEVBQUU7WUFDL0QsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDakMsdUJBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN0RCx1QkFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQztnQkFFMUMsdUJBQU0sU0FBUyxHQUFHLFdBQVcsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVyRixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRTtvQkFDbEIsSUFBSSxFQUFFLENBQUMsVUFBVSxLQUFLLE1BQU0sRUFBRTs7d0JBRTVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQ3hCO29CQUNELFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUNsQztnQkFFRCxlQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDMUIsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsRUFBRTtvQkFDRixTQUFTO29CQUNULE1BQU07b0JBQ04sS0FBSyxFQUFFLFdBQVc7aUJBQ25CLENBQUMsQ0FBQzthQUNKO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBTyxFQUFFLFNBQWMsRUFBRSxNQUFXLEVBQUUsRUFBRTtZQUMvRCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNwQyx1QkFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUQsa0JBQWtCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDN0IsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsRUFBRTtvQkFDRixTQUFTO29CQUNULE1BQU07b0JBQ04sS0FBSyxFQUFFLFdBQVc7aUJBQ25CLENBQUMsQ0FBQzthQUNKO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBTyxFQUFFLFNBQWMsRUFBRSxNQUFXLEVBQUUsRUFBRTtZQUM3RCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNwQyx1QkFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUQsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDM0IsSUFBSSxFQUFFLE1BQU07b0JBQ1osRUFBRTtvQkFDRixTQUFTO29CQUNULE1BQU07b0JBQ04sS0FBSyxFQUFFLFdBQVc7aUJBQ25CLENBQUMsQ0FBQzthQUNKO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBTyxFQUFFLFNBQWMsRUFBRSxNQUFXLEVBQUUsRUFBRTtZQUM1RCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNwQyx1QkFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUQsa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztvQkFDMUIsSUFBSSxFQUFFLEtBQUs7b0JBQ1gsRUFBRTtvQkFDRixTQUFTO29CQUNULE1BQU07b0JBQ04sS0FBSyxFQUFFLFdBQVc7aUJBQ25CLENBQUMsQ0FBQzthQUNKO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7OztZQXZPRixVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgKiBhcyBkcmFndWxhTmFtZXNwYWNlIGZyb20gJ0Bzd2ltbGFuZS9kcmFndWxhJztcbmltcG9ydCB7IERyb3BwYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvbmd4LWRyb3BwYWJsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRHJhZ2dhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9uZ3gtZHJhZ2dhYmxlLmRpcmVjdGl2ZSc7XG5cbi8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZGhlcmdlcy9uZy1wYWNrYWdyL2lzc3Vlcy8yMTdcbmNvbnN0IGRyYWd1bGEgPSBkcmFndWxhTmFtZXNwYWNlO1xuXG4vKipcbiAqIENlbnRyYWwgc2VydmljZSB0aGF0IGhhbmRsZXMgYWxsIGV2ZW50c1xuICpcbiAqIEBleHBvcnRcbiAqL1xuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBEcmFrZVN0b3JlU2VydmljZSB7XG4gIHByaXZhdGUgZHJvcHBhYmxlTWFwID0gbmV3IFdlYWtNYXA8YW55LCBEcm9wcGFibGVEaXJlY3RpdmU+KCk7XG4gIHByaXZhdGUgZHJhZ2dhYmxlTWFwID0gbmV3IFdlYWtNYXA8YW55LCBEcmFnZ2FibGVEaXJlY3RpdmU+KCk7XG4gIHByaXZhdGUgZHJhZ3VsYU9wdGlvbnM6IGRyYWd1bGFOYW1lc3BhY2UuRHJhZ3VsYU9wdGlvbnM7XG4gIHByaXZhdGUgZHJha2U6IGRyYWd1bGFOYW1lc3BhY2UuRHJha2U7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kcmFndWxhT3B0aW9ucyA9IHRoaXMuY3JlYXRlRHJha2VPcHRpb25zKCk7XG4gICAgdGhpcy5kcmFrZSA9IGRyYWd1bGEoW10sIHRoaXMuZHJhZ3VsYU9wdGlvbnMpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyKGRyb3BwYWJsZTogRHJvcHBhYmxlRGlyZWN0aXZlKSB7XG4gICAgdGhpcy5kcm9wcGFibGVNYXAuc2V0KGRyb3BwYWJsZS5jb250YWluZXIsIGRyb3BwYWJsZSk7XG4gICAgdGhpcy5kcmFrZS5jb250YWluZXJzLnB1c2goZHJvcHBhYmxlLmNvbnRhaW5lcik7XG4gIH1cblxuICByZW1vdmUoZHJvcHBhYmxlOiBEcm9wcGFibGVEaXJlY3RpdmUpIHtcbiAgICB0aGlzLmRyb3BwYWJsZU1hcC5kZWxldGUoZHJvcHBhYmxlLmNvbnRhaW5lcik7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5kcmFrZS5jb250YWluZXJzLmluZGV4T2YoZHJvcHBhYmxlLmNvbnRhaW5lcik7XG4gICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICB0aGlzLmRyYWtlLmNvbnRhaW5lcnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJEcmFnZ2FibGUoZHJhZ2dhYmxlOiBEcmFnZ2FibGVEaXJlY3RpdmUpIHtcbiAgICB0aGlzLmRyYWdnYWJsZU1hcC5zZXQoZHJhZ2dhYmxlLmVsZW1lbnQsIGRyYWdnYWJsZSk7XG4gIH1cblxuICByZW1vdmVEcmFnZ2FibGUoZHJhZ2dhYmxlOiBEcmFnZ2FibGVEaXJlY3RpdmUpIHtcbiAgICB0aGlzLmRyYWdnYWJsZU1hcC5kZWxldGUoZHJhZ2dhYmxlLmVsZW1lbnQpO1xuICB9XG5cbiAgY3JlYXRlRHJha2VPcHRpb25zKCk6IGRyYWd1bGFOYW1lc3BhY2UuRHJhZ3VsYU9wdGlvbnMge1xuICAgIGNvbnN0IGFjY2VwdHMgPSAoZWw6IGFueSwgdGFyZ2V0OiBhbnkgLyosIHNvdXJjZTogYW55LCBzaWJsaW5nOiBhbnkgKi8pID0+IHtcbiAgICAgIGlmIChlbC5jb250YWlucyh0YXJnZXQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVsZW1lbnRDb21wb25lbnQgPSB0aGlzLmRyYWdnYWJsZU1hcC5nZXQoZWwpO1xuICAgICAgY29uc3QgdGFyZ2V0Q29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KHRhcmdldCk7XG4gICAgICBpZiAoZWxlbWVudENvbXBvbmVudCAmJiB0YXJnZXRDb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRDb21wb25lbnQuZHJvcFpvbmVzLmluY2x1ZGVzKHRhcmdldENvbXBvbmVudC5kcm9wWm9uZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgY29uc3QgY29weSA9IChfOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2VDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoc291cmNlKTtcbiAgICAgIGlmIChzb3VyY2VDb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuIHNvdXJjZUNvbXBvbmVudC5jb3B5O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBjb25zdCBtb3ZlcyA9IChlbD86IGFueSwgc291cmNlPzogYW55LCBoYW5kbGU/OiBhbnksIHNpYmxpbmc/OiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnRDb21wb25lbnQgPSB0aGlzLmRyYWdnYWJsZU1hcC5nZXQoZWwpO1xuICAgICAgaWYgKGVsZW1lbnRDb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRDb21wb25lbnQubW92ZXMoc291cmNlLCBoYW5kbGUsIHNpYmxpbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIHJldHVybiB7IGFjY2VwdHMsIGNvcHksIG1vdmVzLCByZXZlcnRPblNwaWxsOiB0cnVlLCBkaXJlY3Rpb246ICd2ZXJ0aWNhbCcgfTtcbiAgfVxuXG4gIHJlZ2lzdGVyRXZlbnRzKCk6IHZvaWQge1xuICAgIGxldCBkcmFnRWxtOiBhbnk7XG4gICAgbGV0IGRyYWdnZWRJdGVtOiBhbnk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdkcmFnJywgKGVsOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBkcmFnZ2VkSXRlbSA9IHVuZGVmaW5lZDtcbiAgICAgIGRyYWdFbG0gPSBlbDtcblxuICAgICAgaWYgKCFlbCB8fCAhc291cmNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlTWFwLmhhcyhlbCkpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudENvbXBvbmVudCA9IHRoaXMuZHJhZ2dhYmxlTWFwLmdldChlbCk7XG4gICAgICAgIGRyYWdnZWRJdGVtID0gZWxlbWVudENvbXBvbmVudC5tb2RlbDtcblxuICAgICAgICBlbGVtZW50Q29tcG9uZW50LmRyYWcuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ2RyYWcnLFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmRyb3BwYWJsZU1hcC5oYXMoc291cmNlKSkge1xuICAgICAgICBjb25zdCBzb3VyY2VDb21wb25lbnQgPSB0aGlzLmRyb3BwYWJsZU1hcC5nZXQoc291cmNlKTtcbiAgICAgICAgdGhpcy5kcmFndWxhT3B0aW9ucy5yZW1vdmVPblNwaWxsID0gc291cmNlQ29tcG9uZW50LnJlbW92ZU9uU3BpbGw7XG5cbiAgICAgICAgc291cmNlQ29tcG9uZW50LmRyYWcuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ2RyYWcnLFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICBzb3VyY2VDb21wb25lbnQsXG4gICAgICAgICAgdmFsdWU6IGRyYWdnZWRJdGVtXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5kcmFrZS5vbignZHJvcCcsIChlbDogYW55LCB0YXJnZXQ6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldENvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldCh0YXJnZXQpO1xuXG4gICAgICBpZiAoIXRhcmdldENvbXBvbmVudCkge1xuICAgICAgICAvLyBub3QgYSB0YXJnZXQsIGFib3J0XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IGRyb3BFbG1Nb2RlbCA9IGRyYWdnZWRJdGVtO1xuICAgICAgY29uc3QgZHJvcEluZGV4ID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbCh0YXJnZXQuY2hpbGRyZW4sIGVsKTtcblxuICAgICAgaWYgKGRyb3BJbmRleCA8IDApIHtcbiAgICAgICAgLy8gZHJvcEluZGV4IGlzIGJhZC4uLiBjYW5jZWxcbiAgICAgICAgdGhpcy5kcmFrZS5jYW5jZWwodHJ1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc291cmNlQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KHNvdXJjZSk7XG5cbiAgICAgIGlmIChzb3VyY2VDb21wb25lbnQpIHtcbiAgICAgICAgY29uc3Qgc291cmNlTW9kZWwgPSBzb3VyY2VDb21wb25lbnQubW9kZWw7XG4gICAgICAgIGNvbnN0IHRhcmdldE1vZGVsID0gdGFyZ2V0Q29tcG9uZW50Lm1vZGVsO1xuXG4gICAgICAgIGNvbnN0IGhhc0RyYWdNb2RlbCA9ICEhKHNvdXJjZU1vZGVsICYmIGRyYWdnZWRJdGVtKTtcbiAgICAgICAgY29uc3QgZHJhZ0luZGV4ID0gaGFzRHJhZ01vZGVsID8gc291cmNlTW9kZWwuaW5kZXhPZihkcmFnZ2VkSXRlbSkgOiAtMTtcbiAgICAgICAgaWYgKGhhc0RyYWdNb2RlbCAmJiBkcmFnSW5kZXggPCAwKSB7XG4gICAgICAgICAgLy8gZHJhZ0luZGV4IGlzIGJhZC4uLiBjYW5jZWxcbiAgICAgICAgICB0aGlzLmRyYWtlLmNhbmNlbCh0cnVlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGFyZ2V0TW9kZWwpIHtcbiAgICAgICAgICBjb25zdCByZW9yZGVyID0gZHJhZ0luZGV4ID4gLTEgJiYgc291cmNlTW9kZWwgJiYgdGFyZ2V0ID09PSBzb3VyY2U7XG4gICAgICAgICAgY29uc3QgY29weSA9ICFzb3VyY2VNb2RlbCB8fCBkcmFnRWxtICE9PSBlbDtcbiAgICAgICAgICBpZiAocmVvcmRlcikge1xuICAgICAgICAgICAgc291cmNlTW9kZWwuc3BsaWNlKGRyb3BJbmRleCwgMCwgc291cmNlTW9kZWwuc3BsaWNlKGRyYWdJbmRleCwgMSlbMF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZWwucGFyZW50Tm9kZSA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgIHRhcmdldC5yZW1vdmVDaGlsZChlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb3B5KSB7XG4gICAgICAgICAgICAgIGRyb3BFbG1Nb2RlbCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZHJvcEVsbU1vZGVsKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoZWwucGFyZW50Tm9kZSAhPT0gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgLy8gYWRkIGVsZW1lbnQgYmFjaywgbGV0IGFuZ3VsYXIgcmVtb3ZlIGl0XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFrZS5jYW5jZWwodHJ1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc291cmNlTW9kZWwuc3BsaWNlKGRyYWdJbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXRNb2RlbC5zcGxpY2UoZHJvcEluZGV4LCAwLCBkcm9wRWxtTW9kZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0YXJnZXRDb21wb25lbnQuZHJvcC5lbWl0KHtcbiAgICAgICAgdHlwZTogJ2Ryb3AnLFxuICAgICAgICBlbCxcbiAgICAgICAgc291cmNlLFxuICAgICAgICB2YWx1ZTogZHJvcEVsbU1vZGVsLFxuICAgICAgICBkcm9wSW5kZXhcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kcmFrZS5vbigncmVtb3ZlJywgKGVsOiBhbnksIGNvbnRhaW5lcjogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgaWYgKHRoaXMuZHJvcHBhYmxlTWFwLmhhcyhzb3VyY2UpKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZUNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChzb3VyY2UpO1xuICAgICAgICBjb25zdCBzb3VyY2VNb2RlbCA9IHNvdXJjZUNvbXBvbmVudC5tb2RlbDtcblxuICAgICAgICBjb25zdCBkcmFnSW5kZXggPSBkcmFnZ2VkSXRlbSAmJiBzb3VyY2VNb2RlbCA/IHNvdXJjZU1vZGVsLmluZGV4T2YoZHJhZ2dlZEl0ZW0pIDogLTE7XG5cbiAgICAgICAgaWYgKGRyYWdJbmRleCA+IC0xKSB7XG4gICAgICAgICAgaWYgKGVsLnBhcmVudE5vZGUgIT09IHNvdXJjZSkge1xuICAgICAgICAgICAgLy8gYWRkIGVsZW1lbnQgYmFjaywgbGV0IGFuZ3VsYXIgcmVtb3ZlIGl0XG4gICAgICAgICAgICBzb3VyY2UuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzb3VyY2VNb2RlbC5zcGxpY2UoZHJhZ0luZGV4LCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNvdXJjZUNvbXBvbmVudC5yZW1vdmUuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ3JlbW92ZScsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdjYW5jZWwnLCAoZWw6IGFueSwgY29udGFpbmVyOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBpZiAodGhpcy5kcm9wcGFibGVNYXAuaGFzKGNvbnRhaW5lcikpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnRhaW5lckNvbXBvbmVudC5jYW5jZWwuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ2NhbmNlbCcsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdvdmVyJywgKGVsOiBhbnksIGNvbnRhaW5lcjogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgaWYgKHRoaXMuZHJvcHBhYmxlTWFwLmhhcyhjb250YWluZXIpKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lckNvbXBvbmVudCA9IHRoaXMuZHJvcHBhYmxlTWFwLmdldChjb250YWluZXIpO1xuICAgICAgICBjb250YWluZXJDb21wb25lbnQub3Zlci5lbWl0KHtcbiAgICAgICAgICB0eXBlOiAnb3ZlcicsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmRyYWtlLm9uKCdvdXQnLCAoZWw6IGFueSwgY29udGFpbmVyOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBpZiAodGhpcy5kcm9wcGFibGVNYXAuaGFzKGNvbnRhaW5lcikpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyQ29tcG9uZW50ID0gdGhpcy5kcm9wcGFibGVNYXAuZ2V0KGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnRhaW5lckNvbXBvbmVudC5vdXQuZW1pdCh7XG4gICAgICAgICAgdHlwZTogJ291dCcsXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZTogZHJhZ2dlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==