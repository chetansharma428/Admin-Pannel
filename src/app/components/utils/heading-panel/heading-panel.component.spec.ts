import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingPanelComponent } from './heading-panel.component';

describe('HeadingPanelComponent', () => {
  let component: HeadingPanelComponent;
  let fixture: ComponentFixture<HeadingPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadingPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
