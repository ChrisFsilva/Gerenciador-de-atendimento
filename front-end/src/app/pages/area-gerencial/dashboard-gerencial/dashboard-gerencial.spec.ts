import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGerencial } from './dashboard-gerencial';

describe('DashboardGerencial', () => {
  let component: DashboardGerencial;
  let fixture: ComponentFixture<DashboardGerencial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardGerencial],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardGerencial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
