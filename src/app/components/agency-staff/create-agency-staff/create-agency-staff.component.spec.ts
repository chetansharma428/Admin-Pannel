import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgencyStaffComponent } from './create-agency-staff.component';

describe('CreateAgencyStaffComponent', () => {
  let component: CreateAgencyStaffComponent;
  let fixture: ComponentFixture<CreateAgencyStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAgencyStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAgencyStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
