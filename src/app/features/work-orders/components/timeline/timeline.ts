import {Component, computed, inject, input, signal} from '@angular/core';
import {WorkOrderDocument} from "../../models/work-order-document";
import {TimelineColumn} from "./services/timeline-column";
import {ZoomLevel} from "../../models/zoom-level";
import {WorkCenterDocument} from "../../models/work-center-document";
import {WorkOrderBar} from "../work-order-bar/work-order-bar";
import {WorkOrderDrawer} from "../../services/work-order-drawer";
import {WorkOrdersForCenter} from "./pipes/work-orders-for-center";

const COLUMN_WIDTH = 140;

interface HoverState {
    visible: boolean;
    left: number;
    rowIndex: number;
}

@Component({
    selector: 'app-timeline',
    imports: [
        WorkOrderBar,
        WorkOrdersForCenter
    ],
    templateUrl: './timeline.html',
    styleUrl: './timeline.scss',
    providers: [TimelineColumn]
})
export class Timeline {
    private readonly _timelineColumn = inject(TimelineColumn);

    private readonly _workOrderUpsert = inject(WorkOrderDrawer);

    readonly workCenterId = input<WorkCenterDocument['docId']>();

    readonly workCenters = input<WorkCenterDocument[]>();

    readonly workOrders = input<WorkOrderDocument[]>();

    readonly zoomLevel = input<ZoomLevel>('month');

    readonly timelineColumns = this._timelineColumn.timelineColumns(
        this.zoomLevel,
        this.workOrders
    );

    readonly currentTimeLinePosition = computed(() => {
        const columns = this.timelineColumns();
        const currentIndex = columns.findIndex(col => col.isCurrent);

        if (currentIndex === -1) {
            return null;
        }

        return currentIndex * COLUMN_WIDTH;
    });

    readonly timelineWidth = computed(() => {
        return this.timelineColumns().length * COLUMN_WIDTH;
    });

    protected readonly hoverState = signal<HoverState>({
        visible: false,
        left: 0,
        rowIndex: -1
    });

    // Event delegation - single click handler for entire row
    protected _onRowClick(event: MouseEvent, workCenter: WorkCenterDocument): void {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const clickX = event.clientX - rect.left;

        const columnIndex = Math.floor(clickX / COLUMN_WIDTH);
        const columns = this.timelineColumns();

        if (columnIndex >= 0 && columnIndex < columns.length) {
            this._workOrderUpsert.add(workCenter.docId, columns[columnIndex]);
        }
    }

    protected _onRowMouseMove(event: MouseEvent, rowIndex: number, workCenterId: string): void {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;

        const columnIndex = Math.floor(mouseX / COLUMN_WIDTH);
        const columns = this.timelineColumns();

        if (columnIndex >= 0 && columnIndex < columns.length) {
            const columnDate = columns[columnIndex].date;
            const isOccupied = this._isColumnOccupied(workCenterId, columnDate);

            if (isOccupied) {
                this.hoverState.set({ visible: false, left: 0, rowIndex: -1 });
                return;
            }
        }

        const left = columnIndex * COLUMN_WIDTH;

        this.hoverState.set({
            visible: true,
            left,
            rowIndex
        });
    }

    private _isColumnOccupied(workCenterId: string, columnDate: Date): boolean {
        const orders = this.workOrders()?.filter(wo => wo.data.workCenterId === workCenterId) ?? [];
        if (orders.length === 0) {
            return false;
        }

        const columnStartTimestamp = new Date(columnDate).setHours(0, 0, 0, 0);
        const columnEndTimestamp = this._getEndByZoom(new Date(columnDate)).setHours(23, 59, 59, 999);

        const occupiedDaysSet = new Set<number>();
        const millisecondsPerDay = 86400000;

        orders.forEach((order) => {
            const orderStartTimestamp = new Date(order.data.startDate).setHours(0, 0, 0, 0);
            const orderEndTimestamp = new Date(order.data.endDate).setHours(0, 0, 0, 0);

            const start = Math.max(orderStartTimestamp, columnStartTimestamp);
            const end = Math.min(orderEndTimestamp, columnEndTimestamp);

            if (start <= end) {
                for (let day = start; day <= end; day += millisecondsPerDay) { // крок у 1 день (мс)
                    occupiedDaysSet.add(day);
                }
            }
        });

        const totalDaysInPeriod = Math.round((columnEndTimestamp - columnStartTimestamp) / millisecondsPerDay);

        return occupiedDaysSet.size >= totalDaysInPeriod;
    }

    private _getEndByZoom(date: Date): Date {
        const end = new Date(date);
        if (this.zoomLevel() === 'month') {
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
        } else if (this.zoomLevel() === 'week') {
            end.setDate(end.getDate() + 6);
        }
        return end;
    }

    // private _isColumnOccupied(workCenterId: string, columnDate: Date): boolean {
    //     const orders = this.workOrders() ?? [];
    //     const centerOrders = orders.filter(wo => wo.data.workCenterId === workCenterId);
    //
    //     if (centerOrders.length === 0) return false;
    //
    //     const colStart = new Date(columnDate);
    //     colStart.setHours(0, 0, 0, 0);
    //
    //     const colEnd = new Date(columnDate);
    //     const zoom = this.zoomLevel();
    //
    //     if (zoom === 'month') {
    //         colEnd.setMonth(colEnd.getMonth() + 1);
    //         colEnd.setDate(0);
    //     } else if (zoom === 'week') {
    //         colEnd.setDate(colEnd.getDate() + 6);
    //     }
    //     colEnd.setHours(23, 59, 59, 999);
    //
    //     const daysInPeriod: number[] = [];
    //     let current = new Date(colStart);
    //     while (current <= colEnd) {
    //         daysInPeriod.push(current.getTime());
    //         current.setDate(current.getDate() + 1);
    //     }
    //
    //     const allDaysOccupied = daysInPeriod.every(dayTimestamp => {
    //         return centerOrders.some(order => {
    //             const s = new Date(order.data.startDate).setHours(0,0,0,0);
    //             const e = new Date(order.data.endDate).setHours(23,59,59,999);
    //             return dayTimestamp >= s && dayTimestamp <= e;
    //         });
    //     });
    //
    //     return allDaysOccupied;
    // }

    protected _onRowMouseLeave(): void {
        this.hoverState.set({
            visible: false,
            left: 0,
            rowIndex: -1
        });
    }
}
