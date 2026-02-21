# 本地 EXE：将 AI 生成 Kotlin 源码打包为 Android APK

## 目标
- 输入：一份 `MainActivity.kt`（Kotlin，安卓官方推荐语言）。
- 输出：标准 Android 工程 + 可安装的 `app-debug.apk`。
- 方式：本地离线优先（`--offline`），适合已准备好 SDK/缓存的环境。

## 文件说明
- `android_packager.py`：核心打包脚本（可直接运行）。
- `build_exe.bat`：将脚本打包成 Windows EXE（`dist/android-packager.exe`）。

## 1) 先生成 EXE（Windows）
```bat
pip install pyinstaller
build_exe.bat
```

## 2) 使用 EXE 生成 Android 工程
```bat
android-packager.exe --source D:\code\MainActivity.kt --out D:\output --project DemoApp
```

## 3) 离线打包 APK
```bat
android-packager.exe --source D:\code\MainActivity.kt --out D:\output --project DemoApp --build --offline
```

APK 默认产物：
- `D:\output\DemoApp\app\build\outputs\apk\debug\app-debug.apk`

## 约束与前置条件（离线能力）
要做到“基本离线可打包”，本机需提前具备：
1. Android SDK（含对应 `compileSdk` 平台与 Build Tools）。
2. JDK 17。
3. Gradle 缓存（首次联网拉取后可离线复用）。

## 推荐给 AI 的源码约束（单语言：Kotlin）
建议固定让 AI 输出：
- 文件名：`MainActivity.kt`
- 包名与参数 `--application-id` 一致。
- 仅使用 AndroidX + Kotlin 标准 API，避免额外三方依赖。
