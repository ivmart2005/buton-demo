import os
from pathlib import Path

def find_project_files(start_path):
    """Находит файлы проекта ТОЛЬКО в указанных папках"""
    ts_files = []
    
    # Папки React проекта в src
    react_dirs_in_src = [
        'assets',
        'components', 
        'contexts',
        'hooks',
        'types'
    ]
    
    # Ищем файлы в папках React
    for dir_name in react_dirs_in_src:
        full_dir_path = start_path / dir_name
        if not full_dir_path.exists() or not full_dir_path.is_dir():
            continue
            
        print(f"📁 Сканирую: {dir_name}/")
        for root, _, files in os.walk(full_dir_path):
            for file in files:
                # ТОЧНО проверяем расширения
                if file.endswith(('.ts', '.tsx', '.css', 'cjs', 'js')):
                    ts_files.append(Path(root) / file)
    
    return ts_files

def find_electron_files():
    """Находит файлы Electron на одном уровне с src"""
    electron_files = []
    
    # Папка src (где этот скрипт)
    src_dir = Path(__file__).parent
    
    # Папка electron (рядом с src)
    electron_dir = src_dir.parent / 'electron'
    
    if not electron_dir.exists() or not electron_dir.is_dir():
        print(f"⚠️  Папка electron не найдена: {electron_dir}")
        return electron_files
    
    print(f"⚡ Сканирую: electron/")
    
    # Список КОНКРЕТНЫХ файлов Electron которые нужны
    electron_files_to_find = [
        'main.cjs',
        'preload.js',
        'database/connection.cjs',
        'database/flowers.cjs',
        'database/types.cjs',
        'handlers/flowerHandlers.cjs',
        'handlers/typeHandlers.cjs'
    ]
    
    for file_path in electron_files_to_find:
        full_path = electron_dir / file_path
        if full_path.exists():
            electron_files.append(full_path)
            print(f"  ✓ {file_path}")
        else:
            print(f"  ✗ {file_path} (не найден)")
    
    return electron_files

def export_files_to_txt(files, output_file):
    """Сохраняет файлы в текстовый файл"""
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for file_path in files:
            try:
                # Относительный путь для читаемости
                try:
                    rel_path = file_path.relative_to(Path.cwd())
                except ValueError:
                    rel_path = file_path
                
                outfile.write(f"Файл: {rel_path}\n")
                outfile.write("=" * 80 + "\n")
                
                # Читаем файл
                with open(file_path, 'r', encoding='utf-8') as infile:
                    content = infile.read()
                    outfile.write(content)
                
                outfile.write("\n" + "-" * 80 + "\n\n")
                
            except Exception as e:
                outfile.write(f"❌ Ошибка чтения {file_path}: {str(e)}\n")
                outfile.write("-" * 80 + "\n\n")

def main():
    # Текущая папка (должна быть src)
    current_dir = Path.cwd()
    print("🔍 Поиск файлов проекта...")
    print(f"📁 Текущая папка: {current_dir}")
    
    # 1. React файлы
    react_files = find_project_files(current_dir)
    
    # 2. Electron файлы  
    electron_files = find_electron_files()
    
    # Объединяем
    all_files = react_files + electron_files
    
    if not all_files:
        print("❌ Файлы не найдены!")
        return
    
    print(f"\n📊 Найдено файлов: {len(all_files)}")
    print(f"  • React: {len(react_files)}")
    print(f"  • Electron: {len(electron_files)}")
    
    # Сортируем
    all_files.sort()
    
    # Сохраняем
    output_file = "project_files.txt"
    print(f"\n💾 Сохраняю в: {output_file}")
    export_files_to_txt(all_files, output_file)
    
    # Статистика
    if os.path.exists(output_file):
        file_size = os.path.getsize(output_file) / (1024 * 1024)
        print(f"📊 Размер файла: {file_size:.2f} MB")
    
    print("\n✅ Готово!")

if __name__ == "__main__":
    main()