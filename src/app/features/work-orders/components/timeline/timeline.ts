import {Component, ElementRef, inject, input, viewChild} from '@angular/core';
import {WorkOrderDocument} from "../../models/work-order-document";
import {TimelineColumn} from "./services/timeline-column";
import {TimelinePosition} from "./directives/timeline-position";
import {ZoomLevel} from "../../models/zoom-level";
import {MapperPipe} from "../../../../shared/pipes/mapper";
import {WorkCenterDocument} from "../../models/work-center-document";
import {TimelineSyncScroll} from "./services/timeline-sync-scroll";
import {WorkOrderBar} from "../work-order-bar/work-order-bar";

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




}
