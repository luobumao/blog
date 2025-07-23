---
icon: pen-to-square
date: 2025-07-23
category:
  - 原创
  - 插件
tag:
  - Python
---
# Pagermaid插件调用Gemini(待完善)
用于使用Gemini实现问答、模型切换、默认提示词设置和图像识别功能的人形自走机器人插件。
<!-- more -->
## 脚本功能
,gemini setapi <你的API密钥> - 设置您的 Google AI API 密钥

,gemini setmodel <模型名称> - 切换使用的 Gemini 模型

,gemini prompt <提示词> - 设置自定义的基础提示词（留空则重置）

,gemini list - 显示所有可用的模型

,gemini <你的问题> - 与 Gemini 对话 (可回复图片)

## 插件代码
```
import json
import os
import sys
import subprocess
from io import BytesIO

from pagermaid.enums import Client, Message
from pagermaid.listener import listener
from pagermaid.utils import pip_install

def install_dependencies():
    dependencies = {
        "google.generativeai": "google-generativeai>=0.5.0",
        "PIL": "Pillow"
    }
    for import_name, package_name in dependencies.items():
        try:
            __import__(import_name.split('.')[0])
        except ImportError:
            print(f"正在安装缺失的依赖: {package_name}...")
            python_executable = sys.executable
            command = [python_executable, "-m", "pip", "install", package_name]
            try:
                subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            except subprocess.CalledProcessError as e:
                print("======================== 警告 ========================")
                print(f"自动安装依赖 '{package_name}' 失败。")
                print("请通过SSH连接到您的服务器，并手动运行以下命令：")
                print(f"'{python_executable} -m pip install {package_name}'")
                print(f"详细错误信息: {e.stderr.decode('utf-8', errors='ignore')}")
                print("======================================================")

install_dependencies()

try:
    import google.generativeai as genai
    from PIL import Image
except ImportError as e:
    print(f"关键依赖导入失败: {e}。请检查上述安装日志并手动解决。")
    pass

CONFIG_FILE_PATH = "gemini_config.json"

def load_gemini_config():
    if not os.path.exists(CONFIG_FILE_PATH):
        return {}
    try:
        with open(CONFIG_FILE_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return {}

def save_gemini_config(data):
    try:
        with open(CONFIG_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
    except IOError:
        pass

@listener(
    command="gemini",
    description="与 Google Gemini 对话，或进行设置。",
    parameters=(
        "\n- `,gemini setapi <你的API密钥>` - 设置您的 Google AI API 密钥"
        "\n- `,gemini setmodel <模型名称>` - 切换使用的 Gemini 模型"
        "\n- `,gemini prompt <提示词>` - 设置自定义的基础提示词（留空则重置）"
        "\n- `,gemini list` - 显示所有可用的模型"
        "\n- `,gemini <你的问题>` - 与 Gemini 对话 (可回复图片)"
    )
)
async def gemini_chat(client: Client, message: Message):
    opt = message.arguments.strip()
    args = opt.split()
    command = args[0].lower() if args else ""

    # Sub-command handling
    if command == "setapi":
        if len(args) > 1:
            api_key = " ".join(args[1:])
            config = load_gemini_config()
            config['api_key'] = api_key
            save_gemini_config(config)
            return await message.edit(f"✅ **Gemini API 密钥已设置成功！**\n"
                                      f"部分密钥：`{api_key[:5]}...{api_key[-4:]}`")
        else:
            return await message.edit("❌ `setapi` 命令需要一个 API 密钥作为参数。")

    elif command == "setmodel":
        if len(args) > 1:
            model_name = args[1]
            config = load_gemini_config()
            config['model'] = model_name
            save_gemini_config(config)
            return await message.edit(f"✅ **Gemini 模型已设置为:** `{model_name}`")
        else:
            return await message.edit("❌ `setmodel` 命令需要一个模型名称作为参数。")
            
    elif command == "prompt":
        if len(args) > 1:
            base_prompt_text = " ".join(args[1:])
            config = load_gemini_config()
            config['base_prompt'] = base_prompt_text
            save_gemini_config(config)
            return await message.edit(f"✅ **基础 Prompt 已更新为:**\n`{base_prompt_text}`")
        else:
            config = load_gemini_config()
            if config.pop('base_prompt', None) is not None:
                save_gemini_config(config)
                await message.edit("✅ **基础 Prompt 已成功重置为默认值。**")
            else:
                await message.edit("ℹ️ **基础 Prompt 当前已是默认值，无需重置。**")
            return

    elif command == "list":
        models = [
            "gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.0-flash",
            "gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-1.5-flash-8b",
            "gemini-1.5-pro"
        ]
        config = load_gemini_config()
        current_model = config.get('model', 'gemini-2.5-pro')
        response_text = "**可用的 Gemini 模型列表:**\n\n"
        for model in models:
            if model == current_model:
                response_text += f"`{model}` **(当前使用)**\n"
            else:
                response_text += f"`{model}`\n"
        response_text += "\n使用 `,gemini setmodel <模型名称>` 来切换模型。"
        return await message.edit(response_text)

    # Main chat logic
    else:
        config = load_gemini_config()
        api_key = config.get('api_key')
        model_name = config.get('model', 'gemini-2.5-pro')
        base_prompt = config.get('base_prompt', '始终使用中文交流。如果输出不含代码，请将所有内容使用 Markdown 引用格式（\'>\'）；如果输出含有代码，则仅将代码部分使用 Markdown 代码块格式化，正文部分不使用任何格式。')

        if not api_key:
            return await message.edit("❌ **未配置 Gemini API 密钥。**\n\n请使用 `,gemini setapi <你的密钥>` 进行配置。")

        try:
            genai.configure(api_key=api_key)
        except Exception as e:
            return await message.edit(f"API 密钥配置失败，请检查密钥是否正确：`{e}`")

        await message.edit(f"🧠 模型 `{model_name}` 思考中...")

        target_message = message.reply_to_message or message
        
        prompt_parts_for_ai = []
        if message.reply_to_message and (message.reply_to_message.text or message.reply_to_message.caption):
            replied_text = message.reply_to_message.text or message.reply_to_message.caption
            prompt_parts_for_ai.append(replied_text)
        if opt:
            prompt_parts_for_ai.append(opt)
        prompt_for_ai = "\n\n".join(prompt_parts_for_ai)
        
        image = None
        if target_message.photo or (target_message.document and target_message.document.mime_type.startswith("image/")):
            try:
                file_io = await client.download_media(target_message, in_memory=True)
                file_io.seek(0)
                image = Image.open(file_io)
            except Exception as e:
                return await message.edit(f"🖼️ **图片处理失败**\n\n**原始错误:**\n`{e}`")

        if not prompt_for_ai and not image:
            return await message.edit("🤔 请输入问题或回复一条消息/图片。")

        full_prompt_for_ai = base_prompt
        if base_prompt and prompt_for_ai.strip():
            full_prompt_for_ai += f"\n\n用户问题：\n{prompt_for_ai.strip()}"
        elif not base_prompt and prompt_for_ai.strip():
            full_prompt_for_ai = prompt_for_ai.strip()

        try:
            model = genai.GenerativeModel(model_name)
            contents = [p for p in (full_prompt_for_ai, image) if p]
            response = await model.generate_content_async(contents)

            if not response.parts:
                if response.prompt_feedback and response.prompt_feedback.block_reason:
                    return await message.edit(f"⚠️ 请求被阻止，原因：`{response.prompt_feedback.block_reason.name}`")
                else:
                    return await message.edit("❌ Gemini 未返回任何内容。")
            
            question_for_display = opt
            answer_text = response.text

            if question_for_display:
                processed_question = '> ' + question_for_display.replace('\n', '\n> ')
                final_text = (
                    f"**🤔 问题:**\n{processed_question}\n\n"
                    f"**🤖 Gemini 的回答:**\n{answer_text}"
                )
            else:
                final_text = f"**🤖 Gemini 的回答:**\n{answer_text}"

            await message.edit(final_text)
            
        except Exception as e:
            await message.edit(f"🤖 **Gemini API 调用失败**\n\n**错误信息:**\n`{e}`\n\n请检查您的 API 密钥、模型名称 (`{model_name}`) 是否有效或账户余额是否充足。")
```

