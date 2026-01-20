import {Component, computed, output, signal} from '@angular/core';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {ZoomLevel} from "../../work-orders";

@Component({
  selector: 'app-timescale',
    imports: [
        NgbDropdown,
        NgbDropdownItem,
        NgbDropdownMenu,
        NgbDropdownToggle
    ],
  templateUrl: './timescale.html',
  styleUrl: './timescale.scss',
})
export class Timescale {
    protected _zoomLevel = signal<ZoomLevel>('month');

    protected _levels: { label: string; type: ZoomLevel }[] = [
        {
            label: 'Hour',
            type: 'hour'
        },
        {
            label: 'Day',
            type: 'day'
        },
        {
            label: 'Week',
            type: 'week'
        },
        {
            label: 'Month',
            type: 'month'
        }
    ];

    protected _selectedLevelLabel = computed(() => {
        const selectedLevel = this._zoomLevel();
        return this._levels.find(level => level.type === selectedLevel)?.label;
    });

    zoomLevelChange = output<ZoomLevel>();

    protected _changeZoom(level: ZoomLevel) {
        this._zoomLevel.set(level);
        // Тут можна викликати API або оновлювати графік
        console.log('Scale changed to:', level);
        this.zoomLevelChange.emit(level);
    }
}
