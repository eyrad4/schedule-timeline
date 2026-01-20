import {Component, inject, input} from '@angular/core';
import {MapperPipe} from "../../../../shared/pipes/mapper";
import {WorkOrderDocument} from "../../models/work-order-document";
import {TimelinePosition} from "../timeline/directives/timeline-position";
import {ZoomLevel} from "../../models/zoom-level";
import {TimelineColumnItem} from "../timeline/services/timeline-column";
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {WorkOrderStatus} from "../work-order-status/work-order-status";
import {WorkOrderDrawer} from "../../services/work-order-drawer";
import {WorkOrdersData} from "../../data-access/work-orders-data";

@Component({
    selector: 'app-work-order-bar',
    imports: [MapperPipe, TimelinePosition, NgbDropdown, NgbDropdownMenu, NgbDropdownItem, NgbDropdownToggle, WorkOrderStatus],
    templateUrl: './work-order-bar.html',
    styleUrl: './work-order-bar.scss',
})
export class WorkOrderBar {
    protected _workOrderUpsert = inject(WorkOrderDrawer);

    protected _workOrdersData = inject(WorkOrdersData);

    readonly order = input<WorkOrderDocument>();

    readonly zoomLevel = input<ZoomLevel>();

    readonly timelineColumns = input<TimelineColumnItem[]>();

    protected _getStatusClassName = (status: WorkOrderDocument['data']['status']): string => {
        return `status-${status}`;
    }

    protected _edit(): void {
        const order = this.order();
        if (order) {
            this._workOrderUpsert.edit(order);
        }
    }

    protected _remove(): void {
        const { docId, data: { workCenterId } = {} } = this.order() ?? {};
        if (docId && workCenterId) {
            this._workOrdersData.remove(docId, workCenterId);
        }
    }
}
