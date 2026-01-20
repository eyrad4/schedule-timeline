import {WorkOrderStatus} from "./work-order-status";
import {WorkCenterDocument} from "./work-center-document";

export interface WorkOrderDocument {
    docId: string;
    docType: 'workOrder';
    data: {
        name: string;
        workCenterId: WorkCenterDocument['docId'];           // References WorkCenterDocument.docId
        status: WorkOrderStatus;
        startDate: string;              // ISO format (e.g., "2025-01-15")
        endDate: string;                // ISO format
    };
}
