/**
 * Configuration for window object
 */
export interface ConfigurableWindow {
    /**
     * Custom window object
     * @default window
     */
    window?: Window | undefined;
}

/**
 * Configuration for document object
 */
export interface ConfigurableDocument {
    /**
     * Custom document object
     * @default document
     */
    document?: Document | undefined;
}

/**
 * Draggable bounds constraint
 */
export interface DraggableBounds {
    /**
     * Left boundary
     */
    left: number;
    /**
     * Top boundary
     */
    top: number;
    /**
     * Right boundary
     */
    right: number;
    /**
     * Bottom boundary
     */
    bottom: number;
}

/**
 * Draggable axis constraint
 */
export type DraggableAxis = "both" | "x" | "y";

/**
 * Draggable state
 */
export interface DraggableState {
    /**
     * Whether the element is currently being dragged
     */
    isDragging: boolean;
    /**
     * Current position of the element
     */
    position: { x: number; y: number };
    /**
     * Delta movement since last update
     */
    delta: { x: number; y: number };
    /**
     * Starting position when drag began
     */
    startPosition: { x: number; y: number } | null;
}

/**
 * Draggable callback functions
 */
export interface DraggableCallbacks {
    /**
     * Called when drag starts
     */
    onStart?: (state: DraggableState, event: MouseEvent | TouchEvent) => void;
    /**
     * Called when dragging
     */
    onMove?: (state: DraggableState, event: MouseEvent | TouchEvent) => void;
    /**
     * Called when drag ends
     */
    onEnd?: (state: DraggableState, event: MouseEvent | TouchEvent) => void;
}

/**
 * Options for useDraggable hook
 */
export interface UseDraggableOptions
    extends ConfigurableWindow,
        ConfigurableDocument,
        DraggableCallbacks {
    /**
     * Axis constraint for dragging
     * @default "both"
     */
    axis?: DraggableAxis;
    /**
     * Bounds constraint for dragging
     * @default null
     */
    bounds?: DraggableBounds | null;
    /**
     * Whether dragging is disabled
     * @default false
     */
    disabled?: boolean;
}

/**
 * Reactive draggable functionality for DOM elements
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
 * @param options 配置选项
 */
export declare function useDraggable(
    options?: UseDraggableOptions
): React.MutableRefObject<
    DraggableState & {
        ref: (element: HTMLElement | null) => void;
        resetPosition: () => void;
        setPosition: (x: number, y: number) => void;
    }
>;
