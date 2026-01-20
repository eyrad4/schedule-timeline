import {Component, computed, effect, inject, input, model} from '@angular/core';
import {NgbActiveOffcanvas, NgbDateAdapter, NgbDateNativeAdapter, NgbDateStruct, NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {CreateWorkOrderDocument, WorkOrderDocument} from "../../models/work-order-document";
import {WorkCenterDocument} from "../../models/work-center-document";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {getStatusLabel, WORK_ORDER_STATUS, WorkOrderStatusItem} from "../../models/work-order-status-item";
import {WorkOrderStatus} from "../work-order-status/work-order-status";
import {dateRangeValidator} from "../../../../shared/validators/date-range.validator";

@Component({
  selector: 'app-upsert',
    imports: [ReactiveFormsModule, NgSelectModule, NgbInputDatepicker, WorkOrderStatus],
  templateUrl: './work-order-upsert-drawer.html',
  styleUrl: './work-order-upsert-drawer.scss',
    providers: [
        {
            provide: NgbDateAdapter, useClass: NgbDateNativeAdapter
        }
    ]
})
export class WorkOrderUpsertDrawer {
    private readonly _fb = inject(FormBuilder);

    protected readonly _activeOffcanvas = inject(NgbActiveOffcanvas);

    protected statuses = Object.values(WORK_ORDER_STATUS).map((status) => {
        return {
            value: status,
            label: getStatusLabel(status)
        }
    });

    protected _form = this._fb.group({
        name: this._fb.control<string | null>(null, { nonNullable: false, validators: [Validators.required] }),
        status: this._fb.control<WorkOrderStatusItem | null>(WORK_ORDER_STATUS.open, { nonNullable: false, validators: [Validators.required] }),
        endDate: this._fb.control<string | Date | null>(null, { nonNullable: false, validators: [Validators.required] }),
        startDate: this._fb.control<string | Date | null>(null, { nonNullable: false, validators: [Validators.required] }),
    }, {
        validators: [dateRangeValidator('startDate', 'endDate')]
    });

    readonly createData= model<{ workCenterDocId: WorkCenterDocument['docId'] }>();

    readonly editData= model<WorkOrderDocument>();

    readonly actionLabel = computed(() => {
        return this.createData() ? 'Create' : 'Update';
    })

    constructor() {
        effect(() => {
            const editData = this.editData();
            if (editData) {
                this._form.patchValue({
                    name: editData.data.name,
                    status: editData.data.status,
                    startDate: editData.data.startDate ? new Date(editData.data.startDate) : null,
                    endDate: editData.data.endDate ? new Date(editData.data.endDate) : null,
                });
            }
        });
    }

    protected _upsert(): void {
        console.log(this._form.getRawValue())
        if (this._form.valid) {
            if (this.createData()) {
                this._create();
            } else {
                this._update();
            }
        } else {
            this._form.markAllAsTouched();
        }
    }

    private _update(): void {
        const { name, status, endDate, startDate } = this._form.getRawValue() || {};
        const editData = this.editData();

        if (editData && name && status && endDate && startDate) {
            const createData: CreateWorkOrderDocument = {
                ...editData,
                data: {
                    ...editData.data,
                    name,
                    status,
                    startDate: this._formatDate(startDate),
                    endDate: this._formatDate(endDate),
                }
            }
            this._activeOffcanvas.close(createData);
        }
    }

    private _create(): void {
        const workCenterDocId = this.createData()?.workCenterDocId;
        const { name, status, endDate, startDate } = this._form.getRawValue() || {};

        if (workCenterDocId && name && status && endDate && startDate) {
            const createData: CreateWorkOrderDocument = {
                docType: 'workOrder',
                data: {
                    name,
                    status,
                    startDate: this._formatDate(startDate),
                    endDate: this._formatDate(endDate),
                    workCenterId: workCenterDocId,
                }
            }
            this._activeOffcanvas.close(createData)
        }
    }

    private _formatDate(date: any): string {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }
}
