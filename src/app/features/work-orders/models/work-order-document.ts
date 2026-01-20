import {WorkOrderStatusItem} from "./work-order-status-item";
import {WorkCenterDocument} from "./work-center-document";

export interface WorkOrderDocument {
    docId: string;
    docType: 'workOrder';
    data: {
        name: string;
        workCenterId: WorkCenterDocument['docId'];           // References WorkCenterDocument.docId
        status: WorkOrderStatusItem;
        startDate: string;              // ISO format (e.g., "2025-01-15")
        endDate: string;                // ISO format
    };
}

export type CreateWorkOrderDocument = Omit<WorkOrderDocument, 'docId'>;
