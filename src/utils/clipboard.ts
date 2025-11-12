export async function copiarTexto(texto: string) {
  try {
    await navigator.clipboard.writeText(texto);
  } catch (err) {
    console.error("Erro ao copiar texto", err);
  }
}
