/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

export interface Config {
  splash: { Splash };
  views: { [key: string]: View };
}

export interface Splash {
  name: string;
}

export interface View {
  name: string;
  enabled: boolean;
  default: number;
  background: string;
  theme: string;
  alerts: Alert[];
  dynamic: Dynamic;
  gauges: Gauge[];
  dynamicMinMax: boolean;
}

export interface Alert {
  message: string;
  pid: byte;
  op: string;
  priority: number;
  value: number;
  unit: string;
}

export interface Dynamic {
  enabled: boolean;
  pid: byte;
  op: string;
  priority: number;
  value: number;
  unit: string;
}

export interface Gauge {
  theme: string;
  unit: string;
  pid: byte;
}
