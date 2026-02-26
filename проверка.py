import sqlite3
import os

def check_flowers_db(db_path):
    """Проверяем таблицу с цветами в flowers.db"""
    
    if not os.path.exists(db_path):
        print(f"❌ Файл не найден: {db_path}")
        return
    
    print(f"\n🔍 Анализируем БД: {os.path.abspath(db_path)}")
    print("="*80)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Проверяем, есть ли таблица с такими полями
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    
    target_table = None
    for table_name in [t[0] for t in tables]:
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = [col[1] for col in cursor.fetchall()]
        
        # Проверяем, содержит ли таблица нужные поля
        required_fields = ['id', 'name', 'colour', 'flower_type_id']
        if all(field in columns for field in required_fields):
            target_table = table_name
            print(f"✅ Найдена таблица с цветами: {table_name}")
            break
    
    if not target_table:
        print("❌ Таблица с цветами не найдена!")
        print("\nДоступные таблицы:")
        for table in tables:
            print(f"  - {table[0]}")
            cursor.execute(f"PRAGMA table_info({table[0]})")
            for col in cursor.fetchall():
                print(f"    {col[1]} ({col[2]})")
        return
    
    # 2. Показываем структуру таблицы
    print(f"\n📋 СТРУКТУРА ТАБЛИЦЫ '{target_table}':")
    cursor.execute(f"PRAGMA table_info({target_table})")
    for col in cursor.fetchall():
        col_id, col_name, col_type, not_null, default_val, pk = col
        print(f"  {col_name:15} ({col_type:10})", end="")
        if pk: print(" [PRIMARY KEY]", end="")
        if not_null: print(" [NOT NULL]", end="")
        print()
    
    # 3. Считаем сколько записей
    cursor.execute(f"SELECT COUNT(*) FROM {target_table}")
    total = cursor.fetchone()[0]
    print(f"\n📊 Всего записей: {total}")
    
    # 4. Проверяем flower_type_id
    print(f"\n🎯 ПРОВЕРКА flower_type_id:")
    
    # Уникальные значения flower_type_id
    cursor.execute(f"SELECT DISTINCT flower_type_id FROM {target_table} ORDER BY flower_type_id")
    unique_types = cursor.fetchall()
    
    print(f"  Уникальных типов: {len(unique_types)}")
    print(f"  Значения: {[t[0] for t in unique_types]}")
    
    # Распределение по типам
    cursor.execute(f"""
        SELECT flower_type_id, COUNT(*) as count
        FROM {target_table}
        GROUP BY flower_type_id
        ORDER BY flower_type_id
    """)
    
    print("\n  📈 Распределение по типам:")
    type_stats = cursor.fetchall()
    for type_id, count in type_stats:
        percentage = (count / total * 100) if total > 0 else 0
        print(f"    Тип {type_id:3}: {count:4} цветов ({percentage:.1f}%)")
    
    # 5. Показываем первые 15 цветов с их типами
    print(f"\n🌷 ПЕРВЫЕ 15 ЦВЕТОВ:")
    cursor.execute(f"""
        SELECT id, name, colour, flower_type_id, preview_x, preview_y
        FROM {target_table}
        ORDER BY name
        LIMIT 15
    """)
    
    print(f"{'ID':<5} {'Название':<25} {'Цвет':<6} {'Тип':<6} {'preview_x':<10} {'preview_y':<10}")
    print("-" * 70)
    
    for row in cursor.fetchall():
        id_val, name, colour, flower_type_id, preview_x, preview_y = row
        print(f"{id_val:<5} {name:<25} {colour:<6} {flower_type_id:<6} {preview_x:<10} {preview_y:<10}")
    
    # 6. Проверяем, есть ли таблица flower_types
    print(f"\n🌼 ПРОВЕРКА ТАБЛИЦЫ flower_types:")
    
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%type%'")
    type_tables = cursor.fetchall()
    
    if type_tables:
        for table_name in [t[0] for t in type_tables]:
            print(f"\n  Таблица: {table_name}")
            cursor.execute(f"PRAGMA table_info({table_name})")
            
            print("  Структура:")
            for col in cursor.fetchall():
                col_id, col_name, col_type, not_null, default_val, pk = col
                print(f"    {col_name} ({col_type})")
            
            # Показываем содержимое
            cursor.execute(f"SELECT * FROM {table_name} ORDER BY id")
            print("  Содержимое:")
            for row in cursor.fetchall():
                print(f"    {row}")
    else:
        print("  ❌ Таблица с типами цветов не найдена!")
    
    conn.close()
    print("\n" + "="*80)

# Ищем файл flowers.db
def find_flowers_db():
    """Ищем файл flowers.db"""
    
    possible_paths = [
        # Текущая директория и рядом
        "flowers.db",
        "./flowers.db",
        "../flowers.db",
        
        # Внутри проекта
        "./database/flowers.db",
        "./data/flowers.db",
        "./db/flowers.db",
        "public/flowers.db",
        
        # Абсолютные пути
        os.path.join(os.getcwd(), "flowers.db"),
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            return path
    
    return None

if __name__ == "__main__":
    db_path = find_flowers_db()
    
    if db_path:
        check_flowers_db(db_path)
    else:
        print("❌ Файл flowers.db не найден!")
        print("\nИщу все .db файлы...")
        
        for root, dirs, files in os.walk('.'):
            for file in files:
                if file.endswith('.db'):
                    full_path = os.path.join(root, file)
                    print(f"Найден: {full_path}")
        
        manual_path = input("\nВведите путь к файлу БД: ").strip()
        if os.path.exists(manual_path):
            check_flowers_db(manual_path)
        else:
            print("❌ Файл не существует!")