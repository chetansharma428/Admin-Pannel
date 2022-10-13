import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyStaffListComponent } from './agency-staff-list.component';

describe('AgencyStaffListComponent', () => {
  let component: AgencyStaffListComponent;
  let fixture: ComponentFixture<AgencyStaffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyStaffListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyStaffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
