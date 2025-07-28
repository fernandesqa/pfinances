import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPendingIssues } from './modal-pending-issues';

describe('ModalPendingIssues', () => {
  let component: ModalPendingIssues;
  let fixture: ComponentFixture<ModalPendingIssues>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPendingIssues]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPendingIssues);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
