import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgencyUserProfileComponent } from './create-agency-user-profile.component';

describe('CreateAgencyUserProfileComponent', () => {
  let component: CreateAgencyUserProfileComponent;
  let fixture: ComponentFixture<CreateAgencyUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAgencyUserProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAgencyUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
