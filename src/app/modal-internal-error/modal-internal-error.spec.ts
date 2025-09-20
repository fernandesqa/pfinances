import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInternalError } from './modal-internal-error';

describe('ModalInternalError', () => {
  let component: ModalInternalError;
  let fixture: ComponentFixture<ModalInternalError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInternalError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInternalError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
