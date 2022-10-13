import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProvidersComponent } from './add-providers.component';

describe('AddProvidersComponent', () => {
  let component: AddProvidersComponent;
  let fixture: ComponentFixture<AddProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProvidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
