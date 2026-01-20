import {Directive, effect, input, InputSignal, Renderer2, ElementRef} from "@angular/core";
import {WorkOrderDocument} from "../../../models/work-order-document";
import {ZoomLevel} from "../../../models/zoom-level";

interface Column {
    label: string;
    date: Date;
    isCurrent?: boolean;
}

@Directive({
    selector: '[timelinePosition]',
    standalone: true
})
export class TimelinePosition {
    readonly workOrder = input.required<WorkOrderDocument | undefined>({alias: 'timelinePosition'});

    readonly zoomLevel = input.required<ZoomLevel | undefined>();

    readonly columns = input.required<Column[] | undefined>();

    constructor(
        private renderer: Renderer2,
        private el: ElementRef
    ) {
        effect(() => {
            const workOrder = this.workOrder();
            const zoomLevel = this.zoomLevel();
            const columns = this.columns();

            if (!workOrder || !zoomLevel || !columns || columns.length === 0) {
                this.renderer.setStyle(this.el.nativeElement, 'left', '0px');
                this.renderer.setStyle(this.el.nativeElement, 'width', '0px');
                return;
            }

            const position = this.calculatePosition(
                workOrder,
                zoomLevel,
                columns
            );

            this.renderer.setStyle(this.el.nativeElement, 'left', position.left);
            this.renderer.setStyle(this.el.nativeElement, 'width', position.width);
        });
    }

    private calculatePosition(workOrder: WorkOrderDocument, zoom: ZoomLevel, columns: Column[]): { left: string; width: string } {
        const columnWidthPx = 140; // matches min-width in CSS

        const firstColumnDate = columns[0].date;
        let lastColumnDate = new Date(columns[columns.length - 1].date);

        // Add appropriate time span to last column based on zoom level
        if (zoom === 'month') {
            lastColumnDate.setMonth(lastColumnDate.getMonth() + 1);
        } else if (zoom === 'week') {
            lastColumnDate.setDate(lastColumnDate.getDate() + 7);
        } else if (zoom === 'day') {
            lastColumnDate.setDate(lastColumnDate.getDate() + 1);
        } else if (zoom === 'hour') {
            lastColumnDate.setHours(lastColumnDate.getHours() + 1);
        }

        const totalTimespan = lastColumnDate.getTime() - firstColumnDate.getTime();
        const startOffset = new Date(workOrder.data.startDate).getTime() - firstColumnDate.getTime();
        const duration = new Date(workOrder.data.endDate).getTime() - new Date(workOrder.data.startDate).getTime();

        const totalWidth = columns.length * columnWidthPx;
        const left = (startOffset / totalTimespan) * totalWidth;
        const width = (duration / totalTimespan) * totalWidth;

        return {
            left: `${Math.max(0, left)}px`,
            width: `${Math.max(20, width)}px`
        };
    }
}
