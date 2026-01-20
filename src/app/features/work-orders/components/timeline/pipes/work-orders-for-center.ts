import {Pipe, PipeTransform} from "@angular/core";
import {WorkOrderDocument} from "../../../models/work-order-document";
import {WorkCenterDocument} from "../../../models/work-center-document";

@Pipe({
    name: 'workOrdersForCenter',
})
export class WorkOrdersForCenter implements PipeTransform {
    transform(value: WorkOrderDocument[] | undefined, center: WorkCenterDocument['docId']): WorkOrderDocument[] {
        const workOrders = value;
        if (!workOrders || workOrders.length <= 0) {
            return [];
        }

        return workOrders.filter(wo => wo.data.workCenterId === center);
    }

}
