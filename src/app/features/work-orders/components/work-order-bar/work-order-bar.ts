import {Component, input} from '@angular/core';
import {MapperPipe} from "../../../../shared/pipes/mapper";
import {WorkOrderDocument} from "../../models/work-order-document";
import {TimelinePosition} from "../timeline/directives/timeline-position";
import {ZoomLevel} from "../../models/zoom-level";
import {TimelineColumnItem} from "../timeline/services/timeline-column";
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {WorkOrderStatus} from "../work-order-status/work-order-status";

@Component({
  selector: 'app-work-order-bar',
    imports: [MapperPipe, TimelinePosition, NgbDropdown, NgbDropdownMenu, NgbDropdownItem, NgbDropdownToggle, WorkOrderStatus],
  templateUrl: './work-order-bar.html',
  styleUrl: './work-order-bar.scss',
})
export class WorkOrderBar {
    readonly order = input<WorkOrderDocument>();

    readonly zoomLevel = input<ZoomLevel>();

    readonly timelineColumns = input<TimelineColumnItem[]>();

    protected _getStatusClassName = (status: WorkOrderDocument['data']['status']): string => {
        return `status-${status}`;
    }
}
