import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyUserProfileComponent } from './agency-user-profile.component';

describe('AgencyUserProfileComponent', () => {
  let component: AgencyUserProfileComponent;
  let fixture: ComponentFixture<AgencyUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyUserProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
