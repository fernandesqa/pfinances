import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInvites } from './modal-invites';

describe('ModalInvites', () => {
  let component: ModalInvites;
  let fixture: ComponentFixture<ModalInvites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInvites]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInvites);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
