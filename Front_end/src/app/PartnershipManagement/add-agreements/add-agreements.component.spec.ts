import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgreementsComponent } from './add-agreements.component';

describe('AddAgreementsComponent', () => {
  let component: AddAgreementsComponent;
  let fixture: ComponentFixture<AddAgreementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAgreementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAgreementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
