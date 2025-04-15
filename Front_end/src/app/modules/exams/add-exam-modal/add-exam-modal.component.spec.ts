import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddexamModalComponent } from './add-exam-modal.component';

describe('AddexamModalComponent', () => {
  let component: AddexamModalComponent;
  let fixture: ComponentFixture<AddexamModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddexamModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddexamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
