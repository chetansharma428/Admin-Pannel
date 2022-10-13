import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateEmployeeComponent } from './corporate-employee.component';

describe('CorporateEmployeeComponent', () => {
  let component: CorporateEmployeeComponent;
  let fixture: ComponentFixture<CorporateEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
