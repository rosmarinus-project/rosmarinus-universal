import { urlToJson } from '../../src/functions/url';

describe('url', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('url to json success', () => {
    const url = 'https://www.example.com?q=hello';

    expect(urlToJson(url)).toEqual({ q: 'hello' });
  });

  test('url to json success only query', () => {
    const url = 'q=hello';

    expect(urlToJson(url)).toEqual({ q: 'hello' });
  });

  test('url to json fail', () => {
    const url = 'https://www.example.com?hello';

    expect(urlToJson(url)).toEqual({});
  });
});
