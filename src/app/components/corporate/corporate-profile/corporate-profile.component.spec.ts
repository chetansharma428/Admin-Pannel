import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateProfileComponent } from './corporate-profile.component';

describe('CorporateProfileComponent', () => {
  let component: CorporateProfileComponent;
  let fixture: ComponentFixture<CorporateProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
