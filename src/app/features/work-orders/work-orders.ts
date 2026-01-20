import {Component, signal, inject, effect} from '@angular/core';
import {Title} from "../../shared/ui/title/title";
import {Timescale} from "./components/timescale/timescale";
import {WorkCenterList} from "./components/work-center-list/work-center-list";
import {WorkOrdersData} from "./data-access/work-orders-data";
import {Timeline} from "./components/timeline/timeline";
import {ZoomLevel} from "./models/zoom-level";
import {WorkCenterDocument} from "./models/work-center-document";
import {WorkCentersData} from "./data-access/work-centers-data";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {WorkOrderUpsertDrawer} from "./components/upsert/work-order-upsert-drawer";
import {WorkOrderDrawer} from "./services/work-order-drawer";

@Component({
    selector: 'app-work-orders',
    imports: [
        Title,
        Timescale,
        WorkCenterList,
        Timeline,
    ],
    templateUrl: './work-orders.html',
    styleUrl: './work-orders.scss',
    providers: [WorkOrdersData, WorkCentersData, WorkOrderUpsertDrawer, WorkOrderDrawer]
})
export class WorkOrders {
    private _workCentersData = inject(WorkCentersData);
    protected _workCenters = this._workCentersData.workCenters;

    protected _zoomLevel = signal<ZoomLevel>('month');

    protected _workCenterId = signal<WorkCenterDocument['docId'] | undefined>(undefined);

    protected _workOrdersData = inject(WorkOrdersData);

    constructor() {
        effect(() => {
            const selectedWorkCenter = this._workCenterId();
            const firstWorkCenterId = this._workCenters()?.at(0)?.docId;
            if (!selectedWorkCenter && firstWorkCenterId) {
                this._workCenterId.set(firstWorkCenterId);
            }
        });
    }
}
