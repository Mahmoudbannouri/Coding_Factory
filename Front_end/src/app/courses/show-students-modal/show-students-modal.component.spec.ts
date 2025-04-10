import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowStudentsModalComponent } from './show-students-modal.component';

describe('ShowStudentsModalComponent', () => {
  let component: ShowStudentsModalComponent;
  let fixture: ComponentFixture<ShowStudentsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowStudentsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowStudentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
