export interface AspenData {
  date: Date;
  meter_1: number;
  meter_2: number;
  condensate: number;
  meter_blue: number;
  meter_red: number;
  steam_flow_meter: number;
  aspen: number;
}

export interface MeterRule {
  maxDelta: number;
  allowSpikeAfter?: number;
}
