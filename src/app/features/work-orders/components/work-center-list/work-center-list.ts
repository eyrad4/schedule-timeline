import {Component, input, output} from '@angular/core';
import {WorkCenterDocument} from "../../models/work-center-document";

@Component({
  selector: 'app-work-center-list',
  templateUrl: './work-center-list.html',
  styleUrl: './work-center-list.scss',
})
export class WorkCenterList {
    readonly workCenterId = input<WorkCenterDocument['docId']>();

    readonly workCenters = input<WorkCenterDocument[]>();

    readonly workCenterChange = output<WorkCenterDocument['docId']>();
}
