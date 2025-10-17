import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddSavings } from './modal-add-savings';

describe('ModalAddSavings', () => {
  let component: ModalAddSavings;
  let fixture: ComponentFixture<ModalAddSavings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddSavings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddSavings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
