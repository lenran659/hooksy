import { Ref } from "react";

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
 * Configuration for document or shadow root
 */
export interface ConfigurableDocumentOrShadowRoot {
    /**
     * Custom document or shadow root
     * @default document
     */
    document?: Document | undefined;
}

/**
 * Options for useActiveElement hook
 */
export interface UseActiveElementOptions
    extends ConfigurableWindow,
        ConfigurableDocumentOrShadowRoot {
    /**
     * Search active element deeply inside shadow dom
     *
     * @default true
     */
    deep?: boolean;
    /**
     * Track active element when it's removed from the DOM
     * Using a MutationObserver under the hood
     * @default false
     */
    triggerOnRemoval?: boolean;
}

/**
 * Reactive `document.activeElement`
 *
 * @see https://vueuse.org.cn/useActiveElement
 * @param options
 */
export declare function useActiveElement<T extends HTMLElement>(
    options?: UseActiveElementOptions
): Ref<T | null | undefined>;
