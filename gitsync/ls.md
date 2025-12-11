/
├── AGENTS.md           # Agent 开发规范与风格指南
├── bin/                # 辅助脚本
│   ├── gci             # 日常提交快捷命令 (git commit)
│   └── gme             # 标记提交以供 AI 合并 (git merge)
├── build.sh            # 项目构建脚本
├── bun.lock            # bun 依赖锁定文件
├── package.json        # 项目元数据及依赖
├── readme/             # README 文档
│   ├── en.md           # 英文 README
│   └── zh.md           # 中文 README
├── run.sh              # 项目运行脚本
├── src/                # 源代码 (CoffeeScript & JavaScript)
│   ├── ATOMGIT.js      # AtomGit API 客户端
│   ├── GITHUB.js       # GitHub API 客户端
│   ├── gitInit.coffee  # 处理 Git 仓库的初始化
│   ├── lib.coffee      # 库主入口，负责编排同步流程
│   ├── merge.coffee    # 执行压缩合并及 AI 生成提交注释
│   ├── mergeIfNeed.coffee # 在满足条件时管理合并流程
│   ├── needSync.coffee # 检查是否存在显式的同步请求
│   └── syncSrcDev.coffee # 检查并启动单个仓库同步的核心逻辑
└── test/               # 测试及演示脚本
    ├── github2atomgit.coffee # 从 GitHub 到 AtomGit 的同步测试
    ├── main.js         # 使用演示入口
    └── sync.yml        # 同步状态的示例 yml 文件
