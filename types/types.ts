export interface AspenData {
  date?: Date;
  time?: string;
  meter_1: number;
  meter_2: number;
  condensate: number;
  meter_blue: number;
  meter_red: number;
  steam_flow_meter: number;
  aspen: number;
}

export interface freseniusData {
  date?: Date;
  time?: string;
  meter_fk: number;
  meter_sh: number;
  hfo: number;
  make_up: number;
  steam_flow_meter_1: number;
  steam_flow_meter_2: number;
}

export interface MeterRule {
  maxDelta: number;
  allowSpikeAfter?: number;
}
