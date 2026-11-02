/** 15 -> "R$ 15,00" */
export function moeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** "ABC1234" -> "ABC-1234" */
export function formatarPlaca(placa) {
  return placa && placa.length === 7 ? `${placa.slice(0, 3)}-${placa.slice(3)}` : placa;
}

/** 140 -> "2h20" */
export function formatarDuracao(minutos) {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return `${horas}h${String(resto).padStart(2, '0')}`;
}
