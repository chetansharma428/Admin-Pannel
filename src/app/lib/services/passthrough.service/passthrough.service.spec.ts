import { TestBed } from '@angular/core/testing';

import { PassthroughService } from './passthrough.service';

describe('PassthroughService', () => {
  let service: PassthroughService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassthroughService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
