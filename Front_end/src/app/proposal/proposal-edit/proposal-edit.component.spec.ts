import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalEditComponent } from './proposal-edit.component';

describe('ProposalEditComponent', () => {
  let component: ProposalEditComponent;
  let fixture: ComponentFixture<ProposalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
