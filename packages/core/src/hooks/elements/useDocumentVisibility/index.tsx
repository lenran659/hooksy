import { useRef, useEffect, useState, useCallback } from "react";
import type { UseDocumentVisibilityOptions } from "./type";

/**
 * Get the current document visibility state
 */
function getDocumentVisibility(document: Document): DocumentVisibilityState {
    return document.visibilityState;
}

/**
 * Reactive `document.visibilityState`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState
 * @param options 配置选项
 */
export function useDocumentVisibility(
    options: UseDocumentVisibilityOptions = {}
): React.MutableRefObject<DocumentVisibilityState | undefined> {
    const {
        window: customWindow = typeof window !== "undefined"
            ? window
            : undefined,
        document: customDocument = typeof document !== "undefined"
            ? document
            : undefined,
        immediate = true,
    } = options;

    const [visibilityState, setVisibilityState] = useState<
        DocumentVisibilityState | undefined
    >(undefined);
    const visibilityRef = useRef<DocumentVisibilityState | undefined>(
        undefined
    );

    // Update the ref when visibilityState changes
    useEffect(() => {
        visibilityRef.current = visibilityState;
    }, [visibilityState]);

    // Function to get current visibility state
    const getCurrentVisibilityState = useCallback(():
        | DocumentVisibilityState
        | undefined => {
        if (!customDocument) return undefined;

        return getDocumentVisibility(customDocument);
    }, [customDocument]);

    // Function to update visibility state
    const updateVisibilityState = useCallback(() => {
        const state = getCurrentVisibilityState();
        setVisibilityState(state);
    }, [getCurrentVisibilityState]);

    // Set initial visibility state
    useEffect(() => {
        if (customDocument && immediate) {
            updateVisibilityState();
        }
    }, [customDocument, immediate, updateVisibilityState]);

    // Listen for visibility change events
    useEffect(() => {
        if (!customDocument || !customWindow) return;

        const handleVisibilityChange = () => {
            updateVisibilityState();
        };

        // Listen for visibilitychange event on document
        customDocument.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        // Also listen for pagehide and pageshow events for better coverage
        customWindow.addEventListener("pagehide", handleVisibilityChange);
        customWindow.addEventListener("pageshow", handleVisibilityChange);

        return () => {
            customDocument.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            customWindow.removeEventListener(
                "pagehide",
                handleVisibilityChange
            );
            customWindow.removeEventListener(
                "pageshow",
                handleVisibilityChange
            );
        };
    }, [customDocument, customWindow, updateVisibilityState]);

    return visibilityRef;
}

// Export types
export type {
    UseDocumentVisibilityOptions,
    ConfigurableWindow,
    ConfigurableDocument,
} from "./type";
