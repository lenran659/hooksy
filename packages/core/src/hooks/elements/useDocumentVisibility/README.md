# useDocumentVisibility

响应式地获取当前文档的可见性状态，支持自定义配置和事件监听。

## 功能特性

- 🎯 **响应式跟踪**: 自动跟踪 `document.visibilityState` 的变化
- 📱 **多状态支持**: 支持 `visible`、`hidden`、`prerender` 等状态
- 🎛️ **高度可配置**: 支持自定义 window 和 document 对象
- 🔄 **事件监听**: 监听 `visibilitychange`、`pagehide`、`pageshow` 事件
- 📱 **类型安全**: 完整的 TypeScript 支持
- ⚡ **性能优化**: 智能的事件监听器管理

## 基本用法

```tsx
import { useDocumentVisibility } from '@hooksy/core';

function MyComponent() {
  const visibility = useDocumentVisibility();
  
  return (
    <div>
      <p>当前页面状态: {visibility.current || '未知'}</p>
      <p>页面是否可见: {visibility.current === 'visible' ? '是' : '否'}</p>
    </div>
  );
}
```

## API 参考

### 类型定义

```tsx
function useDocumentVisibility(
  options?: UseDocumentVisibilityOptions
): React.MutableRefObject<DocumentVisibilityState | undefined>
```

### 参数

#### `options` (可选)

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `window` | `Window \| undefined` | `window` | 自定义 window 对象 |
| `document` | `Document \| undefined` | `document` | 自定义 document 对象 |
| `immediate` | `boolean` | `true` | 是否立即获取初始状态 |

### 返回值

返回一个 React ref 对象，其 `current` 属性包含当前文档的可见性状态。

### 可见性状态值

- `"visible"`: 页面完全可见
- `"hidden"`: 页面不可见（如切换标签页、最小化窗口）
- `"prerender"`: 页面正在预渲染且不可见

## 高级用法

### 自定义配置对象

```tsx
import { useDocumentVisibility } from '@hooksy/core';

function CustomDocumentComponent() {
  // 使用自定义的 document 对象（例如 iframe 中的 document）
  const iframeDoc = document.querySelector('iframe')?.contentDocument;
  const visibility = useDocumentVisibility({ 
    document: iframeDoc,
    immediate: true 
  });
  
  return (
    <div>
      <p>iframe 页面状态: {visibility.current || '未知'}</p>
    </div>
  );
}
```

### 延迟初始化

```tsx
import { useDocumentVisibility } from '@hooksy/core';

function LazyComponent() {
  // 延迟获取初始状态，直到组件真正需要时
  const visibility = useDocumentVisibility({ immediate: false });
  
  useEffect(() => {
    // 手动触发状态获取
    if (visibility.current === undefined) {
      // 执行初始化逻辑
    }
  }, [visibility.current]);
  
  return (
    <div>
      <p>页面状态: {visibility.current || '未初始化'}</p>
    </div>
  );
}
```

### 条件渲染

```tsx
import { useDocumentVisibility } from '@hooksy/core';

function ConditionalComponent() {
  const visibility = useDocumentVisibility();
  
  // 根据可见性状态条件渲染
  if (visibility.current === 'hidden') {
    return <div>页面已隐藏，显示简化内容</div>;
  }
  
  return (
    <div>
      <h1>完整页面内容</h1>
      <p>当前状态: {visibility.current}</p>
    </div>
  );
}
```

## 实际应用场景

### 1. 页面可见性检测

```tsx
import { useDocumentVisibility } from '@hooksy/core';
import { useEffect } from 'react';

function PageVisibilityTracker() {
  const visibility = useDocumentVisibility();
  
  useEffect(() => {
    if (visibility.current === 'hidden') {
      console.log('页面已隐藏，暂停动画或视频');
      // 暂停动画、视频播放等
    } else if (visibility.current === 'visible') {
      console.log('页面已显示，恢复动画或视频');
      // 恢复动画、视频播放等
    }
  }, [visibility.current]);
  
  return (
    <div>
      <h2>页面可见性跟踪</h2>
      <p>当前状态: {visibility.current}</p>
    </div>
  );
}
```

### 2. 性能优化

```tsx
import { useDocumentVisibility } from '@hooksy/core';
import { useEffect, useRef } from 'react';

function PerformanceOptimizer() {
  const visibility = useDocumentVisibility();
  const intervalRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (visibility.current === 'visible') {
      // 页面可见时启动定时器
      intervalRef.current = setInterval(() => {
        console.log('执行定期任务');
      }, 1000);
    } else {
      // 页面不可见时清除定时器
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [visibility.current]);
  
  return (
    <div>
      <h2>性能优化器</h2>
      <p>定时器状态: {intervalRef.current ? '运行中' : '已停止'}</p>
    </div>
  );
}
```

### 3. 用户体验增强

```tsx
import { useDocumentVisibility } from '@hooksy/core';
import { useEffect, useState } from 'react';

function UserExperienceEnhancer() {
  const visibility = useDocumentVisibility();
  const [lastActiveTime, setLastActiveTime] = useState<Date>(new Date());
  
  useEffect(() => {
    if (visibility.current === 'visible') {
      // 页面变为可见时，更新最后活跃时间
      setLastActiveTime(new Date());
      
      // 可以显示欢迎回来的消息
      console.log('欢迎回来！');
    }
  }, [visibility.current]);
  
  return (
    <div>
      <h2>用户体验增强</h2>
      <p>页面状态: {visibility.current}</p>
      <p>最后活跃时间: {lastActiveTime.toLocaleString()}</p>
      {visibility.current === 'visible' && (
        <div className="welcome-message">
          欢迎回来！页面已重新激活。
        </div>
      )}
    </div>
  );
}
```

### 4. 数据同步

```tsx
import { useDocumentVisibility } from '@hooksy/core';
import { useEffect } from 'react';

function DataSynchronizer() {
  const visibility = useDocumentVisibility();
  
  useEffect(() => {
    if (visibility.current === 'visible') {
      // 页面重新可见时，同步数据
      console.log('页面重新可见，开始同步数据...');
      
      // 执行数据同步逻辑
      syncData();
    }
  }, [visibility.current]);
  
  const syncData = async () => {
    try {
      // 获取最新数据
      const response = await fetch('/api/data');
      const data = await response.json();
      
      // 更新本地状态
      console.log('数据同步完成:', data);
    } catch (error) {
      console.error('数据同步失败:', error);
    }
  };
  
  return (
    <div>
      <h2>数据同步器</h2>
      <p>当前状态: {visibility.current}</p>
      <p>数据同步状态: {visibility.current === 'visible' ? '已激活' : '已暂停'}</p>
    </div>
  );
}
```

## 注意事项

1. **浏览器兼容性**: `document.visibilityState` 在较新的浏览器中支持，旧版本可能不支持
2. **事件监听**: hook 会自动添加和清理事件监听器，无需手动管理
3. **SSR 兼容**: 在服务端渲染环境中，hook 会安全地处理 undefined 的 window 和 document
4. **性能考虑**: 事件监听器会在组件卸载时自动清理，避免内存泄漏
5. **状态变化**: 页面可见性状态变化可能由多种因素引起（切换标签页、最小化窗口、锁屏等）

## 浏览器兼容性

- ✅ Chrome 33+
- ✅ Firefox 18+
- ✅ Safari 10.1+
- ✅ Edge 12+
- ⚠️ IE 10+ (部分支持)

## 相关链接

- [MDN - Document.visibilityState](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)
- [MDN - Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [MDN - visibilitychange event](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event) 
