import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaGerencial } from '../area-gerencial/area-gerencial';

describe('AreaGerencial', () => {
  let component: AreaGerencial;
  let fixture: ComponentFixture<AreaGerencial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaGerencial],
    }).compileComponents();

    fixture = TestBed.createComponent(AreaGerencial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
