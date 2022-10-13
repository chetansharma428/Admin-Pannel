import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyUserProfileSectionComponent } from './agency-user-profile-section.component';

describe('AgencyUserProfileSectionComponent', () => {
  let component: AgencyUserProfileSectionComponent;
  let fixture: ComponentFixture<AgencyUserProfileSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyUserProfileSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyUserProfileSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
