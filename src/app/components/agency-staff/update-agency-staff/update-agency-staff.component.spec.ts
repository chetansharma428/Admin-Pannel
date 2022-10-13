import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAgencyStaffComponent } from './update-agency-staff.component';

describe('UpdateAgencyStaffComponent', () => {
  let component: UpdateAgencyStaffComponent;
  let fixture: ComponentFixture<UpdateAgencyStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAgencyStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAgencyStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
