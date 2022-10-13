import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSectionComponent } from './employee-section.component';

describe('EmployeeSectionComponent', () => {
  let component: EmployeeSectionComponent;
  let fixture: ComponentFixture<EmployeeSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
