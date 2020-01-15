import { TestBed } from '@angular/core/testing';

import { MonitorkbService } from './monitorkb.service';

describe('MonitorkbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitorkbService = TestBed.get(MonitorkbService);
    expect(service).toBeTruthy();
  });
});
