import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassthroughSectionComponent } from './passthrough-section.component';

describe('PassthroughSectionComponent', () => {
  let component: PassthroughSectionComponent;
  let fixture: ComponentFixture<PassthroughSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassthroughSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassthroughSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
