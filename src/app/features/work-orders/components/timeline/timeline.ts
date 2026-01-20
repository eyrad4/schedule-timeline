import {Component, computed, ElementRef, inject, input, signal, viewChild} from '@angular/core';
import {WorkOrderDocument} from "../../models/work-order-document";
import {TimelineColumn} from "./services/timeline-column";
import {TimelinePosition} from "./directives/timeline-position";
import {ZoomLevel} from "../../models/zoom-level";
import {MapperPipe} from "../../../../shared/pipes/mapper";
import {WorkCenterDocument} from "../../models/work-center-document";

@Component({
    selector: 'app-timeline',
    imports: [
        TimelinePosition,
        MapperPipe
    ],
    templateUrl: './timeline.html',
    styleUrl: './timeline.scss',
    providers: [TimelineColumn]
})
export class Timeline {
    private readonly _timelineColumn = inject(TimelineColumn);

    protected _timelineHeader = viewChild<ElementRef<HTMLDivElement>>('timelineHeader');

    protected _timelineBody = viewChild<ElementRef<HTMLDivElement>>('timelineBody');

    readonly workCenterId = input<WorkCenterDocument['docId']>();

    readonly workCenters = input<WorkCenterDocument[]>();

    readonly workOrders = input<WorkOrderDocument[]>();

    readonly zoomLevel = input<ZoomLevel>('month');

    readonly timelineColumns = this._timelineColumn.timelineColumns(
        this.zoomLevel,
        this.workOrders
    );

    protected _getWorkOrdersForCenter = computed(() => {
        const workOrders = this.workOrders();
        const workCenterId = this.workCenterId();
        if (!workOrders || workOrders.length <= 0) {
            return [];
        }

        return workOrders.filter((w) => w.data.workCenterId === workCenterId) ?? [];
    });

    protected _getStatusClassName = (status: WorkOrderDocument['data']['status']): string => {
        return `status-${status}`;
    }

    protected _getStatusLabel = (status: WorkOrderDocument['data']['status']): string => {
        const labels: Record<WorkOrderDocument['data']['status'], string> = {
            'complete': 'Complete',
            'in-progress': 'In progress',
            'blocked': 'Blocked',
            'open': 'Open'
        };
        return labels[status];
    }
}
