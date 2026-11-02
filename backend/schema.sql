CREATE DATABASE IF NOT EXISTS estacionamento
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE estacionamento;

-- Cada linha é uma permanência (um veículo pode ter várias ao longo do tempo).
CREATE TABLE IF NOT EXISTS registros (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  placa          VARCHAR(7)   NOT NULL,                -- sem hífen, maiúscula (ex.: ABC1234)
  entrada        DATETIME     NOT NULL,
  saida          DATETIME     NULL,                    -- NULL = ainda estacionado
  horas_cobradas INT UNSIGNED NULL,
  valor          DECIMAL(10,2) NULL,                   -- preenchido apenas na saída
  -- Garante no banco que a mesma placa não esteja "estacionada" duas vezes:
  -- só vale quando saida IS NULL (NULLs não colidem no índice UNIQUE).
  placa_ativa    VARCHAR(7) GENERATED ALWAYS AS (IF(saida IS NULL, placa, NULL)) STORED,
  UNIQUE KEY uq_placa_ativa (placa_ativa),
  KEY idx_placa (placa),
  KEY idx_saida (saida),
  CONSTRAINT chk_saida CHECK (saida IS NULL OR saida >= entrada)
) ENGINE=InnoDB;
