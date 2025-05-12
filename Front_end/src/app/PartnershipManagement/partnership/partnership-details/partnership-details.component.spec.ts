import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnershipDetailsComponent } from './partnership-details.component';

describe('PartnershipDetailsComponent', () => {
  let component: PartnershipDetailsComponent;
  let fixture: ComponentFixture<PartnershipDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnershipDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnershipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
