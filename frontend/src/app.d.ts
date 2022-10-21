/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

export interface Config {
  views: { [key: string]: View };
}

export interface View {
  name: string;
  enabled: boolean;
  default: number;
  background: string;
  theme: string;
  alerts: any[];
  dynamic: Dynamic;
  gauges: Gauge[];
  dynamicMinMax: boolean;
}

export interface Dynamic {
  enabled: boolean;
  pid: string;
  op: string;
  priority: number;
  value: string;
  unit: string;
}

export interface Gauge {
  theme: string;
  unit: string;
  pid: string;
}
