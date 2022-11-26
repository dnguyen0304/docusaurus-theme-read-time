// TODO(dnguyen0304): Fix using module declarations as exports.

// Contiguous region of content.
export type Target = {
    // TODO(dnguyen0304): Add repository information.
    // Page containing the target.
    readonly document: Document;

    // Root to reference for relative selector paths. 
    readonly root: string;

    // Serialized queries for locating a target on a page.
    readonly selectors: Selector[];
}

export type Document = {
    readonly href: string;
}

// Locates a region of content using XPaths and character offsets.
export type RangeSelector = {
    readonly type: 'RangeSelector';
    readonly startContainer: string;
    readonly startOffset: number;
    readonly endContainer: string;
    readonly endOffset: number;
};

// Serialized queries for locating a target on a page.
export type Selector = RangeSelector;

export type BandFriendlyKey =
    | 'B2-top'
    | 'B1-top'
    | 'B0'
    | 'B1-bottom'
    | 'B2-bottom';

export type Band = {
    // Unique identifier that is human-readable.
    readonly friendlyKey: BandFriendlyKey;

    // Top position as a percent of the viewport height. This range endpoint is
    // inclusive: [top, bottom).
    readonly topVh: number;

    // Bottom position as a percent of the viewport height. This range endpoint
    // is exclusive: [top, bottom).
    readonly bottomVh: number;

    // Currently unused.
    readonly multiplier: number;
};

export type StartIntersectionSample = {
    // Measurement time as a Unix epoch timestamp, in milliseconds.
    readonly timestampMilli: number;

    // Contiguous region of content.
    readonly target: Target;

    // Horizontal region ("slice") of the viewport.
    readonly band: Band;

    // Whether the target is intersecting, at any threshold, with the band.
    readonly isIntersecting: boolean;

    // Smallest rectangle that contains the target.
    readonly targetRect: DOMRect;

    // Details about the device being used to view the target.
    readonly deviceInfo: DeviceInfo;
};

export type StopIntersectionSample = Pick<
    StartIntersectionSample,
    | 'timestampMilli'
    | 'target'
    | 'band'
    | 'isIntersecting'
>;

export type IntersectionSample =
    StartIntersectionSample | StopIntersectionSample;

export type DeviceInfo = {
    // Viewport height, in pixels.
    readonly viewportHeightPx: number;
};