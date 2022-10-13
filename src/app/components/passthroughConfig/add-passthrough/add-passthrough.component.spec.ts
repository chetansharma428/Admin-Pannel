import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPassthroughComponent } from './add-passthrough.component';

describe('AddPassthroughComponent', () => {
  let component: AddPassthroughComponent;
  let fixture: ComponentFixture<AddPassthroughComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPassthroughComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPassthroughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
