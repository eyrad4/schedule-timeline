import {Injectable, signal} from "@angular/core";
import {WorkCenterDocument} from "../models/work-center-document";

@Injectable()
export class WorkCentersData {
    private _workCenters = signal<WorkCenterDocument[]>([
        {
            docId: 'genesis',
            docType: 'workCenter',
            data: {
                name: 'Genesis Hardware'
            }
        },
        {
            docId: 'rodriques',
            docType: 'workCenter',
            data: {
                name: 'Rodriques Electrics'
            }
        },

        {
            docId: 'konsulting',
            docType: 'workCenter',
            data: {
                name: 'Konsulting Inc'
            }
        },
        {
            docId: 'mcmarrow',
            docType: 'workCenter',
            data: {
                name: 'McMarrow Distribution'
            }
        },
        {
            docId: 'spartan',
            docType: 'workCenter',
            data: {
                name: 'Spartan Manufacturing'
            }
        },
    ]);

    readonly workCenters = this._workCenters.asReadonly();

    add(workCenter: WorkCenterDocument) {
        this._workCenters.update((workCenters) => [...workCenters, workCenter]);
    }
}
