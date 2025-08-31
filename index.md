Hooksy 扁平化项目架构方案

基于你的需求，我重新设计了一个更加扁平化的项目架构，将核心功能集中在 @hooksy/core 包中，并按照功能分类组织。以下是完善的项目目录结构：

一、整体项目结构

hooksy/
├── packages/ # 所有功能包 (扁平化管理)
│ └── core/ # 核心 Hooks 包 (包含所有主要功能分类)
│ ├── src/ # 源代码
│ │ ├── index.ts # 统一导出入口
│ │ ├── hooks/ # 所有 Hooks 实现 (按功能分类的子目录)
│ │ │ ├── lifecycle/ # 生命周期相关 Hooks│ │ │ │
│ │ │ ├── element/ # DOM 元素相关 Hooks│ │
│ │ │ ├── browser/ # 浏览器相关 Hooks
│ │ │ ├── sensor/ # 传感器相关 Hooks│ │ │ │
│ │ │ ├── network/ # 网络相关 Hooks│ │ │
│ │ │ ├── animation/ # 动画相关 Hooks│ │ │ │
│ │ │ ├── array/ # 数组操作相关 Hooks │ │ │
│ │ │ ├── time/ # 时间相关 Hooks
│ │ │ ├── utils/ # 工具类 Hooks
│ │ │ └── effect/ # 副作用相关 Hooks
│ │ ├── types/ # 类型定义
│ │ │ ├── hooks/ # Hooks 相关类型
│ │ │ │ ├── useMouse.types.ts
│ │ │ │ ├── useFetch.types.ts
│ │ │ │ └── ...
│ │ │ └── index.ts # 统一类型导出
│ │ │
│ │ └── utils/ # 工具函数
│ │ └── ...
│ │
│ ├── docs/ # 文档
│ │
│ ├── package.json # 核心包配置
│ └── tsconfig.json # TypeScript 配置
│
├── tsup.config.ts # 构建配置
├── package.json # 根项目配置
└── README.md # 项目介绍

二、核心改进说明

1. 扁平化项目结构

• 取消多包管理：将所有核心功能集中在一个 @hooksy/core 包中

• 简化导入路径：统一从 @hooksy/core 导入所有 Hooks

• 按功能分类：在 hooks/ 目录下按功能组织子目录

2. 功能分类架构

hooks/
├── lifecycle/ # 生命周期
├── element/ # DOM 元素
├── browser/ # 浏览器
├── sensor/ # 传感器
├── network/ # 网络
├── animation/ # 动画
├── array/ # 数组
├── time/ # 时间
├── utils/ # 工具
└── effect/ # 副作用



三、关键文件内容示例

1. 核心包配置 (package.json)

{
"name": "@hooksy/core",
"version": "1.0.0",
"description": "Core React Hooks collection from Hooksy library",
"main": "dist/index.cjs.js",
"module": "dist/index.esm.js",
"types": "dist/index.d.ts",
"sideEffects": false,
"files": ["dist"],
"exports": {
".": {
"import": "./dist/index.esm.js",
"require": "./dist/index.cjs.js"
},
"./hooks/_": {
"import": "./dist/hooks/_.esm.js",
"require": "./dist/hooks/\*.cjs.js"
}
},
"peerDependencies": {
"react": ">=18.0.0",
"react-dom": ">=18.0.0"
},
"scripts": {
"build": "tsup",
"lint": "eslint src --ext .ts,.tsx",
"type-check": "tsc --noEmit"
},
"devDependencies": {
"react": "^18.0.0",
"react-dom": "^18.0.0"
}
}

2. 统一导出入口 (src/index.ts)

// src/index.ts - 核心统一导出
export _ from './hooks/lifecycle'
export _ from './hooks/element'
export _ from './hooks/browser'
export _ from './hooks/sensor'
export _ from './hooks/network'
export _ from './hooks/animation'
export _ from './hooks/array'
export _ from './hooks/time'
export _ from './hooks/utils'
export _ from './hooks/effect'

// 也可以单独导出常用 Hooks 以方便导入
export { useToggle } from './hooks/utils/useToggle'
export { useMouse } from './hooks/sensor/useMouse'
export { useFetch } from './hooks/network/useFetch'
export { useTimeout } from './hooks/time/useTimeout'
export { useDebounce } from './hooks/effect/useDebounce'

3. 测试文件示例 (直接导入 @hooksy/core)





5. TypeScript 配置 (tsconfig.json)

{
"compilerOptions": {
"target": "ES2020",
"lib": ["DOM", "DOM.Iterable", "ES2020"],
"module": "ESNext",
"skipLibCheck": true,
"moduleResolution": "bundler",
"allowImportingTsExtensions": true,
"resolveJsonModule": true,
"isolatedModules": true,
"noEmit": true,
"jsx": "react-jsx",
"strict": true,
"noUnusedLocals": true,
"noUnusedParameters": true,
"noFallthroughCasesInSwitch": true,
"baseUrl": ".",
"paths": {
"@hooksy/core": ["packages/core/src"],
"@hooksy/core/_": ["packages/core/src/_"]
}
},
"include": [
"packages/core/src/**/*",
"packages/core/types/**/*"
],
"exclude": ["node_modules", "dist"]
}

四、开发工作流优化

1. 简化的脚本配置 (package.json)

{
"scripts": {
"build": "tsup packages/core --watch",
"build:prod": "tsup packages/core",
"lint": "eslint packages/core/src --ext .ts,.tsx",
"type-check": "tsc --noEmit",
"docs": "vitepress dev docs",
"dev": "pnpm run lint -- --watch",
"prepare": "husky install"
}
}



五、架构优势总结

1. 扁平化设计

• ✅ 简化的目录结构，易于导航

• ✅ 减少包管理复杂度

• ✅ 统一的导入路径 (@hooksy/core)

2. 功能分类清晰

• ✅ 按功能领域组织 Hooks

• ✅ 生命周期、DOM、浏览器、传感器等逻辑分组

• ✅ 便于开发者查找和使用相关功能



4. Tree Shaking 优化

• ✅ ESM 格式导出

• ✅ 按功能分类的独立导出

• ✅ 支持按需导入特定 Hooks

5. 类型安全

• ✅ 完整的 TypeScript 支持

• ✅ 功能分类的类型定义

• ✅ 统一的类型导出
