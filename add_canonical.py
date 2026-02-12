#!/usr/bin/env python3
"""
为所有子目录的index.html添加canonical标记
"""
import os
import re
from pathlib import Path

def add_canonical_tag(file_path, canonical_url):
    """为HTML文件添加canonical标记"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        # 尝试其他编码
        try:
            with open(file_path, 'r', encoding='gbk') as f:
                content = f.read()
        except:
            print(f"无法读取文件: {file_path}")
            return False

    # 检查是否已经有canonical标记
    if 'rel="canonical"' in content or "rel='canonical'" in content:
        print(f"跳过(已有canonical): {file_path}")
        return False

    # 查找</head>标签的位置
    head_match = re.search(r'</head>', content, re.IGNORECASE)
    if not head_match:
        print(f"未找到</head>标签: {file_path}")
        return False

    # 在</head>之前插入canonical标记
    canonical_tag = f'\t<link rel="canonical" href="{canonical_url}">\n'
    insert_pos = head_match.start()
    new_content = content[:insert_pos] + canonical_tag + content[insert_pos:]

    # 写回文件
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"已添加canonical: {file_path} -> {canonical_url}")
        return True
    except Exception as e:
        print(f"写入失败: {file_path}, 错误: {e}")
        return False

def main():
    base_path = Path('/Users/oliver/Downloads/workspace/mine/moyu')
    base_url = 'https://moyu.aolifu.org'

    # 统计
    total = 0
    success = 0

    # 遍历所有子目录
    for item in base_path.iterdir():
        if item.is_dir() and item.name != 'static':
            index_file = item / 'index.html'
            if index_file.exists():
                total += 1
                # 构建canonical URL
                canonical_url = f"{base_url}/{item.name}/"
                if add_canonical_tag(index_file, canonical_url):
                    success += 1

    print(f"\n完成! 总共: {total}, 成功: {success}")

if __name__ == '__main__':
    main()

