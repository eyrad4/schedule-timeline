import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderUpsertDrawer } from './work-order-upsert-drawer';

describe('WorkOrderUpsertDrawer', () => {
  let component: WorkOrderUpsertDrawer;
  let fixture: ComponentFixture<WorkOrderUpsertDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderUpsertDrawer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderUpsertDrawer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
