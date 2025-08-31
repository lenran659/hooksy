import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDocumentVisibility } from "./index";

// 模拟 DOM 环境
const mockDocument = {
    visibilityState: "visible" as DocumentVisibilityState,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
} as any;

const mockWindow = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
} as any;

beforeEach(() => {
    // 重置模拟
    vi.clearAllMocks();

    // 模拟全局对象
    global.document = mockDocument;
    global.window = mockWindow;

    // 重置 visibilityState
    mockDocument.visibilityState = "visible";
});

afterEach(() => {
    // 恢复全局对象
    (global as any).document = undefined;
    (global as any).window = undefined;
});

describe("useDocumentVisibility", () => {
    it("应该返回一个初始值为 undefined 的 ref", () => {
        const { result } = renderHook(() =>
            useDocumentVisibility({ immediate: false })
        );

        expect(result.current).toBeDefined();
        expect(result.current.current).toBeUndefined();
    });

    it("应该立即获取初始可见性状态", () => {
        const { result } = renderHook(() =>
            useDocumentVisibility({ immediate: true })
        );

        expect(result.current.current).toBe("visible");
    });

    it("应该跟踪可见性状态变化", () => {
        const { result } = renderHook(() => useDocumentVisibility());

        // 模拟可见性变化
        act(() => {
            mockDocument.visibilityState = "hidden";
        });

        // 触发可见性变化事件
        const visibilityChangeHandler =
            mockDocument.addEventListener.mock.calls.find(
                (call: any[]) => call[0] === "visibilitychange"
            )?.[1];

        if (visibilityChangeHandler) {
            act(() => {
                visibilityChangeHandler();
            });
        }

        expect(result.current.current).toBe("hidden");
    });

    it("应该处理自定义 document 选项", () => {
        const customDoc = {
            visibilityState: "prerender" as DocumentVisibilityState,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        } as any;

        const { result } = renderHook(() =>
            useDocumentVisibility({ document: customDoc })
        );

        expect(customDoc.addEventListener).toHaveBeenCalledWith(
            "visibilitychange",
            expect.any(Function)
        );
        expect(result.current.current).toBe("prerender");
    });

    it("应该处理自定义 window 选项", () => {
        const customWin = {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        } as any;

        renderHook(() => useDocumentVisibility({ window: customWin }));

        expect(customWin.addEventListener).toHaveBeenCalledWith(
            "pagehide",
            expect.any(Function)
        );
        expect(customWin.addEventListener).toHaveBeenCalledWith(
            "pageshow",
            expect.any(Function)
        );
    });

    it("应该处理 immediate 选项为 false", () => {
        const { result } = renderHook(() =>
            useDocumentVisibility({ immediate: false })
        );

        expect(result.current.current).toBeUndefined();
    });

    it("应该处理所有可见性状态", () => {
        const { result } = renderHook(() => useDocumentVisibility());

        // 测试 visible 状态
        act(() => {
            mockDocument.visibilityState = "visible";
        });

        const visibilityChangeHandler =
            mockDocument.addEventListener.mock.calls.find(
                (call: any[]) => call[0] === "visibilitychange"
            )?.[1];

        if (visibilityChangeHandler) {
            act(() => {
                visibilityChangeHandler();
            });
        }

        expect(result.current.current).toBe("visible");

        // 测试 hidden 状态
        act(() => {
            mockDocument.visibilityState = "hidden";
        });

        if (visibilityChangeHandler) {
            act(() => {
                visibilityChangeHandler();
            });
        }

        expect(result.current.current).toBe("hidden");

        // 测试 prerender 状态
        act(() => {
            mockDocument.visibilityState = "prerender";
        });

        if (visibilityChangeHandler) {
            act(() => {
                visibilityChangeHandler();
            });
        }

        expect(result.current.current).toBe("prerender");
    });

    it("应该处理 undefined 的 window 和 document", () => {
        const { result } = renderHook(() =>
            useDocumentVisibility({ window: undefined, document: undefined })
        );

        expect(result.current.current).toBeUndefined();
    });

    it("应该在组件卸载时清理事件监听器", () => {
        const { unmount } = renderHook(() => useDocumentVisibility());

        unmount();

        expect(mockDocument.removeEventListener).toHaveBeenCalled();
        expect(mockWindow.removeEventListener).toHaveBeenCalled();
    });

    it("应该处理 pagehide 和 pageshow 事件", () => {
        const { result } = renderHook(() => useDocumentVisibility());

        // 模拟页面隐藏
        const pageHideHandler = mockWindow.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "pagehide"
        )?.[1];

        if (pageHideHandler) {
            act(() => {
                pageHideHandler();
            });
        }

        // 模拟页面显示
        const pageShowHandler = mockWindow.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "pageshow"
        )?.[1];

        if (pageShowHandler) {
            act(() => {
                pageShowHandler();
            });
        }

        expect(result.current.current).toBeDefined();
    });

    it("应该处理 immediate 选项变化", () => {
        const { result, rerender } = renderHook(
            ({ immediate }) => useDocumentVisibility({ immediate }),
            { initialProps: { immediate: false } }
        );

        // 初始状态应该是 undefined
        expect(result.current.current).toBeUndefined();

        // 改为 immediate: true
        rerender({ immediate: true });

        // 现在应该获取当前状态
        expect(result.current.current).toBe("visible");
    });

    it("应该正确处理多个事件监听器", () => {
        renderHook(() => useDocumentVisibility());

        // 检查是否添加了所有必要的事件监听器
        expect(mockDocument.addEventListener).toHaveBeenCalledWith(
            "visibilitychange",
            expect.any(Function)
        );
        expect(mockWindow.addEventListener).toHaveBeenCalledWith(
            "pagehide",
            expect.any(Function)
        );
        expect(mockWindow.addEventListener).toHaveBeenCalledWith(
            "pageshow",
            expect.any(Function)
        );
    });
});
