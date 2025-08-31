import { useRef, useEffect, useState, useCallback } from "react";
import type { UseDraggableOptions } from "./type.js";

/**
 * Get the current mouse/touch position
 */
function getCurrentPosition(event: MouseEvent | TouchEvent): {
    x: number;
    y: number;
} {
    if ("touches" in event) {
        const touch = event.touches[0];
        return { x: touch.clientX, y: touch.clientY };
    } else {
        return { x: event.clientX, y: event.clientY };
    }
}

/**
 * Reactive draggable functionality for DOM elements
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
 * @param options 配置选项
 */
export function useDraggable(
    options: UseDraggableOptions = {}
): React.MutableRefObject<{
    isDragging: boolean;
    position: { x: number; y: number };
    delta: { x: number; y: number };
    startPosition: { x: number; y: number } | null;
    ref: (element: HTMLElement | null) => void;
    resetPosition: () => void;
    setPosition: (x: number, y: number) => void;
}> {
    const {
        window: customWindow = typeof window !== "undefined"
            ? window
            : undefined,
        document: customDocument = typeof document !== "undefined"
            ? document
            : undefined,
        axis = "both",
        bounds = null,
        disabled = false,
        onStart,
        onMove,
        onEnd,
    } = options;

    const [draggableState, setDraggableState] = useState({
        isDragging: false,
        position: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
        startPosition: null as { x: number; y: number } | null,
    });

    const elementRef = useRef<HTMLElement | null>(null);
    const startPosRef = useRef<{ x: number; y: number } | null>(null);

    // Function to constrain position within bounds
    const constrainPosition = useCallback(
        (pos: { x: number; y: number }) => {
            if (!bounds) return pos;

            return {
                x: Math.max(bounds.left, Math.min(bounds.right, pos.x)),
                y: Math.max(bounds.top, Math.min(bounds.bottom, pos.y)),
            };
        },
        [bounds]
    );

    // Function to apply axis constraints
    const applyAxisConstraints = useCallback(
        (pos: { x: number; y: number }) => {
            if (axis === "x") {
                return { x: pos.x, y: draggableState.position.y };
            } else if (axis === "y") {
                return { x: draggableState.position.x, y: pos.y };
            }
            return pos;
        },
        [axis, draggableState.position]
    );

    // Function to handle drag start
    const handleDragStart = useCallback(
        (event: MouseEvent | TouchEvent) => {
            if (disabled) return;

            event.preventDefault();

            const currentPos = getCurrentPosition(event);
            const rect = elementRef.current?.getBoundingClientRect();

            if (rect) {
                startPosRef.current = {
                    x: currentPos.x - rect.left,
                    y: currentPos.y - rect.top,
                };

                const newState = {
                    isDragging: true,
                    position: draggableState.position,
                    delta: { x: 0, y: 0 },
                    startPosition: startPosRef.current,
                };

                setDraggableState(newState);
                onStart?.(newState, event);
            }
        },
        [disabled, draggableState.position, onStart]
    );

    // Function to handle drag move
    const handleDragMove = useCallback(
        (event: MouseEvent | TouchEvent) => {
            if (!draggableState.isDragging || disabled || !startPosRef.current)
                return;

            event.preventDefault();

            const currentPos = getCurrentPosition(event);
            const newPosition = {
                x: currentPos.x - startPosRef.current.x,
                y: currentPos.y - startPosRef.current.y,
            };

            // Apply axis constraints
            const constrainedPos = applyAxisConstraints(newPosition);

            // Apply bounds constraints
            const finalPos = constrainPosition(constrainedPos);

            const delta = {
                x: finalPos.x - draggableState.position.x,
                y: finalPos.y - draggableState.position.y,
            };

            const newState = {
                isDragging: true,
                position: finalPos,
                delta,
                startPosition: startPosRef.current,
            };

            setDraggableState(newState);
            onMove?.(newState, event);
        },
        [
            draggableState.isDragging,
            draggableState.position,
            disabled,
            applyAxisConstraints,
            constrainPosition,
            onMove,
        ]
    );

    // Function to handle drag end
    const handleDragEnd = useCallback(
        (event: MouseEvent | TouchEvent) => {
            if (!draggableState.isDragging) return;

            const newState = {
                ...draggableState,
                isDragging: false,
            };

            setDraggableState(newState);
            startPosRef.current = null;
            onEnd?.(newState, event);
        },
        [draggableState, onEnd]
    );

    // Set up event listeners
    useEffect(() => {
        if (!customDocument || !customWindow || disabled) return;

        const handleMouseDown = (event: MouseEvent) => {
            if (event.target === elementRef.current) {
                handleDragStart(event);
            }
        };

        const handleMouseMove = (event: MouseEvent) => {
            handleDragMove(event);
        };

        const handleMouseUp = (event: MouseEvent) => {
            handleDragEnd(event);
        };

        const handleTouchStart = (event: TouchEvent) => {
            if (event.target === elementRef.current) {
                handleDragStart(event);
            }
        };

        const handleTouchMove = (event: TouchEvent) => {
            handleDragMove(event);
        };

        const handleTouchEnd = (event: TouchEvent) => {
            handleDragEnd(event);
        };

        // Add event listeners
        customDocument.addEventListener("mousedown", handleMouseDown);
        customDocument.addEventListener("mousemove", handleMouseMove);
        customDocument.addEventListener("mouseup", handleMouseUp);
        customDocument.addEventListener("touchstart", handleTouchStart, {
            passive: false,
        });
        customDocument.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });
        customDocument.addEventListener("touchend", handleTouchEnd);

        return () => {
            customDocument.removeEventListener("mousedown", handleMouseDown);
            customDocument.removeEventListener("mousemove", handleMouseMove);
            customDocument.removeEventListener("mouseup", handleMouseUp);
            customDocument.removeEventListener("touchstart", handleTouchStart);
            customDocument.removeEventListener("touchmove", handleTouchMove);
            customDocument.removeEventListener("touchend", handleTouchEnd);
        };
    }, [
        customDocument,
        customWindow,
        disabled,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
    ]);

    // Function to set element reference
    const setElementRef = useCallback((element: HTMLElement | null) => {
        elementRef.current = element;
    }, []);

    // Function to reset position
    const resetPosition = useCallback(() => {
        setDraggableState((prev) => ({
            ...prev,
            position: { x: 0, y: 0 },
            delta: { x: 0, y: 0 },
        }));
    }, []);

    // Function to set position
    const setPosition = useCallback(
        (x: number, y: number) => {
            const newPos = constrainPosition({ x, y });
            setDraggableState((prev) => ({
                ...prev,
                position: newPos,
            }));
        },
        [constrainPosition]
    );

    // Create the result ref with all methods and state
    const resultRef = useRef({
        ...draggableState,
        ref: setElementRef,
        resetPosition,
        setPosition,
    });

    // Update result ref when state changes
    useEffect(() => {
        resultRef.current = {
            ...draggableState,
            ref: setElementRef,
            resetPosition,
            setPosition,
        };
    }, [draggableState, setElementRef, resetPosition, setPosition]);

    return resultRef;
}

// Export types
export type {
    UseDraggableOptions,
    ConfigurableWindow,
    ConfigurableDocument,
    DraggableBounds,
    DraggableAxis,
    DraggableState,
    DraggableCallbacks,
} from "./type.js";
