import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyStaffComponent } from './agency-staff.component';

describe('AgencyStaffComponent', () => {
  let component: AgencyStaffComponent;
  let fixture: ComponentFixture<AgencyStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
