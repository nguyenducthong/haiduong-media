import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../lib/site-url.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const saved = [process.env.NEXT_PUBLIC_SITE_URL, process.env.SITE_URL];
try {
  for (const [publicUrl, serverUrl, expected] of [
    [undefined, undefined, 'https://thuonghieuhangdauvn.com'],
    [undefined, 'https://server.example', 'https://server.example'],
    ['https://new.example/', 'https://old.example', 'https://new.example'],
  ]) {
    for (const [key, value] of [['NEXT_PUBLIC_SITE_URL', publicUrl], ['SITE_URL', serverUrl]]) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    const module = await import(`data:text/javascript;base64,${Buffer.from(code + `\n// ${expected}`).toString('base64')}`);
    assert.equal(module.siteUrl.origin, expected);
    assert.equal(module.absoluteSiteUrl('/tin-tuc'), `${expected}/tin-tuc`);
    assert.equal(module.absoluteSiteUrl('/#organization'), `${expected}/#organization`);
    for (const value of ['ftp://example.com', 'https://example.com/path', 'https://user:pass@example.com', 'https://example.com?x=1', 'https://example.com/#a']) {
      assert.throws(() => module.resolveSiteUrl(value));
    }
  }
  console.log('PASS: default origin, env precedence, domain change, canonical paths, schema IDs and invalid configuration.');
} finally {
  for (const [index, key] of ['NEXT_PUBLIC_SITE_URL', 'SITE_URL'].entries()) {
    if (saved[index] === undefined) delete process.env[key];
    else process.env[key] = saved[index];
  }
}
