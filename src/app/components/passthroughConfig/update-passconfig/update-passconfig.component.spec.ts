import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePassconfigComponent } from './update-passconfig.component';

describe('UpdatePassconfigComponent', () => {
  let component: UpdatePassconfigComponent;
  let fixture: ComponentFixture<UpdatePassconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePassconfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePassconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
