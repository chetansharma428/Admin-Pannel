import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateEmployeeListingComponent } from './corporate-employee-listing.component';

describe('CorporateEmployeeListingComponent', () => {
  let component: CorporateEmployeeListingComponent;
  let fixture: ComponentFixture<CorporateEmployeeListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateEmployeeListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateEmployeeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
