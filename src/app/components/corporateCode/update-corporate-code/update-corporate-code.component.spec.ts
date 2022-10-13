import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCorporateCodeComponent } from './update-corporate-code.component';

describe('UpdateCorporateCodeComponent', () => {
  let component: UpdateCorporateCodeComponent;
  let fixture: ComponentFixture<UpdateCorporateCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCorporateCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCorporateCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
