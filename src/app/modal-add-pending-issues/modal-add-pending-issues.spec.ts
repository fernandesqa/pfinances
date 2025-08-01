import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPendingIssues } from './modal-add-pending-issues';

describe('ModalAddPendingIssues', () => {
  let component: ModalAddPendingIssues;
  let fixture: ComponentFixture<ModalAddPendingIssues>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddPendingIssues]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddPendingIssues);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
