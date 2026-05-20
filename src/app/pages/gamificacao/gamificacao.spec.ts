import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gamificacao } from './gamificacao';

describe('Gamificacao', () => {
  let component: Gamificacao;
  let fixture: ComponentFixture<Gamificacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gamificacao],
    }).compileComponents();

    fixture = TestBed.createComponent(Gamificacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
