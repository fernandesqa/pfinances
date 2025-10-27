import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddExpenses } from './modal-add-expenses';

describe('ModalAddExpenses', () => {
  let component: ModalAddExpenses;
  let fixture: ComponentFixture<ModalAddExpenses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddExpenses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddExpenses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
