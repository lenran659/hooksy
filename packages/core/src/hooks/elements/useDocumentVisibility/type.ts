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
 * Options for useDocumentVisibility hook
 */
export interface UseDocumentVisibilityOptions
    extends ConfigurableWindow,
        ConfigurableDocument {
    /**
     * Whether to get the initial visibility state immediately
     * @default true
     */
    immediate?: boolean;
}

/**
 * Reactive `document.visibilityState`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState
 * @param options 配置选项
 */
export declare function useDocumentVisibility(
    options?: UseDocumentVisibilityOptions
): React.MutableRefObject<DocumentVisibilityState | undefined>;
