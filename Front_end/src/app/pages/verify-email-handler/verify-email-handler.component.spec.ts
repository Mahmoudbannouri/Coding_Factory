import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailHandlerComponent } from './verify-email-handler.component';

describe('VerifyEmailHandlerComponent', () => {
  let component: VerifyEmailHandlerComponent;
  let fixture: ComponentFixture<VerifyEmailHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyEmailHandlerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyEmailHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
