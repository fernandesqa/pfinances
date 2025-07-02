import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddMember } from './modal-add-member';

describe('ModalAddMember', () => {
  let component: ModalAddMember;
  let fixture: ComponentFixture<ModalAddMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddMember]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddMember);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
