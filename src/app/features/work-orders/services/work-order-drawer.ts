import {inject, Injectable} from "@angular/core";
import {WorkCentersData} from "../data-access/work-centers-data";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {WorkOrderUpsertDrawer} from "../components/upsert/work-order-upsert-drawer";
import {WorkOrdersData} from "../data-access/work-orders-data";
import {WorkCenterDocument} from "../models/work-center-document";
import {TimelineColumnItem} from "../components/timeline/services/timeline-column";
import {CreateWorkOrderDocument, WorkOrderDocument} from "../models/work-order-document";

@Injectable()
export class WorkOrderDrawer {
    private _offcanvasService = inject(NgbOffcanvas);

    private readonly _workOrdersData = inject(WorkOrdersData);

    add(workCenterDocId: WorkCenterDocument['docId'], column: TimelineColumnItem): void {
        const offcanvasRef = this._offcanvasService.open(WorkOrderUpsertDrawer, {
            position: 'end',
            panelClass: 'custom-drawer-panel'
        });
        offcanvasRef.componentInstance.createData.set({
            workCenterDocId
        });
        offcanvasRef.componentInstance.workOrders.set(this._workOrdersData.workOrders());

        offcanvasRef.result.then(
            (result: CreateWorkOrderDocument) => {
                this._workOrdersData.add(result);
            }
        );
    }

    edit(data: WorkOrderDocument): void {
        const offcanvasRef = this._offcanvasService.open(WorkOrderUpsertDrawer, {
            position: 'end',
            panelClass: 'custom-drawer-panel'
        });
        offcanvasRef.componentInstance.editData.set(data);
        offcanvasRef.componentInstance.workOrders.set(this._workOrdersData.workOrders());

        offcanvasRef.result.then(
            (result: WorkOrderDocument) => {
                this._workOrdersData.update(result);
            }
        );
    }
}
