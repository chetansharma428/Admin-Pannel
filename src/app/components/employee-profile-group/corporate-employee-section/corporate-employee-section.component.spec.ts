import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateEmployeeSectionComponent } from './corporate-employee-section.component';

describe('CorporateEmployeeSectionComponent', () => {
  let component: CorporateEmployeeSectionComponent;
  let fixture: ComponentFixture<CorporateEmployeeSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateEmployeeSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateEmployeeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
