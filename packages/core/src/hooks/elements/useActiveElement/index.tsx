import { useRef, useEffect, useState, useCallback } from "react";
import type { UseActiveElementOptions } from "./type";

/**
 * Get the active element, optionally searching deep into shadow DOM
 */
function getActiveElement(
    document: Document,
    deep: boolean = true
): Element | null {
    let activeElement = document.activeElement;

    if (!deep || !activeElement) {
        return activeElement;
    }

    // Search deep into shadow DOM
    while (activeElement && activeElement.shadowRoot) {
        activeElement = activeElement.shadowRoot.activeElement;
    }

    return activeElement;
}

/**
 * Reactive `document.activeElement`
 *
 * @see https://vueuse.org.cn/useActiveElement
 * @param options
 */
export function useActiveElement<T extends HTMLElement>(
    options: UseActiveElementOptions = {}
): React.MutableRefObject<T | null | undefined> {
    const {
        window: customWindow = typeof window !== "undefined"
            ? window
            : undefined,
        document: customDocument = typeof document !== "undefined"
            ? document
            : undefined,
        deep = true,
        triggerOnRemoval = false,
    } = options;

    const [activeElement, setActiveElement] = useState<T | null | undefined>(
        undefined
    );
    const activeElementRef = useRef<T | null | undefined>(undefined);

    // Update the ref when activeElement changes
    useEffect(() => {
        activeElementRef.current = activeElement;
    }, [activeElement]);

    // Function to get current active element
    const getCurrentActiveElement = useCallback((): T | null | undefined => {
        if (!customDocument) return undefined;

        const element = getActiveElement(customDocument, deep);
        return element as T | null;
    }, [customDocument, deep]);

    // Function to update active element
    const updateActiveElement = useCallback(() => {
        const element = getCurrentActiveElement();
        setActiveElement(element);
    }, [getCurrentActiveElement]);

    // Set initial active element
    useEffect(() => {
        if (customDocument) {
            updateActiveElement();
        }
    }, [customDocument, updateActiveElement]);

    // Listen for focus/blur events
    useEffect(() => {
        if (!customDocument || !customWindow) return;

        const handleFocusChange = () => {
            updateActiveElement();
        };

        // Listen for focus and blur events on the document
        customDocument.addEventListener("focusin", handleFocusChange);
        customDocument.addEventListener("focusout", handleFocusChange);

        // Also listen for focus/blur on window for better coverage
        customWindow.addEventListener("focus", handleFocusChange);
        customWindow.addEventListener("blur", handleFocusChange);

        return () => {
            customDocument.removeEventListener("focusin", handleFocusChange);
            customDocument.removeEventListener("focusout", handleFocusChange);
            customWindow.removeEventListener("focus", handleFocusChange);
            customWindow.removeEventListener("blur", handleFocusChange);
        };
    }, [customDocument, customWindow, updateActiveElement]);

    // Optional: Track element removal using MutationObserver
    useEffect(() => {
        if (!triggerOnRemoval || !customDocument) return;

        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;

            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    // Check if the removed nodes contain the current active element
                    for (const node of mutation.removedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node as Element;
                            if (
                                element === activeElement ||
                                element.contains(activeElement as Element)
                            ) {
                                shouldUpdate = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (shouldUpdate) {
                updateActiveElement();
            }
        });

        observer.observe(customDocument.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
        };
    }, [triggerOnRemoval, customDocument, activeElement, updateActiveElement]);

    return activeElementRef;
}

// Export types
export type {
    UseActiveElementOptions,
    ConfigurableWindow,
    ConfigurableDocumentOrShadowRoot,
} from "./type";
