import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalManageFamily } from './modal-manage-family';

describe('ModalManageFamily', () => {
  let component: ModalManageFamily;
  let fixture: ComponentFixture<ModalManageFamily>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalManageFamily]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalManageFamily);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
