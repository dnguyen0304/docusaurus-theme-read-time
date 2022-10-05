export type Band = {
    // Unique identifier that is human-readable.
    readonly friendlyKey: string;

    // Top position as a percent of the viewport height. This range endpoint is
    // inclusive: [top, bottom).
    readonly topVh: number;

    // Bottom position as a percent of the viewport height. This range endpoint
    // is exclusive: [top, bottom).
    readonly bottomVh: number;

    // Currently unused.
    readonly multiplier: number;
};