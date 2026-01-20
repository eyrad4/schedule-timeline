import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Timescale } from './timescale';

describe('Timescale', () => {
  let component: Timescale;
  let fixture: ComponentFixture<Timescale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Timescale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Timescale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
