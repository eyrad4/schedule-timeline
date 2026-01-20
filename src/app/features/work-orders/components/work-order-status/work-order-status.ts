import {Component, computed, input} from '@angular/core';
import {WorkOrderDocument} from "../../models/work-order-document";
import {getStatusLabel} from "../../models/work-order-status-item";

@Component({
    selector: 'app-work-order-status',
    imports: [],
    host: {
        ['class']: 'work-order-status',
        ['[class.work-order-status--complete]']: 'status() === "complete"',
        ['[class.work-order-status--in-progress]']: 'status() === "in-progress"',
        ['[class.work-order-status--blocked]']: 'status() === "blocked"',
        ['[class.work-order-status--open]']: 'status() === "open"',
    },
    template: `
        {{ _getStatusLabel() }}
    `,
    styleUrl: './work-order-status.scss',
})
export class WorkOrderStatus {
    readonly status = input<WorkOrderDocument['data']['status']>();

    protected _getStatusLabel = computed(() => {
        const status = this.status();

        if (!status) {
            return '';
        }

        return getStatusLabel(status) ?? 'Unknown';
    });
}
