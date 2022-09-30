export type Band = {
    // Top position as a percent of the viewport height. This range endpoint is
    // inclusive: [top, bottom).
    topVh: number;

    // Bottom position as a percent of the viewport height. This range endpoint
    // is exclusive: [top, bottom).
    bottomVh: number;

    // Currently unused.
    multiplier: number;
};