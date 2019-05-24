import { TestBed } from '@angular/core/testing';

import { RegistroUsuarioService } from './registro-usuario.service';

describe('RegistroUsuarioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistroUsuarioService = TestBed.get(RegistroUsuarioService);
    expect(service).toBeTruthy();
  });
});
