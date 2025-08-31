import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useActiveElement } from "./index";

// 模拟 DOM 环境
const mockDocument = {
    activeElement: null as Element | null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
    },
} as any;

const mockWindow = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
} as any;

// 模拟带有可写 shadowRoot 的 Element
interface MockElement extends Element {
    shadowRoot: any;
}

// 模拟 MutationObserver
const mockMutationObserver = vi.fn();
const mockDisconnect = vi.fn();
const mockObserve = vi.fn();

beforeEach(() => {
    // 重置模拟
    vi.clearAllMocks();

    // 模拟全局对象
    global.document = mockDocument;
    global.window = mockWindow;

    // 模拟 MutationObserver
    global.MutationObserver = mockMutationObserver;
    mockMutationObserver.mockImplementation(() => ({
        observe: mockObserve,
        disconnect: mockDisconnect,
    }));

    // 重置 activeElement
    mockDocument.activeElement = null;
});

afterEach(() => {
    // 恢复全局对象
    (global as any).document = undefined;
    (global as any).window = undefined;
    (global as any).MutationObserver = undefined;
});

describe("useActiveElement", () => {
    it("应该返回一个初始值为 undefined 的 ref", () => {
        const { result } = renderHook(() => useActiveElement());

        expect(result.current).toBeDefined();
        expect(result.current.current).toBeUndefined();
    });

    it("应该跟踪活跃元素的变化", () => {
        const { result } = renderHook(() => useActiveElement());

        // 模拟焦点变化
        act(() => {
            mockDocument.activeElement = document.createElement("input");
        });

        // 触发焦点事件
        const focusHandler = mockDocument.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "focusin"
        )?.[1];

        if (focusHandler) {
            act(() => {
                focusHandler();
            });
        }

        expect(result.current.current).toBeDefined();
    });

    it("应该处理自定义 document 选项", () => {
        const customDoc = {
            activeElement: document.createElement("button"),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            body: { appendChild: vi.fn(), removeChild: vi.fn() },
        } as any;

        expect(customDoc.addEventListener).toHaveBeenCalledWith(
            "focusin",
            expect.any(Function)
        );
        expect(customDoc.addEventListener).toHaveBeenCalledWith(
            "focusout",
            expect.any(Function)
        );
    });

    it("应该处理自定义 window 选项", () => {
        const customWin = {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        } as any;

        renderHook(() => useActiveElement({ window: customWin }));

        expect(customWin.addEventListener).toHaveBeenCalledWith(
            "focus",
            expect.any(Function)
        );
        expect(customWin.addEventListener).toHaveBeenCalledWith(
            "blur",
            expect.any(Function)
        );
    });

    it("应该处理深度 Shadow DOM 搜索", () => {
        const { result } = renderHook(() => useActiveElement({ deep: true }));

        // 创建一个带有 shadow root 的模拟元素
        const mockElement = document.createElement("div") as MockElement;
        const mockShadowRoot = {
            activeElement: document.createElement("input"),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };
        mockElement.shadowRoot = mockShadowRoot;

        // 设置为活跃元素
        mockDocument.activeElement = mockElement;

        // 触发焦点事件
        const focusHandler = mockDocument.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "focusin"
        )?.[1];

        if (focusHandler) {
            act(() => {
                focusHandler();
            });
        }

        // 应该返回 shadow root 中的元素
        expect(result.current.current).toBe(mockShadowRoot.activeElement);
    });

    it("当 deep 为 false 时不应该深度搜索", () => {
        const { result } = renderHook(() => useActiveElement({ deep: false }));

        // 创建一个带有 shadow root 的模拟元素
        const mockElement = document.createElement("div") as MockElement;
        const mockShadowRoot = {
            activeElement: document.createElement("input"),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };
        mockElement.shadowRoot = mockShadowRoot;

        // 设置为活跃元素
        mockDocument.activeElement = mockElement;

        // 触发焦点事件
        const focusHandler = mockDocument.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "focusin"
        )?.[1];

        if (focusHandler) {
            act(() => {
                focusHandler();
            });
        }

        // 应该返回元素本身，而不是 shadow root 中的元素
        expect(result.current.current).toBe(mockElement);
    });

    it("应该处理 triggerOnRemoval 选项", () => {
        renderHook(() => useActiveElement({ triggerOnRemoval: true }));

        expect(mockMutationObserver).toHaveBeenCalled();
        expect(mockObserve).toHaveBeenCalledWith(mockDocument.body, {
            childList: true,
            subtree: true,
        });
    });

    it("当 triggerOnRemoval 为 false 时不应该创建 MutationObserver", () => {
        renderHook(() => useActiveElement({ triggerOnRemoval: false }));

        expect(mockMutationObserver).not.toHaveBeenCalled();
    });

    it("应该使用 MutationObserver 处理元素移除", () => {
        const { result } = renderHook(() =>
            useActiveElement({ triggerOnRemoval: true })
        );

        // 设置初始活跃元素
        const mockElement = document.createElement("input");
        mockDocument.activeElement = mockElement;

        // 触发焦点事件来设置活跃元素
        const focusHandler = mockDocument.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "focusin"
        )?.[1];

        if (focusHandler) {
            act(() => {
                focusHandler();
            });
        }

        expect(result.current.current).toBe(mockElement);

        // 模拟元素移除
        const observerCallback = mockMutationObserver.mock.calls[0][0];
        const mockMutation = {
            type: "childList",
            removedNodes: [mockElement],
        };

        act(() => {
            observerCallback([mockMutation]);
        });

        // 应该触发更新
        expect(result.current.current).toBeDefined();
    });

    it("应该处理多层 Shadow DOM", () => {
        const { result } = renderHook(() => useActiveElement({ deep: true }));

        // 创建嵌套的 shadow roots
        const level1 = document.createElement("div") as MockElement;
        const level2 = document.createElement("div") as MockElement;
        const level3 = document.createElement("div") as MockElement;

        level1.shadowRoot = {
            activeElement: level2,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        } as any;

        level2.shadowRoot = {
            activeElement: level3,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        } as any;

        level3.shadowRoot = {
            activeElement: document.createElement("input"),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        } as any;

        mockDocument.activeElement = level1;

        // 触发焦点事件
        const focusHandler = mockDocument.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "focusin"
        )?.[1];

        if (focusHandler) {
            act(() => {
                focusHandler();
            });
        }

        // 应该返回最深的活跃元素
        expect(result.current.current).toBe(level3.shadowRoot?.activeElement);
    });

    it("应该处理 null 的 activeElement", () => {
        const { result } = renderHook(() => useActiveElement());

        // 设置 activeElement 为 null
        mockDocument.activeElement = null;

        // 触发焦点事件
        const focusHandler = mockDocument.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "focusin"
        )?.[1];

        if (focusHandler) {
            act(() => {
                focusHandler();
            });
        }

        expect(result.current.current).toBeNull();
    });

    it("应该处理 undefined 的 window 和 document", () => {
        const { result } = renderHook(() =>
            useActiveElement({ window: undefined, document: undefined })
        );

        expect(result.current.current).toBeUndefined();
    });

    it("应该在组件卸载时清理事件监听器", () => {
        const { unmount } = renderHook(() => useActiveElement());

        unmount();

        expect(mockDocument.removeEventListener).toHaveBeenCalled();
        expect(mockWindow.removeEventListener).toHaveBeenCalled();
    });

    it("当 triggerOnRemoval 为 true 时应该在组件卸载时清理 MutationObserver", () => {
        const { unmount } = renderHook(() =>
            useActiveElement({ triggerOnRemoval: true })
        );

        unmount();

        expect(mockDisconnect).toHaveBeenCalled();
    });

    it("应该处理泛型类型约束", () => {
        const { result } = renderHook(() =>
            useActiveElement<HTMLInputElement>()
        );

        // 设置活跃元素为 input
        const inputElement = document.createElement("input");
        mockDocument.activeElement = inputElement;

        // 触发焦点事件
        const focusHandler = mockDocument.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "focusin"
        )?.[1];

        if (focusHandler) {
            act(() => {
                focusHandler();
            });
        }

        expect(result.current.current).toBe(inputElement);
        // TypeScript 应该知道这是 HTMLInputElement
        expect(result.current.current?.type).toBeDefined();
    });

    it("应该正确处理焦点和失焦事件", () => {
        const { result } = renderHook(() => useActiveElement());

        // 模拟焦点
        const inputElement = document.createElement("input");
        mockDocument.activeElement = inputElement;

        const focusInHandler = mockDocument.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "focusin"
        )?.[1];

        if (focusInHandler) {
            act(() => {
                focusInHandler();
            });
        }

        expect(result.current.current).toBe(inputElement);

        // 模拟失焦
        mockDocument.activeElement = null;

        const focusOutHandler = mockDocument.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "focusout"
        )?.[1];

        if (focusOutHandler) {
            act(() => {
                focusOutHandler();
            });
        }

        expect(result.current.current).toBeNull();
    });

    it("应该处理 window 焦点和失焦事件", () => {
        const { result } = renderHook(() => useActiveElement());

        // 模拟 window 焦点
        const windowFocusHandler = mockWindow.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "focus"
        )?.[1];

        if (windowFocusHandler) {
            act(() => {
                windowFocusHandler();
            });
        }

        // 模拟 window 失焦
        const windowBlurHandler = mockWindow.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "blur"
        )?.[1];

        if (windowBlurHandler) {
            act(() => {
                windowBlurHandler();
            });
        }

        expect(result.current.current).toBeDefined();
    });

    it("当 deep 选项改变时应该更新活跃元素", () => {
        const { result, rerender } = renderHook(
            ({ deep }) => useActiveElement({ deep }),
            { initialProps: { deep: false } }
        );

        // 设置带有 shadow root 的活跃元素
        const mockElement = document.createElement("div") as MockElement;
        const mockShadowRoot = {
            activeElement: document.createElement("input"),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };
        mockElement.shadowRoot = mockShadowRoot;
        mockDocument.activeElement = mockElement;

        // 触发焦点事件
        const focusHandler = mockDocument.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "focusin"
        )?.[1];

        if (focusHandler) {
            act(() => {
                focusHandler();
            });
        }

        // 当 deep: false 时，应该返回元素本身
        expect(result.current.current).toBe(mockElement);

        // 改为 deep: true
        rerender({ deep: true });

        // 现在应该返回 shadow root 中的元素
        expect(result.current.current).toBe(mockShadowRoot.activeElement);
    });

    it("应该使用 MutationObserver 处理嵌套元素移除", () => {
        const { result } = renderHook(() =>
            useActiveElement({ triggerOnRemoval: true })
        );

        // 设置初始活跃元素
        const mockElement = document.createElement("input");
        mockDocument.activeElement = mockElement;

        // 触发焦点事件来设置活跃元素
        const focusHandler = mockDocument.addEventListener.mock.calls.find(
            (call: any[]) => call[0] === "focusin"
        )?.[1];

        if (focusHandler) {
            act(() => {
                focusHandler();
            });
        }

        expect(result.current.current).toBe(mockElement);

        // 模拟移除包含活跃元素的父元素
        const parentElement = document.createElement("div");
        parentElement.appendChild(mockElement);

        const observerCallback = mockMutationObserver.mock.calls[0][0];
        const mockMutation = {
            type: "childList",
            removedNodes: [parentElement],
        };

        act(() => {
            observerCallback([mockMutation]);
        });

        // 应该触发更新
        expect(result.current.current).toBeDefined();
    });
});
