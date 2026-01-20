import {computed, Injectable, InputSignal} from "@angular/core";
import {ZoomLevel} from "../../../models/zoom-level";
import {WorkOrderDocument} from "../../../models/work-order-document";

interface Column {
    label: string;
    date: Date;
    isCurrent?: boolean;
}

@Injectable()
export class TimelineColumn {
    readonly timelineColumns = (zoom: InputSignal<ZoomLevel>, workOrders: InputSignal<WorkOrderDocument[] | undefined>) => computed(() => {
        const orders = workOrders() ?? [];
        if (orders.length === 0) {
            return [];
        }

        const { startDate, endDate } = this._getDateRange(orders);

        const zoomLevel: Record<ZoomLevel, () => Column[]> = {
            hour: () => this._hour(startDate, endDate),
            day: () => this._day(startDate, endDate),
            week: () => this._week(startDate, endDate),
            month: () => this._month(startDate, endDate)
        };

        return zoomLevel[zoom()]();
    });

    private _getDateRange(orders: WorkOrderDocument[]): { startDate: Date; endDate: Date } {
        const earliestDate = orders.reduce((min, order) =>
                order.data.startDate < min ? order.data.startDate : min,
            orders[0].data.startDate
        );
        const latestDate = orders.reduce((max, order) =>
                order.data.endDate > max ? order.data.endDate : max,
            orders[0].data.endDate
        );

        return {
            startDate: new Date(earliestDate),
            endDate: new Date(latestDate)
        };
    }

    private _isCurrentMonth(date: Date): boolean {
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }

    private _isCurrentWeek(date: Date): boolean {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return date >= weekStart && date <= weekEnd;
    }

    private _isCurrentDay(date: Date): boolean {
        const now = new Date();
        return date.toDateString() === now.toDateString();
    }

    private _isCurrentHour(date: Date): boolean {
        const now = new Date();
        return date.toDateString() === now.toDateString() && date.getHours() === now.getHours();
    }

    private _month(startDate: Date, endDate: Date): Column[] {
        const columns: Column[] = [];

        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();
        const endYear = endDate.getFullYear();
        const endMonth = endDate.getMonth();

        for (let year = startYear; year <= endYear; year++) {
            const monthStart = year === startYear ? startMonth : 0;
            const monthEnd = year === endYear ? endMonth : 11;

            for (let month = monthStart; month <= monthEnd; month++) {
                const date = new Date(year, month, 1);
                columns.push({
                    label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    date,
                    isCurrent: this._isCurrentMonth(date)
                });
            }
        }

        return columns;
    }

    private _week(startDate: Date, endDate: Date): Column[] {
        const columns: Column[] = [];

        // Start from the beginning of the week containing startDate
        const current = new Date(startDate);
        current.setDate(current.getDate() - current.getDay());
        current.setHours(0, 0, 0, 0);

        while (current <= endDate) {
            const weekStart = new Date(current);
            const weekEnd = new Date(current);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' });
            const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' });
            const startDay = weekStart.getDate();
            const endDay = weekEnd.getDate();

            const label = startMonth === endMonth
                ? `${startMonth} ${startDay} - ${endDay}`
                : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;

            columns.push({
                label,
                date: weekStart,
                isCurrent: this._isCurrentWeek(weekStart)
            });

            current.setDate(current.getDate() + 7);
        }

        return columns;
    }

    private _day(startDate: Date, endDate: Date): Column[] {
        const columns: Column[] = [];

        const current = new Date(startDate);
        current.setHours(0, 0, 0, 0);

        while (current <= endDate) {
            const date = new Date(current);
            columns.push({
                label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                date,
                isCurrent: this._isCurrentDay(date)
            });

            current.setDate(current.getDate() + 1);
        }

        return columns;
    }

    private _hour(startDate: Date, endDate: Date): Column[] {
        const columns: Column[] = [];

        const current = new Date(startDate);
        current.setMinutes(0, 0, 0);

        while (current <= endDate) {
            const date = new Date(current);
            const hour = date.getHours().toString().padStart(2, '0');

            columns.push({
                label: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${hour}:00`,
                date,
                isCurrent: this._isCurrentHour(date)
            });

            current.setHours(current.getHours() + 1);
        }

        return columns;
    }
}