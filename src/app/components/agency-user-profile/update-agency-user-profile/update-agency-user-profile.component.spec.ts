import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAgencyUserProfileComponent } from './update-agency-user-profile.component';

describe('UpdateAgencyUserProfileComponent', () => {
  let component: UpdateAgencyUserProfileComponent;
  let fixture: ComponentFixture<UpdateAgencyUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAgencyUserProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAgencyUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
