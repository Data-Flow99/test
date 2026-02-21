#!/usr/bin/env python3
"""
Android Kotlin Source Packager

用途：
1) 接收一个 Kotlin Activity 源码文件（MainActivity.kt）
2) 生成标准 Android 工程骨架（Kotlin + AppCompat）
3) 可选触发离线优先构建（assembleDebug）

说明：
- 为了满足“本地离线可打包”的需求，本工具默认使用 `--offline` 调用 Gradle。
- 首次构建仍需要你本机已经具备：Android SDK、Build Tools、Gradle 缓存。
"""

from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

ANDROID_MANIFEST = """<?xml version=\"1.0\" encoding=\"utf-8\"?>
<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\">

    <application
        android:allowBackup=\"true\"
        android:icon=\"@android:drawable/sym_def_app_icon\"
        android:label=\"@string/app_name\"
        android:roundIcon=\"@android:drawable/sym_def_app_icon\"
        android:supportsRtl=\"true\"
        android:theme=\"@style/Theme.AppCompat.Light.NoActionBar\">
        <activity
            android:name=\".MainActivity\"
            android:exported=\"true\">
            <intent-filter>
                <action android:name=\"android.intent.action.MAIN\" />
                <category android:name=\"android.intent.category.LAUNCHER\" />
            </intent-filter>
        </activity>
    </application>

</manifest>
"""

STRINGS_XML = """<?xml version=\"1.0\" encoding=\"utf-8\"?>
<resources>
    <string name=\"app_name\">{app_name}</string>
</resources>
"""

SETTINGS_GRADLE = """pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = \"__PROJECT_NAME__\"
include(\":app\")
"""

ROOT_BUILD_GRADLE = """plugins {
    id(\"com.android.application\") version \"8.5.2\" apply false
    id(\"org.jetbrains.kotlin.android\") version \"1.9.24\" apply false
}
"""

APP_BUILD_GRADLE = """plugins {
    id(\"com.android.application\")
    id(\"org.jetbrains.kotlin.android\")
}

android {
    namespace = \"__APPLICATION_ID__\"
    compileSdk = __COMPILE_SDK__

    defaultConfig {
        applicationId = \"__APPLICATION_ID__\"
        minSdk = __MIN_SDK__
        targetSdk = __TARGET_SDK__
        versionCode = 1
        versionName = \"1.0\"

        testInstrumentationRunner = \"androidx.test.runner.AndroidJUnitRunner\"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile(\"proguard-android-optimize.txt\"),
                \"proguard-rules.pro\"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = \"17\"
    }
}

dependencies {
    implementation(\"androidx.core:core-ktx:1.13.1\")
    implementation(\"androidx.appcompat:appcompat:1.7.0\")
    implementation(\"com.google.android.material:material:1.12.0\")
}
"""

GRADLE_PROPERTIES = """org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
kotlin.code.style=official
android.nonTransitiveRClass=true
"""

MAIN_ACTIVITY_TEMPLATE = """package __APPLICATION_ID__

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val textView = TextView(this).apply {
            text = \"Hello from generated Android app\"
            textSize = 24f
        }
        setContentView(textView)
    }
}
"""


def safe_name(name: str, fallback: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9_\-]", "", name.strip())
    return cleaned or fallback


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def create_project(
    source_file: Path | None,
    output_dir: Path,
    project_name: str,
    app_name: str,
    application_id: str,
    compile_sdk: int,
    min_sdk: int,
    target_sdk: int,
) -> Path:
    project_root = output_dir / project_name
    if project_root.exists():
        raise FileExistsError(f"目标目录已存在：{project_root}")

    settings_gradle = SETTINGS_GRADLE.replace("__PROJECT_NAME__", project_name)
    app_build_gradle = (
        APP_BUILD_GRADLE.replace("__APPLICATION_ID__", application_id)
        .replace("__COMPILE_SDK__", str(compile_sdk))
        .replace("__MIN_SDK__", str(min_sdk))
        .replace("__TARGET_SDK__", str(target_sdk))
    )

    write_text(project_root / "settings.gradle.kts", settings_gradle)
    write_text(project_root / "build.gradle.kts", ROOT_BUILD_GRADLE)
    write_text(project_root / "gradle.properties", GRADLE_PROPERTIES)
    write_text(project_root / "app" / "build.gradle.kts", app_build_gradle)
    write_text(project_root / "app" / "proguard-rules.pro", "")
    write_text(project_root / "app" / "src" / "main" / "AndroidManifest.xml", ANDROID_MANIFEST)
    write_text(project_root / "app" / "src" / "main" / "res" / "values" / "strings.xml", STRINGS_XML.format(app_name=app_name))

    main_activity_path = project_root / "app" / "src" / "main" / "java" / Path(*application_id.split(".")) / "MainActivity.kt"
    if source_file:
        main_activity_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source_file, main_activity_path)
    else:
        write_text(main_activity_path, MAIN_ACTIVITY_TEMPLATE.replace("__APPLICATION_ID__", application_id))

    return project_root


def run_gradle_build(project_root: Path, offline: bool) -> None:
    gradlew = "gradlew.bat" if sys.platform.startswith("win") else "gradlew"
    gradlew_path = project_root / gradlew

    if not gradlew_path.exists():
        print("[INFO] 本地缺少 Gradle Wrapper，尝试调用系统 gradle 生成 wrapper...")
        subprocess.run(["gradle", "wrapper"], cwd=project_root, check=True)

    cmd = [str(gradlew_path), "assembleDebug"]
    if offline:
        cmd.append("--offline")

    print(f"[INFO] 执行构建命令: {' '.join(cmd)}")
    subprocess.run(cmd, cwd=project_root, check=True)


def main() -> int:
    parser = argparse.ArgumentParser(description="将 Kotlin 源码打包为可安装 Android APK 的本地工具")
    parser.add_argument("--source", type=Path, help="MainActivity.kt 源码路径（可选）")
    parser.add_argument("--out", type=Path, default=Path("dist"), help="输出目录")
    parser.add_argument("--project", default="AiGeneratedAndroidApp", help="工程目录名")
    parser.add_argument("--app-name", default="AI Generated App", help="应用名称")
    parser.add_argument("--application-id", default="com.example.aigeneratedapp", help="Android Application ID")
    parser.add_argument("--compile-sdk", type=int, default=34)
    parser.add_argument("--min-sdk", type=int, default=24)
    parser.add_argument("--target-sdk", type=int, default=34)
    parser.add_argument("--build", action="store_true", help="创建工程后直接构建 APK")
    parser.add_argument("--offline", action="store_true", help="构建时使用 Gradle 离线模式")

    args = parser.parse_args()

    project_name = safe_name(args.project, "AiGeneratedAndroidApp")
    source_file = args.source
    if source_file and not source_file.exists():
        print(f"[ERROR] 指定源码不存在：{source_file}")
        return 2

    try:
        project_root = create_project(
            source_file=source_file,
            output_dir=args.out,
            project_name=project_name,
            app_name=args.app_name,
            application_id=args.application_id,
            compile_sdk=args.compile_sdk,
            min_sdk=args.min_sdk,
            target_sdk=args.target_sdk,
        )
    except FileExistsError as exc:
        print(f"[ERROR] {exc}")
        return 3

    print(f"[OK] 工程已生成：{project_root}")
    print("[OK] APK 输出目录（构建后）：app/build/outputs/apk/debug/app-debug.apk")

    if args.build:
        try:
            run_gradle_build(project_root, offline=args.offline)
            print("[OK] 构建完成。")
        except subprocess.CalledProcessError as exc:
            print(f"[ERROR] 构建失败，返回码: {exc.returncode}")
            return exc.returncode or 1
        except FileNotFoundError:
            print("[ERROR] 未找到 gradle。请先安装 Gradle，或手动放置 gradlew/gradlew.bat。")
            return 4

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
