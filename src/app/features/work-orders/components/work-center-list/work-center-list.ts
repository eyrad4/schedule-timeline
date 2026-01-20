import {Component, computed, effect, input, output, signal} from '@angular/core';
import {ZoomLevel} from "../../work-orders";

export interface WorkCenter {
    id: string;
    label: string;
}

@Component({
  selector: 'app-work-center-list',
  templateUrl: './work-center-list.html',
  styleUrl: './work-center-list.scss',
})
export class WorkCenterList {
    protected _selectedWorkCenter = signal<WorkCenter['id'] | undefined>(undefined);

    readonly workCenters = input<WorkCenter[]>();

    readonly workCenterChange = output<WorkCenter['id']>();

    constructor() {
        effect(() => {
            const selectedWorkCenter = this._selectedWorkCenter();
            const firstWorkCenterId = this.workCenters()?.at(0)?.id;
            if (!selectedWorkCenter && firstWorkCenterId) {
                this.workCenterChange.emit(firstWorkCenterId);
                this._selectedWorkCenter.set(firstWorkCenterId);
            }
        });
    }

    protected _changeWorkCenter(workCenterId: WorkCenter['id']) {
        this._selectedWorkCenter.set(workCenterId);
        this.workCenterChange.emit(workCenterId);
    }
}
