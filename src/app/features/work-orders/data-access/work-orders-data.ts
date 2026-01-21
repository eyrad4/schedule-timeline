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
                name: 'Active Project (Week ago)',
                workCenterId: 'genesis',
                status: 'in-progress',
                startDate: '2025-12-13',
                endDate: '2026-02-20'
            }
        },
        {
            docId: 'WO-002',
            docType: 'workOrder',
            data: {
                name: 'Today Release',
                workCenterId: 'rodriques',
                status: 'complete',
                startDate: '2026-01-20',
                endDate: '2026-02-30'
            }
        },
        {
            docId: 'WO-003',
            docType: 'workOrder',
            data: {
                name: 'Future Sprint A',
                workCenterId: 'konsulting',
                status: 'open',
                startDate: '2026-01-01',
                endDate: '2026-02-15'
            }
        },
        {
            docId: 'WO-004',
            docType: 'workOrder',
            data: {
                name: 'Next Month Plan',
                workCenterId: 'konsulting',
                status: 'open',
                startDate: '2026-02-20',
                endDate: '2026-04-10'
            }
        },
        {
            docId: 'WO-005',
            docType: 'workOrder',
            data: {
                name: 'Long Term Blocked',
                workCenterId: 'mcmarrow',
                status: 'blocked',
                startDate: '2026-01-20',
                endDate: '2026-06-30'
            }
        },
        {
            docId: 'WO-006',
            docType: 'workOrder',
            data: {
                name: 'Spring Batch',
                workCenterId: 'spartan',
                status: 'open',
                startDate: '2026-03-01',
                endDate: '2026-08-25'
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
