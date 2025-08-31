module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        // 类型枚举
        "type-enum": [
            2,
            "always",
            [
                "feat", // 新功能
                "fix", // 修复bug
                "docs", // 文档更新
                "style", // 代码格式调整
                "refactor", // 重构
                "perf", // 性能优化
                "chore", // 构建过程或辅助工具的变动
                "ci", // CI/CD 相关
                "build", // 构建系统或外部依赖的变动
                "revert", // 回滚
            ],
        ],
        // 主题不能为空
        "subject-empty": [2, "never"],
        // 主题不能以句号结尾
        "subject-full-stop": [2, "never", "."],
        // 主题最大长度
        "subject-max-length": [2, "always", 100],
        // 类型不能为空
        "type-empty": [2, "never"],
        // 类型最大长度
        "type-max-length": [2, "always", 20],
        // 范围不能为空（可选）
        "scope-empty": [2, "never"],
        // 范围最大长度
        "scope-max-length": [2, "always", 20],
    },
};
