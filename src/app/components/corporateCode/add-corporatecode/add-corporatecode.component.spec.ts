import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCorporatecodeComponent } from './add-corporatecode.component';

describe('AddCorporatecodeComponent', () => {
  let component: AddCorporatecodeComponent;
  let fixture: ComponentFixture<AddCorporatecodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCorporatecodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCorporatecodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
