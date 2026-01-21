import {Component, computed, inject, input} from '@angular/core';
import {WorkOrderDocument} from "../../models/work-order-document";
import {TimelineColumn, TimelineColumnItem} from "./services/timeline-column";
import {ZoomLevel} from "../../models/zoom-level";
import {WorkCenterDocument} from "../../models/work-center-document";
import {WorkOrderBar} from "../work-order-bar/work-order-bar";
import {WorkOrderDrawer} from "../../services/work-order-drawer";
import {WorkOrdersForCenter} from "./pipes/work-orders-for-center";

const COLUMN_WIDTH = 140;


@Component({
    selector: 'app-timeline',
    imports: [
        WorkOrderBar,
        WorkOrdersForCenter
    ],
    templateUrl: './timeline.html',
    styleUrl: './timeline.scss',
    providers: [TimelineColumn]
})
export class Timeline {
    private readonly _timelineColumn = inject(TimelineColumn);

    private readonly _workOrderUpsert = inject(WorkOrderDrawer);

    readonly workCenterId = input<WorkCenterDocument['docId']>();

    readonly workCenters = input<WorkCenterDocument[]>();

    readonly workOrders = input<WorkOrderDocument[]>();

    readonly zoomLevel = input<ZoomLevel>('month');

    readonly timelineColumns = this._timelineColumn.timelineColumns(
        this.zoomLevel,
        this.workOrders
    );

    readonly currentTimeLinePosition = computed(() => {
        const columns = this.timelineColumns();
        const currentIndex = columns.findIndex(col => col.isCurrent);

        if (currentIndex === -1) {
            return null;
        }

        // Position at the start of the current column
        return currentIndex * COLUMN_WIDTH;
    });

    protected _addNew(workCenter: WorkCenterDocument, column: TimelineColumnItem): void {
        this._workOrderUpsert.add(workCenter.docId, column);
    }
}
