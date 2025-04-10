import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddquizModalComponent } from './add-quiz-modal.component';
import { AddexamModalComponent } from '../add-exam-modal/add-exam-modal.component';

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
