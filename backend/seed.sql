-- Dados de exemplo (opcional). Reproduz o exemplo do enunciado.
USE estacionamento;

-- Duas permanências já encerradas: R$ 15,00 (2h20 -> 3 horas) e R$ 10,00 (1h10 -> 2 horas).
-- Receita acumulada: R$ 25,00.
INSERT INTO registros (placa, entrada, saida, horas_cobradas, valor) VALUES
  ('ABC1234', TIMESTAMP(CURDATE(), '08:00:00'), TIMESTAMP(CURDATE(), '10:20:00'), 3, 15.00),
  ('XYZ9876', TIMESTAMP(CURDATE(), '09:00:00'), TIMESTAMP(CURDATE(), '10:10:00'), 2, 10.00);

-- Um veículo ainda estacionado (sem saída).
INSERT INTO registros (placa, entrada) VALUES
  ('DEF5678', TIMESTAMP(CURDATE(), '09:30:00'));
