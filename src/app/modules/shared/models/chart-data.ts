export interface ChartData {
  name: string;
  unit: string;
  period: string;
  description: string;
  values: DataPoint[];
}

export interface DataPoint {
  x: Date;
  y: number;
}
