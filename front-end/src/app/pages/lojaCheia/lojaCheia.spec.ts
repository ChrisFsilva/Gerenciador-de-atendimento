import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LojaCheia } from './lojaCheia';

describe('LojaCheia', () => {
  let component: LojaCheia;
  let fixture: ComponentFixture<LojaCheia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LojaCheia],
    }).compileComponents();

    fixture = TestBed.createComponent(LojaCheia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
