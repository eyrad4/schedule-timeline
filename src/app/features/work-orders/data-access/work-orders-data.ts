import {Injectable, signal} from "@angular/core";
import {CreateWorkOrderDocument, WorkOrderDocument} from "../models/work-order-document";
import {WorkCenterDocument} from "../models/work-center-document";
import {uuid} from "../../../shared/utils/uuid";

@Injectable()
export class WorkOrdersData {
    private _workOrders = signal<WorkOrderDocument[]>([
        {
            docId: 'WO-001',
            docType: 'workOrder',
            data: {
                name: 'Intrix Ltd',
                workCenterId: 'genesis',
                status: 'complete',
                startDate: '2024-08-01',
                endDate: '2024-09-15'
            }
        },
        {
            docId: 'WO-002',
            docType: 'workOrder',
            data: {
                name: 'Complete',
                workCenterId: 'rodriques',
                status: 'complete',
                startDate: '2024-09-01',
                endDate: '2024-10-15'
            }
        },
        {
            docId: 'WO-003',
            docType: 'workOrder',
            data: {
                name: 'Konsulting Inc',
                workCenterId: 'konsulting',
                status: 'in-progress',
                startDate: '2024-09-15',
                endDate: '2024-10-30'
            }
        },
        {
            docId: 'WO-004',
            docType: 'workOrder',
            data: {
                name: 'Complex Systems',
                workCenterId: 'konsulting',
                status: 'in-progress',
                startDate: '2024-11-01',
                endDate: '2025-01-15'
            }
        },
        {
            docId: 'WO-005',
            docType: 'workOrder',
            data: {
                name: 'McMarrow Distribution',
                workCenterId: 'mcmarrow',
                status: 'blocked',
                startDate: '2024-11-15',
                endDate: '2027-02-28'
            }
        },
        {
            docId: 'WO-006',
            docType: 'workOrder',
            data: {
                name: 'Spartan Manufacturing',
                workCenterId: 'spartan',
                status: 'complete',
                startDate: '2024-09-01',
                endDate: '2024-09-30'
            }
        }
    ]);

    readonly workOrders = this._workOrders.asReadonly();

    add(workOrder: CreateWorkOrderDocument) {
        const newWorkOrder: WorkOrderDocument = {
            ...workOrder,
            docId: uuid()
        }
        this._workOrders.update((workOrders) => [...workOrders, newWorkOrder]);
    }

    update(updatedOrder: WorkOrderDocument) {
        this._workOrders.update((workOrders) => {
            return workOrders.map((currentOrder) =>
                currentOrder.docId === updatedOrder.docId ? updatedOrder : currentOrder
            );
        });
    }

    remove(workOrderDocId: WorkOrderDocument['docId'], workCenterId: WorkOrderDocument['data']['workCenterId']) {
        this._workOrders.update((workOrders) => {
            return workOrders.filter((w) => w.docId !== workOrderDocId);
        });
    }
}
