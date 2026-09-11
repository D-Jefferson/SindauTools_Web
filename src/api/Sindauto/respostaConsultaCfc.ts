export class ConsultaCfcInvalida extends Error {}

export async function lerConsultaCfc(resposta: Response) {
  // Read failures remain fatal; only an empty/malformed body is skippable.
  const texto = await resposta.text();
  if (!texto.trim()) {
    throw new ConsultaCfcInvalida("Consulta DETRAN vazia. Nenhum PUT foi enviado para este CFC.");
  }
  try {
    return JSON.parse(texto);
  } catch {
    throw new ConsultaCfcInvalida("Consulta DETRAN com JSON inválido ou incompleto. Nenhum PUT foi enviado para este CFC.");
  }
}
