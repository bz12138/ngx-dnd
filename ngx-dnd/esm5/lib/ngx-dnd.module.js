/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableDirective } from './directives/ngx-draggable.directive';
import { DroppableDirective } from './directives/ngx-droppable.directive';
import { DragHandleDirective } from './directives/ngx-drag-handle.directive';
import { ContainerComponent } from './components/container/container.component';
import { ItemComponent } from './components/item/item.component';
import { DrakeStoreService } from './services/drake-store.service';
/** @type {?} */
var components = [ContainerComponent, ItemComponent];
/** @type {?} */
var directives = [DraggableDirective, DroppableDirective, DragHandleDirective];
var NgxDnDModule = /** @class */ (function () {
    function NgxDnDModule() {
    }
    /**
     * @return {?}
     */
    NgxDnDModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: NgxDnDModule,
            providers: [DrakeStoreService]
        };
    };
    NgxDnDModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: tslib_1.__spread(components, directives),
                    exports: tslib_1.__spread(components, directives)
                },] }
    ];
    return NgxDnDModule;
}());
export { NgxDnDModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRuZC5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRuZC8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtZG5kLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNqRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQzs7SUFHN0QsVUFBVSxHQUFHLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDOztJQUNoRCxVQUFVLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsQ0FBQztBQUVoRjtJQUFBO0lBV0MsQ0FBQzs7OztJQUxPLG9CQUFPOzs7SUFBZDtRQUNBLE9BQU87WUFDTCxRQUFRLEVBQUUsWUFBWTtZQUN0QixTQUFTLEVBQUUsQ0FBRSxpQkFBaUIsQ0FBRTtTQUNqQyxDQUFDO0lBQ0osQ0FBQzs7Z0JBWEEsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsWUFBWSxtQkFBTSxVQUFVLEVBQUssVUFBVSxDQUFDO29CQUM1QyxPQUFPLG1CQUFNLFVBQVUsRUFBSyxVQUFVLENBQUM7aUJBQ3hDOztJQU9BLG1CQUFDO0NBQUEsQUFYRixJQVdFO1NBTlcsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBEcmFnZ2FibGVEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmd4LWRyYWdnYWJsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRHJvcHBhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL25neC1kcm9wcGFibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IERyYWdIYW5kbGVEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmd4LWRyYWctaGFuZGxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVyL2NvbnRhaW5lci5jb21wb25lbnQnO1xuaW1wb3J0IHsgSXRlbUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9pdGVtL2l0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IERyYWtlU3RvcmVTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9kcmFrZS1zdG9yZS5zZXJ2aWNlJztcbmltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21waWxlci9zcmMvY29yZSc7XG5cbmNvbnN0IGNvbXBvbmVudHMgPSBbQ29udGFpbmVyQ29tcG9uZW50LCBJdGVtQ29tcG9uZW50XTtcbmNvbnN0IGRpcmVjdGl2ZXMgPSBbRHJhZ2dhYmxlRGlyZWN0aXZlLCBEcm9wcGFibGVEaXJlY3RpdmUsIERyYWdIYW5kbGVEaXJlY3RpdmVdO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbLi4uY29tcG9uZW50cywgLi4uZGlyZWN0aXZlc10sXG4gIGV4cG9ydHM6IFsuLi5jb21wb25lbnRzLCAuLi5kaXJlY3RpdmVzXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hEbkRNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgcmV0dXJuIHtcbiAgICBuZ01vZHVsZTogTmd4RG5ETW9kdWxlLFxuICAgIHByb3ZpZGVyczogWyBEcmFrZVN0b3JlU2VydmljZSBdXG4gIH07XG59fVxuIl19