import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import { uuid } from '../../src/functions/uuid';

describe('uuid', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('uuid', () => {
    const id = uuid();

    expect(id).toMatch(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/);
  });
});
