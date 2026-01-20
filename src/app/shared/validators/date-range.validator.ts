import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(startKey: string, endKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const startValue = group.get(startKey)?.value;
        const endValue = group.get(endKey)?.value;

        if (!startValue || !endValue) return null;

        const start = new Date(startValue);
        const end = new Date(endValue);

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        return start.getTime() < end.getTime() ? null : { dateRangeInvalid: true };
    };
}
