import {ElementRef, Injectable} from "@angular/core";

@Injectable()
export class TimelineSyncScroll {
    private _initialized = false;

    syncScroll(timelineHeader: ElementRef<HTMLDivElement>, timelineBody: ElementRef<HTMLDivElement>): void {
        if (this._initialized || !timelineHeader || !timelineBody) {
            return;
        }

        const header = timelineHeader.nativeElement;
        const body = timelineBody.nativeElement;

        let isSyncing = false;

        const syncBodyToHeader = () => {
            if (isSyncing) return;
            isSyncing = true;
            requestAnimationFrame(() => {
                header.scrollLeft = body.scrollLeft;
                isSyncing = false;
            });
        };

        const syncHeaderToBody = () => {
            if (isSyncing) return;
            isSyncing = true;
            requestAnimationFrame(() => {
                body.scrollLeft = header.scrollLeft;
                isSyncing = false;
            });
        };

        body.addEventListener('scroll', syncBodyToHeader, { passive: true });
        header.addEventListener('scroll', syncHeaderToBody, { passive: true });

        this._initialized = true;
    }
}
