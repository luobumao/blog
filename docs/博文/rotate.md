---
icon: pen-to-square
date: 2025-07-23
category:
  - 原创
  - 插件
tag:
  - Python
---
# Pagermaid插件生成旋转用户头像视频
用于生成可自定义旋转速度与方向的用户头像旋转视频的人形自走机器人插件。
<!-- more -->
## 必要的Python库
`
pip install numpy Pillow imageio imageio-ffmpeg
`
## 插件代码
```
import os
import asyncio
import numpy as np
from PIL import Image, ImageDraw, UnidentifiedImageError
import imageio

from pyrogram.types import Message
from pyrogram import Client, enums
from pagermaid.listener import listener

def crop_to_circle(img: Image.Image) -> Image.Image:
    """
    将一个 PIL.Image 对象裁剪为圆形。
    以图像的短边作为圆的直径。
    """
    size = min(img.size)
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    result = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    img = img.crop(((img.width - size) // 2, (img.height - size) // 2, (img.width + size) // 2, (img.height + size) // 2))
    result.paste(img, (0, 0), mask)
    return result

def create_rotating_video(pil_img: Image.Image, output_path: str, duration: float, fps: int, direction_multiplier: int):
    """
    将一张图片制作成旋转的视频（内存优化版）。
    使用流式处理，逐帧写入视频文件，避免高内存占用。
    """
    img = crop_to_circle(pil_img)
    size = img.size
    total_frames = int(duration * fps)

    # 使用 imageio.get_writer 以流式处理模式创建视频
    # 'with'语句确保处理完成后文件会被正确关闭和保存
    with imageio.get_writer(output_path, fps=fps, codec='libx264', quality=8) as writer:
        for i in range(total_frames):
            # 1. 计算当前帧的旋转角度
            angle = direction_multiplier * (i / total_frames) * 360
            
            # 2. 旋转图像
            rotated_img = img.rotate(angle, resample=Image.BICUBIC, expand=False)
            
            # 3. 创建透明背景板并粘贴旋转后的图像以确保尺寸统一
            frame_bg = Image.new("RGBA", size, (255, 255, 255, 0))
            offset = ((size[0] - rotated_img.width) // 2, (size[1] - rotated_img.height) // 2)
            frame_bg.paste(rotated_img, offset, rotated_img)
            
            # 4. 将生成的单帧图像直接写入视频文件，然后丢弃
            writer.append_data(np.array(frame_bg))

@listener(
    command="rotate",
    description="将回复用户的头像制作为旋转 MP4 视频。\n\n**依赖安装:**\n`pip install numpy Pillow \"imageio[ffmpeg]\"`",
    parameters="[时长:秒] [方向:顺/逆] (可选, 默认为 5s 顺时针)",
    name="旋转头像"
)
async def rotate(client: Client, message: Message):
    """插件的主处理函数"""
    temp_avatar_path = None
    output_video_path = f"/tmp/pagermaid_video_{message.id}.mp4"

    try:
        # --- 1. 输入验证 ---
        if not message.reply_to_message:
            await message.edit("👉 请回复一位用户以获取其头像。")
            return

        replied_user = message.reply_to_message.from_user
        if not replied_user:
            await message.edit("❌ 无法获取目标用户信息。")
            return
        
        # --- 2. 获取头像 ---
        await message.edit(f"⏳ 正在获取 {replied_user.first_name} 的头像...")
        if not replied_user.photo:
            await message.edit("❌ 该用户没有设置头像或头像无法获取。")
            return
        photo_file_id = replied_user.photo.big_file_id

        # --- 3. 解析参数 ---
        params = message.text.split()
        duration = 5.0
        direction_sign = -1
        if len(params) > 1:
            try:
                duration = float(params[1])
            except ValueError:
                await message.edit("❌ 时长参数无效，请输入一个数字。")
                return
        if len(params) > 2:
            if params[2] == '逆':
                direction_sign = 1
            elif params[2] != '顺':
                await message.edit("❌ 方向参数无效，请输入 `顺` (顺时针) 或 `逆` (逆时针)。")
                return

        # --- 4. 核心处理流程 ---
        await message.edit("⚙️ 正在下载头像...")
        temp_avatar_path = await client.download_media(photo_file_id, file_name="/tmp/")

        await message.edit("🎨 正在处理图像...")
        try:
            avatar_image = Image.open(temp_avatar_path)
        except UnidentifiedImageError:
            await message.edit("❌ 图片处理失败！\n\n下载的头像文件格式不受支持或已损坏。")
            return

        await message.edit("🎬 正在生成旋转视频 ...")
        await asyncio.to_thread(
            create_rotating_video, avatar_image, output_video_path,
            duration, 30, direction_sign
        )

        # --- 5. 发送结果并清理 ---
        await client.send_video(
            chat_id=message.chat.id,
            video=output_video_path,
            reply_to_message_id=message.reply_to_message.id,
            caption=f"旋转吧，{replied_user.first_name}！"
        )
        await message.delete()

    except Exception as e:
        await message.edit(f"❌ 出现了一个意料之外的错误：\n`{type(e).__name__}: {e}`")
        
    finally:
        # --- 6. 资源释放 ---
        # 删除下载的临时头像文件
        if temp_avatar_path and os.path.exists(temp_avatar_path):
            os.remove(temp_avatar_path)
        # 删除最终生成的视频文件
        if os.path.exists(output_video_path):
            os.remove(output_video_path)
```