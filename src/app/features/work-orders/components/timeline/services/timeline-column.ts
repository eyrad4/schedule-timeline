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
    private _currentDate = new Date(); // September 2024

    readonly timelineColumns = (zoom: InputSignal<ZoomLevel>, workOrders: InputSignal<WorkOrderDocument[] | undefined>) => computed(() => {
        const zoomLevel: Record<ZoomLevel, () => Column[]> = {
            hour: () => this._hour(),
            day: () => this._day(),
            week: () => this._week(),
            month: () => this._month(workOrders)
        }

        return zoomLevel[zoom()]();
    });

    private _month(workOrders: InputSignal<WorkOrderDocument[] | undefined>): Column[] {
        const columns: Column[] = [];
        const orders = workOrders() ?? [];
        const earliestDate = orders.reduce((min, order) =>
                order.data.startDate < min ? order.data.startDate : min,
            orders[0].data.startDate
        );
        const latestDate = orders.reduce((max, order) =>
                order.data.endDate > max ? order.data.endDate : max,
            orders[0].data.endDate
        );

        // Generate columns from start to end month
        const startYear = new Date(earliestDate).getFullYear();
        const startMonth = new Date(earliestDate).getMonth();
        const endYear = new Date(latestDate).getFullYear();
        const endMonth = new Date(latestDate).getMonth();

        for (let year = startYear; year <= endYear; year++) {
            const monthStart = year === startYear ? startMonth : 0;
            const monthEnd = year === endYear ? endMonth : 11;

            for (let month = monthStart; month <= monthEnd; month++) {
                const date = new Date(year, month, 1);
                const isCurrent = month === 8 && year === 2024;
                columns.push({
                    label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    date,
                    isCurrent
                });
            }
        }

        return columns;
    }

    private _week(): Column[] {
        const columns: Column[] = [];
        for (let i = -2; i < 10; i++) {
            const date = this._currentDate;
            date.setDate(date.getDate() + (i * 7));
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 6);

            const startMonth = date.toLocaleDateString('en-US', { month: 'short' });
            const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
            const startDay = date.getDate();
            const endDay = endDate.getDate();

            // If same month, show "Sep 1 - 7", otherwise "Sep 30 - Oct 6"
            const label = startMonth === endMonth
                ? `${startMonth} ${startDay} - ${endDay}`
                : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;

            columns.push({
                label,
                date
            });
        }

        return columns;
    }

    private _day(): Column[] {
        const columns: Column[] = [];
        for (let i = 0; i < 30; i++) {
            const date = this._currentDate;
            date.setDate(date.getDate() + i);
            const monthShort = date.toLocaleDateString('en-US', { month: 'short' });
            const day = date.getDate();
            const year = date.getFullYear();
            columns.push({
                label: `${monthShort} ${day}, ${year}`,
                date
            });
        }

        return columns;
    }

    private _hour(): Column[] {
        const columns: Column[] = [];
        for (let i = 0; i < 48; i++) {
            const date = this._currentDate;
            date.setHours(date.getHours() + i);
            const hour = date.getHours();
            const monthShort = date.toLocaleDateString('en-US', { month: 'short' });
            const day = date.getDate();

            // Format: "Sep 1 00:00" or "Sep 1 13:00" (24-hour format)
            const hourString = hour.toString().padStart(2, '0');
            columns.push({
                label: `${monthShort} ${day}, ${hourString}:00`,
                date
            });
        }

        return columns;
    }
}
