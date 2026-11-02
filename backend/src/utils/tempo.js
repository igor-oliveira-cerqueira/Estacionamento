// Funções de data e hora. Horários trafegam como "HH:MM" e no banco como DATETIME.

const pad = (n) => String(n).padStart(2, '0');

/** Data de hoje no formato YYYY-MM-DD. */
function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Hora atual no formato HH:MM. */
function horaAgora() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "08:00" -> 480 (minutos desde 00:00). Retorna null se for inválido. */
function horarioParaMinutos(hhmm) {
  if (typeof hhmm !== 'string') return null;
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hhmm.trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

// ---- conversões com DATETIME "YYYY-MM-DD HH:MM:SS" ----
const dataDoDatetime = (dt) => dt.slice(0, 10);
const horaDoDatetime = (dt) => dt.slice(11, 16);
const minutosDoDatetime = (dt) => horarioParaMinutos(horaDoDatetime(dt));
const montarDatetime = (dataISO, hhmm) => `${dataISO} ${hhmm}:00`;

module.exports = {
  hojeISO,
  horaAgora,
  horarioParaMinutos,
  dataDoDatetime,
  horaDoDatetime,
  minutosDoDatetime,
  montarDatetime,
};
