import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderStatus } from './work-order-status';

describe('WorkOrderStatus', () => {
  let component: WorkOrderStatus;
  let fixture: ComponentFixture<WorkOrderStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
