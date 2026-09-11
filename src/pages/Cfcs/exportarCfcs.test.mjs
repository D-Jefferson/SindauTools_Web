import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gerarCsv, gerarRelatorio, linhasCfcs } from './dadosExportacao.ts';

test('exports the supplied rows with readable CNPJ, expiry and accents', () => {
  const dados = [{ id: 1, nome: 'Vitória', cnpj: '01234567000189', dataValidade: '2027-12-31T00:00:00', idLocalFotoBiometria: 5 }];
  assert.equal(linhasCfcs(dados)[0][1], '01.234.567/0001-89');
  assert.equal(linhasCfcs(dados)[0][4], '31/12/2027');
  assert.ok(gerarCsv(dados).startsWith('\uFEFF'));
  assert.ok(gerarCsv(dados).includes('Vitória'));
  assert.equal((gerarRelatorio(dados).match(/<tbody><tr>/g) || []).length, 1);
});

test('CSV escapes quotes and neutralizes formulas; report escapes HTML', () => {
  const dados = [{ id: 1, nome: '=HYPERLINK("bad");\n<script>alert(1)</script>' }];
  assert.ok(gerarCsv(dados).includes('"\'=HYPERLINK(""bad"")'));
  const html = gerarRelatorio(dados);
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
});

