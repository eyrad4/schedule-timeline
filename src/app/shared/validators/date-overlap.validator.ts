import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { WorkOrderDocument } from '../../features/work-orders/models/work-order-document';

export interface DateOverlapValidatorConfig {
    workOrders: WorkOrderDocument[];
    workCenterId: string;
    excludeDocId?: string;
}

export function dateOverlapValidator(config: DateOverlapValidatorConfig): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const startValue = group.get('startDate')?.value;
        const endValue = group.get('endDate')?.value;

        if (!startValue || !endValue) return null;

        const newStart = new Date(startValue);
        const newEnd = new Date(endValue);
        newStart.setHours(0, 0, 0, 0);
        newEnd.setHours(0, 0, 0, 0);

        const workOrdersInCenter = config.workOrders.filter(wo => {
            if (wo.data.workCenterId !== config.workCenterId) return false;
            if (config.excludeDocId && wo.docId === config.excludeDocId) return false;
            return true;
        });

        const overlappingOrder = workOrdersInCenter.find(wo => {
            const existingStart = new Date(wo.data.startDate);
            const existingEnd = new Date(wo.data.endDate);
            existingStart.setHours(0, 0, 0, 0);
            existingEnd.setHours(0, 0, 0, 0);

            return newStart <= existingEnd && newEnd >= existingStart;
        });

        if (overlappingOrder) {
            return {
                dateOverlap: {
                    overlappingOrderName: overlappingOrder.data.name,
                    overlappingOrderId: overlappingOrder.docId
                }
            };
        }

        return null;
    };
}
