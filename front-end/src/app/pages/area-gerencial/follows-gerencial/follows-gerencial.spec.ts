import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowsGerencial } from './follows-gerencial';

describe('FollowsGerencial', () => {
  let component: FollowsGerencial;
  let fixture: ComponentFixture<FollowsGerencial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowsGerencial],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowsGerencial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
