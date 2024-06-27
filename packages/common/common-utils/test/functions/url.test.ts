import { urlToJson, parseURLSearchParams, stringifyURLSearchParams } from '../../src/functions/url';

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

  test('parseURLSearchParams success', () => {
    const url = 'https://www.example.com?q=hello';

    expect(parseURLSearchParams(url)[1]).toEqual({ q: 'hello' });
  });

  test('parseURLSearchParams path success', () => {
    const url = 'https://www.example.com?q=hello';

    expect(parseURLSearchParams(url)[0]).toEqual('https://www.example.com');
  });

  test('parseURLSearchParams fail', () => {
    const url = 'https://www.example.com?hello';

    expect(parseURLSearchParams(url)[1]).toEqual({ hello: '' });
  });

  test('parseURLSearchParams success only query', () => {
    const url = 'q=hello';

    expect(parseURLSearchParams(url)[1]).toEqual({});
  });

  test('stringifyURLSearchParams success', () => {
    expect(stringifyURLSearchParams('https://www.example.com', { q: 'hello' })).toEqual(
      'https://www.example.com?q=hello',
    );
  });
});
