import {Component, ElementRef, inject, input, output, viewChild} from '@angular/core';
import {WorkOrderDocument} from "../../models/work-order-document";
import {TimelineColumn, TimelineColumnItem} from "./services/timeline-column";
import {TimelinePosition} from "./directives/timeline-position";
import {ZoomLevel} from "../../models/zoom-level";
import {MapperPipe} from "../../../../shared/pipes/mapper";
import {WorkCenterDocument} from "../../models/work-center-document";
import {TimelineSyncScroll} from "./services/timeline-sync-scroll";
import {WorkOrderBar} from "../work-order-bar/work-order-bar";

export interface CellClickEvent {
    workCenter: WorkCenterDocument;
    column: TimelineColumnItem;
}

@Component({
    selector: 'app-timeline',
    imports: [
        WorkOrderBar,
        MapperPipe
    ],
    templateUrl: './timeline.html',
    styleUrl: './timeline.scss',
    providers: [TimelineColumn, TimelineSyncScroll]
})
export class Timeline {
    private readonly _timelineColumn = inject(TimelineColumn);
    private readonly _syncScroll = inject(TimelineSyncScroll);

    readonly workCenterId = input<WorkCenterDocument['docId']>();

    readonly workCenters = input<WorkCenterDocument[]>();

    readonly workOrders = input<WorkOrderDocument[]>();

    readonly zoomLevel = input<ZoomLevel>('month');

    readonly addNew = output<CellClickEvent>();

    readonly timelineColumns = this._timelineColumn.timelineColumns(
        this.zoomLevel,
        this.workOrders
    );

    protected _getWorkOrdersForCenter = (center: WorkCenterDocument['docId']): WorkOrderDocument[] => {
        const workOrders = this.workOrders();
        if (!workOrders || workOrders.length <= 0) {
            return [];
        }

        return workOrders.filter(wo => wo.data.workCenterId === center);
    }

    protected _addNew(workCenter: WorkCenterDocument, column: TimelineColumnItem): void {
        this.addNew.emit({ workCenter, column });
    }
}
