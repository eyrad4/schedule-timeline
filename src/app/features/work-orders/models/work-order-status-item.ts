import {WorkOrderDocument} from "./work-order-document";

export const WORK_ORDER_STATUS = {
    complete: 'complete',
    inProgress: 'in-progress',
    blocked: 'blocked',
    open: 'open'
} as const;

export type WorkOrderStatusItem =  typeof WORK_ORDER_STATUS[keyof typeof WORK_ORDER_STATUS];

export const getStatusLabel = (status: WorkOrderStatusItem): string => {
    const workOrderStatusName: Record<WorkOrderStatusItem, string> = {
        complete: 'Complete',
        'in-progress': 'In Progress',
        blocked: 'Blocked',
        open: 'Open'
    } as const;

    return workOrderStatusName[status]
}
