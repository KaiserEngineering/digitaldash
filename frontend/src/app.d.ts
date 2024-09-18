/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />
declare global {
    type View = {
        id: number;
        enabled: boolean;
        background: string;
        gaugeValue: number;
        gauges: Gauge[];
        alerts: Alert[];
        dynamic: Dynamic
    };

    type Config = {
        views: Record<string, View>;
    };

    interface Alert {
        message: string;
        pid: byte;
        op: string;
        priority: number;
        value: number;
        unit: string;
    }

    interface Dynamic {
        enabled: boolean;
        pid: byte;
        op: string;
        priority: number;
        value: number;
        unit: string;
    }

    interface Gauge {
        theme: string;
        unit: string;
        pid: byte;
        value: string|number;
    }

}

export {};
