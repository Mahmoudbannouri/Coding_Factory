import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentialpartnersComponent } from './potentialpartners.component';

describe('PotentialpartnersComponent', () => {
  let component: PotentialpartnersComponent;
  let fixture: ComponentFixture<PotentialpartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PotentialpartnersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PotentialpartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
