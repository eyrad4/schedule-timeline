import {ElementRef, Injectable} from "@angular/core";

@Injectable()
export class TimelineSyncScroll {
    syncScroll(timelineHeader: ElementRef<HTMLDivElement>, timelineBody: ElementRef<HTMLDivElement>): void {
        if (!timelineHeader || !timelineBody) {
            console.error('Timeline elements not found', {
                header: timelineHeader,
                body: timelineBody
            });
            return;
        }

        const header = timelineHeader.nativeElement;
        const body = timelineBody.nativeElement;

        console.log('Setting up scroll sync', { header, body });

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

        console.log('Scroll sync set up successfully');
    }
}
