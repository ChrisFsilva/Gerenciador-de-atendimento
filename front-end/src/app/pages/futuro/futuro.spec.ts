import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Futuro } from './futuro';

describe('Futuro', () => {
  let component: Futuro;
  let fixture: ComponentFixture<Futuro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Futuro],
    }).compileComponents();

    fixture = TestBed.createComponent(Futuro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
