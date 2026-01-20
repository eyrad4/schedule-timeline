import {Component, computed, signal, ElementRef, ViewChild, afterNextRender} from '@angular/core';
import {Title} from "../../shared/ui/title/title";
import {Timescale} from "./components/timescale/timescale";
import {WorkCenter, WorkCenterList} from "./components/work-center-list/work-center-list";

export type ZoomLevel = 'day' | 'week' | 'month' | 'hour';

@Component({
  selector: 'app-work-orders',
    imports: [
        Title,
        Timescale,
        WorkCenterList,
    ],
  templateUrl: './work-orders.html',
  styleUrl: './work-orders.scss',
})
export class WorkOrders {
    private _zoomLevel = signal<ZoomLevel>('month');

    protected _workCenters: WorkCenter[] = [
        { id: 'genesis', label: 'Genesis Hardware' },
        { id: 'rodriques', label: 'Rodriques Electrics' },
        { id: 'konsulting', label: 'Konsulting Inc' },
        { id: 'mcmarrow', label: 'McMarrow Distribution' },
        { id: 'spartan', label: 'Spartan Manufacturing' }
    ];

    protected _setZoomLevel(level: ZoomLevel): void {
        this._zoomLevel.set(level);
    }
}
