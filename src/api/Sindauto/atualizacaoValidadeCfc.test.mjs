import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarAtualizacao } from './atualizacaoValidadeCfc.ts';

test('full PUT payload changes only expiry and preserves original record', () => {
  const cfc = {
    id: 42, cnpj: '12.345.678/0001-90', dataValidade: '2025-01-01',
    nome: 'Nome original', telefone: '99999999', cidade: 'Salvador',
    codCfcDetran: 123, codFilialDetran: 7, statusDetranDescricao: 'Original',
    statusDetranCodDetran: 2, unidadeDetranDescricao: 'Unidade',
    auditoria: { usuario: 8 }, complemento: null,
  };
  const original = structuredClone(cfc);
  const consulta = {
    cnpj: '12345678000190', dataValidade: '2027-12-31', nome: 'Outro nome',
    codigo: 999, endereco: { telefone: 'inválido', municipio: 'Outra cidade' },
  };
  const payload = montarAtualizacao(cfc, consulta);
  assert.deepEqual(JSON.parse(JSON.stringify(payload)), { ...original, dataValidade: '2027-12-31' });
  assert.deepEqual(cfc, original);
});

test('only CNPJ and expiry are required from DETRAN', () => {
  assert.deepEqual(montarAtualizacao({ id: 1, cnpj: '12345678000190' }, {
    cnpj: '12345678000190', dataValidade: '2027-12-31',
  }), { id: 1, cnpj: '12345678000190', dataValidade: '2027-12-31' });
});

test('invalid expiry or mismatched CNPJ prevents payload generation', () => {
  const cfc = { id: 1, cnpj: '12345678000190' };
  for (const dataValidade of ['', 'inválida', null, undefined, 123]) {
    assert.throws(() => montarAtualizacao(cfc, { cnpj: cfc.cnpj, dataValidade }), /vencimento inválido/);
  }
  assert.throws(() => montarAtualizacao(cfc, { cnpj: '99999999000199', dataValidade: '2027-12-31' }), /CNPJ/);
});
