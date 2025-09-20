import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSuccess } from './modal-success';

describe('ModalSuccess', () => {
  let component: ModalSuccess;
  let fixture: ComponentFixture<ModalSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSuccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSuccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
