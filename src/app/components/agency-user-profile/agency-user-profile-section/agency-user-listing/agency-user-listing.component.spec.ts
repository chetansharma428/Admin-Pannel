import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyUserListingComponent } from './agency-user-listing.component';

describe('AgencyUserListingComponent', () => {
  let component: AgencyUserListingComponent;
  let fixture: ComponentFixture<AgencyUserListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyUserListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyUserListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
