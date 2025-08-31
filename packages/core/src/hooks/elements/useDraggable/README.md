# useDraggable

响应式的拖拽功能 hook，支持鼠标和触摸事件，提供完整的拖拽状态管理和约束控制。

## 功能特性

- 🎯 **响应式拖拽**: 自动跟踪拖拽状态和位置变化
- 📱 **触摸支持**: 同时支持鼠标和触摸事件
- 🎛️ **高度可配置**: 支持轴约束、边界约束、禁用状态等
- 🔄 **事件回调**: 提供拖拽开始、移动、结束的回调函数
- 📱 **类型安全**: 完整的 TypeScript 支持
- ⚡ **性能优化**: 智能的事件监听器管理和清理

## 基本用法

```tsx
import { useDraggable } from '@hooksy/core';

function DraggableComponent() {
  const draggable = useDraggable();
  
  return (
    <div
      ref={draggable.current.ref}
      style={{
        position: 'absolute',
        left: draggable.current.position.x,
        top: draggable.current.position.y,
        cursor: draggable.current.isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    >
      拖拽我
    </div>
  );
}
```

## API 参考

### 类型定义

```tsx
function useDraggable(
  options?: UseDraggableOptions
): React.MutableRefObject<DraggableState & {
  ref: (element: HTMLElement | null) => void;
  resetPosition: () => void;
  setPosition: (x: number, y: number) => void;
}>
```

### 参数

#### `options` (可选)

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `window` | `Window \| undefined` | `window` | 自定义 window 对象 |
| `document` | `Document \| undefined` | `document` | 自定义 document 对象 |
| `axis` | `"both" \| "x" \| "y"` | `"both"` | 拖拽轴约束 |
| `bounds` | `DraggableBounds \| null` | `null` | 拖拽边界约束 |
| `disabled` | `boolean` | `false` | 是否禁用拖拽 |
| `onStart` | `(state, event) => void` | `undefined` | 拖拽开始回调 |
| `onMove` | `(state, event) => void` | `undefined` | 拖拽移动回调 |
| `onEnd` | `(state, event) => void` | `undefined` | 拖拽结束回调 |

### 返回值

返回一个 React ref 对象，包含以下属性：

#### 状态属性
- `isDragging`: 是否正在拖拽
- `position`: 当前位置 `{ x: number, y: number }`
- `delta`: 移动增量 `{ x: number, y: number }`
- `startPosition`: 开始拖拽时的位置

#### 方法
- `ref`: 设置要拖拽的 DOM 元素
- `resetPosition`: 重置位置到原点
- `setPosition`: 设置指定位置

## 高级用法

### 轴约束

```tsx
import { useDraggable } from '@hooksy/core';

function HorizontalDraggable() {
  // 只允许水平拖拽
  const draggable = useDraggable({ axis: "x" });
  
  return (
    <div
      ref={draggable.current.ref}
      style={{
        position: 'absolute',
        left: draggable.current.position.x,
        top: 100, // Y 坐标固定
        cursor: 'grab',
      }}
    >
      只能水平拖拽
    </div>
  );
}

function VerticalDraggable() {
  // 只允许垂直拖拽
  const draggable = useDraggable({ axis: "y" });
  
  return (
    <div
      ref={draggable.current.ref}
      style={{
        position: 'absolute',
        left: 100, // X 坐标固定
        top: draggable.current.position.y,
        cursor: 'grab',
      }}
    >
      只能垂直拖拽
    </div>
  );
}
```

### 边界约束

```tsx
import { useDraggable } from '@hooksy/core';

function BoundedDraggable() {
  const draggable = useDraggable({
    bounds: {
      left: 0,
      top: 0,
      right: 400,  // 最大 X 坐标
      bottom: 300, // 最大 Y 坐标
    },
  });
  
  return (
    <div
      ref={draggable.current.ref}
      style={{
        position: 'absolute',
        left: draggable.current.position.x,
        top: draggable.current.position.y,
        cursor: 'grab',
      }}
    >
      在边界内拖拽
    </div>
  );
}
```

### 事件回调

```tsx
import { useDraggable } from '@hooksy/core';
import { useCallback } from 'react';

function CallbackDraggable() {
  const handleDragStart = useCallback((state, event) => {
    console.log('开始拖拽:', state);
  }, []);

  const handleDragMove = useCallback((state, event) => {
    console.log('拖拽中:', state.position);
  }, []);

  const handleDragEnd = useCallback((state, event) => {
    console.log('拖拽结束:', state);
  }, []);

  const draggable = useDraggable({
    onStart: handleDragStart,
    onMove: handleDragMove,
    onEnd: handleDragEnd,
  });
  
  return (
    <div
      ref={draggable.current.ref}
      style={{
        position: 'absolute',
        left: draggable.current.position.x,
        top: draggable.current.position.y,
        cursor: 'grab',
      }}
    >
      带回调的拖拽
    </div>
  );
}
```

### 禁用状态

```tsx
import { useDraggable } from '@hooksy/core';
import { useState } from 'react';

function ConditionalDraggable() {
  const [isEnabled, setIsEnabled] = useState(true);
  
  const draggable = useDraggable({
    disabled: !isEnabled,
  });
  
  return (
    <div>
      <button onClick={() => setIsEnabled(!isEnabled)}>
        {isEnabled ? '禁用拖拽' : '启用拖拽'}
      </button>
      
      <div
        ref={draggable.current.ref}
        style={{
          position: 'absolute',
          left: draggable.current.position.x,
          top: draggable.current.position.y,
          cursor: isEnabled ? 'grab' : 'default',
          opacity: isEnabled ? 1 : 0.5,
        }}
      >
        {isEnabled ? '可以拖拽' : '拖拽已禁用'}
      </div>
    </div>
  );
}
```

## 实际应用场景

### 1. 可拖拽卡片

```tsx
import { useDraggable } from '@hooksy/core';
import { useState } from 'react';

function DraggableCard() {
  const [cards, setCards] = useState([
    { id: 1, x: 0, y: 0, content: '卡片 1' },
    { id: 2, x: 200, y: 0, content: '卡片 2' },
    { id: 3, x: 400, y: 0, content: '卡片 3' },
  ]);

  const handleCardDrag = (cardId: number) => {
    const draggable = useDraggable({
      onMove: (state) => {
        setCards(prev => prev.map(card => 
          card.id === cardId 
            ? { ...card, x: state.position.x, y: state.position.y }
            : card
        ));
      },
    });

    return draggable;
  };

  return (
    <div className="card-container">
      {cards.map(card => {
        const draggable = handleCardDrag(card.id);
        
        return (
          <div
            key={card.id}
            ref={draggable.current.ref}
            className="draggable-card"
            style={{
              position: 'absolute',
              left: card.x,
              top: card.y,
              cursor: draggable.current.isDragging ? 'grabbing' : 'grab',
            }}
          >
            {card.content}
          </div>
        );
      })}
    </div>
  );
}
```

### 2. 可拖拽滑块

```tsx
import { useDraggable } from '@hooksy/core';

function DraggableSlider() {
  const draggable = useDraggable({
    axis: "x",
    bounds: { left: 0, top: 0, right: 300, bottom: 0 },
  });
  
  const percentage = (draggable.current.position.x / 300) * 100;
  
  return (
    <div className="slider-container">
      <div className="slider-track">
        <div
          ref={draggable.current.ref}
          className="slider-thumb"
          style={{
            position: 'absolute',
            left: draggable.current.position.x,
            cursor: 'grab',
          }}
        />
        <div 
          className="slider-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="slider-value">{Math.round(percentage)}%</div>
    </div>
  );
}
```

### 3. 可拖拽窗口

```tsx
import { useDraggable } from '@hooksy/core';
import { useState } from 'react';

function DraggableWindow() {
  const [isMinimized, setIsMinimized] = useState(false);
  
  const draggable = useDraggable({
    bounds: {
      left: 0,
      top: 0,
      right: window.innerWidth - 400,
      bottom: window.innerHeight - 300,
    },
  });
  
  if (isMinimized) {
    return (
      <button onClick={() => setIsMinimized(false)}>
        恢复窗口
      </button>
    );
  }
  
  return (
    <div
      ref={draggable.current.ref}
      className="draggable-window"
      style={{
        position: 'absolute',
        left: draggable.current.position.x,
        top: draggable.current.position.y,
        width: 400,
        height: 300,
        cursor: draggable.current.isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div className="window-header">
        <span>可拖拽窗口</span>
        <button onClick={() => setIsMinimized(true)}>最小化</button>
      </div>
      <div className="window-content">
        拖拽标题栏移动窗口
      </div>
    </div>
  );
}
```

### 4. 可拖拽列表项

```tsx
import { useDraggable } from '@hooksy/core';
import { useState } from 'react';

function DraggableListItem({ item, onReorder }) {
  const draggable = useDraggable({
    axis: "y",
    onEnd: (state) => {
      // 根据最终位置重新排序
      const newIndex = Math.round(state.position.y / 60);
      onReorder(item.id, newIndex);
    },
  });
  
  return (
    <div
      ref={draggable.current.ref}
      className="list-item"
      style={{
        position: 'relative',
        transform: `translateY(${draggable.current.position.y}px)`,
        cursor: draggable.current.isDragging ? 'grabbing' : 'grab',
        zIndex: draggable.current.isDragging ? 1000 : 1,
      }}
    >
      {item.content}
    </div>
  );
}

function DraggableList() {
  const [items, setItems] = useState([
    { id: 1, content: '项目 1' },
    { id: 2, content: '项目 2' },
    { id: 3, content: '项目 3' },
  ]);
  
  const handleReorder = (itemId, newIndex) => {
    setItems(prev => {
      const newItems = [...prev];
      const oldIndex = newItems.findIndex(item => item.id === itemId);
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);
      return newItems;
    });
  };
  
  return (
    <div className="draggable-list">
      {items.map(item => (
        <DraggableListItem
          key={item.id}
          item={item}
          onReorder={handleReorder}
        />
      ))}
    </div>
  );
}
```

## 注意事项

1. **元素引用**: 必须通过 `ref` 方法设置要拖拽的 DOM 元素
2. **定位方式**: 拖拽元素应该使用 `position: absolute` 或 `position: fixed`
3. **事件阻止**: hook 会自动调用 `preventDefault()` 防止默认行为
4. **触摸事件**: 触摸事件使用 `{ passive: false }` 确保可以阻止默认行为
5. **性能考虑**: 大量拖拽元素时注意性能优化，避免不必要的重新渲染
6. **边界处理**: 边界约束会在拖拽过程中实时生效

## 浏览器兼容性

- ✅ Chrome 51+
- ✅ Firefox 52+
- ✅ Safari 10+
- ✅ Edge 79+
- ✅ 移动端浏览器支持触摸事件

## 相关链接

- [MDN - Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)
- [MDN - Mouse Events](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)
- [MDN - Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [MDN - getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) 
