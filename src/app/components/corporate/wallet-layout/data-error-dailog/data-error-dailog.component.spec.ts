import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataErrorDailogComponent } from './data-error-dailog.component';

describe('DataErrorDailogComponent', () => {
  let component: DataErrorDailogComponent;
  let fixture: ComponentFixture<DataErrorDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataErrorDailogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataErrorDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
