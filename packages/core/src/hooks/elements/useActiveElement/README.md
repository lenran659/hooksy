# useActiveElement

响应式地获取当前活跃的 DOM 元素，支持深度搜索 Shadow DOM。

## 功能特性

- 🎯 **响应式跟踪**: 自动跟踪 `document.activeElement` 的变化
- 🌳 **Shadow DOM 支持**: 可选的深度搜索 Shadow DOM 中的活跃元素
- 🔄 **元素移除检测**: 使用 MutationObserver 检测元素被移除的情况
- 🎛️ **高度可配置**: 支持自定义 window 和 document 对象
- 📱 **类型安全**: 完整的 TypeScript 支持

## 基本用法

```tsx
import { useActiveElement } from '@hooksy/core';

function MyComponent() {
  const activeElement = useActiveElement();
  
  return (
    <div>
      <p>当前活跃元素: {activeElement.current?.tagName || '无'}</p>
      <input placeholder="点击我" />
      <button>按钮</button>
    </div>
  );
}
```

## API 参考

### 类型定义

```tsx
function useActiveElement<T extends HTMLElement>(
  options?: UseActiveElementOptions
): React.MutableRefObject<T | null | undefined>
```

### 参数

#### `options` (可选)

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `window` | `Window \| undefined` | `window` | 自定义 window 对象 |
| `document` | `Document \| undefined` | `document` | 自定义 document 对象 |
| `deep` | `boolean` | `true` | 是否深度搜索 Shadow DOM |
| `triggerOnRemoval` | `boolean` | `false` | 是否在元素被移除时触发更新 |

### 返回值

返回一个 React ref 对象，其 `current` 属性包含当前活跃的 DOM 元素。

## 高级用法

### 深度搜索 Shadow DOM

```tsx
import { useActiveElement } from '@hooksy/core';

function ShadowDOMComponent() {
  // 深度搜索 Shadow DOM 中的活跃元素
  const activeElement = useActiveElement({ deep: true });
  
  return (
    <div>
      <p>Shadow DOM 中的活跃元素: {activeElement.current?.tagName}</p>
    </div>
  );
}
```

### 检测元素移除

```tsx
import { useActiveElement } from '@hooksy/core';

function RemovalDetectionComponent() {
  // 启用元素移除检测
  const activeElement = useActiveElement({ triggerOnRemoval: true });
  
  return (
    <div>
      <p>活跃元素: {activeElement.current?.tagName || '无'}</p>
      <button onClick={() => {
        // 当元素被移除时，hook 会自动检测并更新
        const element = activeElement.current;
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }}>
        移除当前活跃元素
      </button>
    </div>
  );
}
```

### 自定义文档对象

```tsx
import { useActiveElement } from '@hooksy/core';

function CustomDocumentComponent() {
  // 使用自定义的 document 对象（例如 iframe 中的 document）
  const iframeDoc = document.querySelector('iframe')?.contentDocument;
  const activeElement = useActiveElement({ 
    document: iframeDoc,
    deep: true 
  });
  
  return (
    <div>
      <p>iframe 中的活跃元素: {activeElement.current?.tagName || '无'}</p>
    </div>
  );
}
```

### 类型约束

```tsx
import { useActiveElement } from '@hooksy/core';

function TypedComponent() {
  // 限制返回类型为 HTMLInputElement
  const activeInput = useActiveElement<HTMLInputElement>();
  
  return (
    <div>
      <p>输入框类型: {activeInput.current?.type || '无活跃输入框'}</p>
      <input type="text" placeholder="文本输入" />
      <input type="email" placeholder="邮箱输入" />
    </div>
  );
}
```

## 实际应用场景

### 1. 表单验证提示

```tsx
import { useActiveElement } from '@hooksy/core';

function FormValidation() {
  const activeElement = useActiveElement();
  
  const getValidationMessage = () => {
    if (!activeElement.current) return '';
    
    const element = activeElement.current;
    if (element.tagName === 'INPUT') {
      const input = element as HTMLInputElement;
      if (input.required && !input.value) {
        return `${input.placeholder || '此字段'} 是必填的`;
      }
    }
    return '';
  };
  
  return (
    <form>
      <input required placeholder="用户名" />
      <input required placeholder="邮箱" />
      <p className="validation-message">{getValidationMessage()}</p>
    </form>
  );
}
```

### 2. 键盘导航支持

```tsx
import { useActiveElement } from '@hooksy/core';
import { useEffect } from 'react';

function KeyboardNavigation() {
  const activeElement = useActiveElement();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeElement.current) return;
      
      switch (e.key) {
        case 'Tab':
          // 处理 Tab 键导航
          break;
        case 'Enter':
          // 处理 Enter 键
          break;
        case 'Escape':
          // 处理 Escape 键
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeElement.current]);
  
  return (
    <div>
      <button>按钮 1</button>
      <button>按钮 2</button>
      <button>按钮 3</button>
    </div>
  );
}
```

### 3. 无障碍功能增强

```tsx
import { useActiveElement } from '@hooksy/core';

function AccessibilityEnhancement() {
  const activeElement = useActiveElement();
  
  useEffect(() => {
    if (activeElement.current) {
      // 为活跃元素添加视觉指示器
      activeElement.current.style.outline = '2px solid #007bff';
      
      return () => {
        // 清理样式
        if (activeElement.current) {
          activeElement.current.style.outline = '';
        }
      };
    }
  }, [activeElement.current]);
  
  return (
    <div>
      <h2>无障碍导航</h2>
      <nav>
        <a href="#section1">第一部分</a>
        <a href="#section2">第二部分</a>
        <a href="#section3">第三部分</a>
      </nav>
    </div>
  );
}
```

## 注意事项

1. **性能考虑**: 启用 `triggerOnRemoval` 选项会创建 MutationObserver，在大型应用中可能影响性能
2. **Shadow DOM 兼容性**: 深度搜索功能需要浏览器支持 Shadow DOM
3. **事件监听**: hook 会自动添加和清理事件监听器，无需手动管理
4. **SSR 兼容**: 在服务端渲染环境中，hook 会安全地处理 undefined 的 window 和 document

## 浏览器兼容性

- ✅ Chrome 51+
- ✅ Firefox 63+
- ✅ Safari 10.1+
- ✅ Edge 79+

## 相关链接

- [MDN - document.activeElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement)
- [MDN - Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [MDN - MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) 
