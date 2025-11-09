import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBudgetTransfering } from './modal-budget-transfering';

describe('ModalBudgetTransfering', () => {
  let component: ModalBudgetTransfering;
  let fixture: ComponentFixture<ModalBudgetTransfering>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalBudgetTransfering]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBudgetTransfering);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
