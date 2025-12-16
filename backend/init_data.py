"""
Скрипт для создания тестовых данных
"""
from database import SessionLocal, engine, Base
from models import ServiceProvider

def init_test_data():
    # Создаем таблицы, если их еще нет
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Проверяем, есть ли уже данные
        if db.query(ServiceProvider).count() > 0:
            print("База данных уже содержит данные. Пропускаем инициализацию.")
            db.close()
            return
    except Exception as e:
        print(f"Ошибка при проверке данных: {e}")
        db.close()
        return
    
    test_providers = [
        ServiceProvider(
            name="Грузоперевозки 'Быстрый'",
            category="cargo",
            description="Профессиональные грузоперевозки по Бишкеку и области. Грузчики, упаковка, страховка.",
            latitude=42.8746,
            longitude=74.5698,
            phone="+996 (312) 123-45-67",
            email="info@fastcargo.kg",
            website="https://fastcargo.kg",
            address="г. Бишкек, ул. Чуй, д. 123",
            photo="https://images.unsplash.com/photo-1601581875036-9e7e1c0c0b5e?w=800"
        ),
        ServiceProvider(
            name="Сантехник Айбек",
            category="plumber",
            description="Услуги сантехника: установка, ремонт, замена сантехники. Работаю 24/7.",
            latitude=42.8700,
            longitude=74.5800,
            phone="+996 (312) 234-56-78",
            email="aybek@plumber.kg",
            address="г. Бишкек, ул. Советская, д. 45",
            photo="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"
        ),
        ServiceProvider(
            name="Эвакуатор 'Надежный'",
            category="tow_truck",
            description="Эвакуация автомобилей любой сложности. Работаем круглосуточно по всему Кыргызстану.",
            latitude=42.8800,
            longitude=74.6000,
            phone="+996 (312) 345-67-89",
            email="evacuator@mail.kg",
            address="г. Бишкек, пр. Чынгыза Айтматова, д. 78",
            photo="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ),
        ServiceProvider(
            name="Электрик Нурлан",
            category="electrician",
            description="Электромонтажные работы любой сложности. Гарантия на все виды работ.",
            latitude=42.8600,
            longitude=74.5500,
            phone="+996 (312) 456-78-90",
            email="nurlan@electric.kg",
            address="г. Бишкек, ул. Ибраимова, д. 56",
            photo="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
        ),
        ServiceProvider(
            name="Грузоперевозки 'Ош'",
            category="cargo",
            description="Перевозка крупногабаритных грузов. Манипулятор, кран. Работаем по югу Кыргызстана.",
            latitude=40.5150,
            longitude=72.8081,
            phone="+996 (3222) 12-34-56",
            email="cargo@osh.kg",
            address="г. Ош, ул. Ленина, д. 89",
            photo="https://images.unsplash.com/photo-1601581875036-9e7e1c0c0b5e?w=800"
        ),
        ServiceProvider(
            name="Сантехник Джалал-Абад",
            category="plumber",
            description="Услуги сантехника в Джалал-Абаде и области. Быстро, качественно, недорого.",
            latitude=40.9333,
            longitude=72.9833,
            phone="+996 (3722) 23-45-67",
            email="plumber@jalalabad.kg",
            address="г. Джалал-Абад, ул. Токтогула, д. 34",
            photo="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"
        ),
        ServiceProvider(
            name="Эвакуатор Каракол",
            category="tow_truck",
            description="Эвакуация автомобилей в Караколе и Иссык-Кульской области.",
            latitude=42.4907,
            longitude=78.3936,
            phone="+996 (3922) 34-56-78",
            email="evacuator@karakol.kg",
            address="г. Каракол, ул. Токтогула, д. 67",
            photo="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ),
        ServiceProvider(
            name="Электрик 'Молния'",
            category="electrician",
            description="Срочный вызов электрика. Установка розеток, выключателей, ремонт проводки.",
            latitude=42.8750,
            longitude=74.5750,
            phone="+996 (312) 567-89-01",
            email="lightning@electric.kg",
            address="г. Бишкек, ул. Абдымомунова, д. 12",
            photo="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
        ),
        ServiceProvider(
            name="Грузоперевозки 'Тяжеловоз'",
            category="cargo",
            description="Перевозка мебели, техники, стройматериалов. Грузчики в подарок.",
            latitude=42.8650,
            longitude=74.5600,
            phone="+996 (312) 678-90-12",
            email="heavy@cargo.kg",
            address="г. Бишкек, ул. Токтогула, д. 234",
            photo="https://images.unsplash.com/photo-1601581875036-9e7e1c0c0b5e?w=800"
        ),
        ServiceProvider(
            name="Сантехник Манас",
            category="plumber",
            description="Профессиональный сантехник с 15-летним опытом. Гарантия на все работы.",
            latitude=42.8800,
            longitude=74.5700,
            phone="+996 (312) 789-01-23",
            email="manas@plumber.kg",
            address="г. Бишкек, ул. Московская, д. 78",
            photo="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"
        ),
        ServiceProvider(
            name="Эвакуатор 'Скорость'",
            category="tow_truck",
            description="Быстрая эвакуация в течение 30 минут. Работаем 24/7 по Бишкеку.",
            latitude=42.8700,
            longitude=74.5900,
            phone="+996 (312) 890-12-34",
            email="speed@tow.kg",
            address="г. Бишкек, ул. Логвиненко, д. 45",
            photo="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ),
        ServiceProvider(
            name="Электрик Ош",
            category="electrician",
            description="Электромонтажные работы в Оше. Установка счетчиков, замена проводки.",
            latitude=40.5200,
            longitude=72.8100,
            phone="+996 (3222) 45-67-89",
            email="electric@osh.kg",
            address="г. Ош, ул. Курманжан Датка, д. 56",
            photo="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
        ),
        ServiceProvider(
            name="Грузоперевозки 'Бишкек-Экспресс'",
            category="cargo",
            description="Междугородние перевозки. Доставка по всему Кыргызстану.",
            latitude=42.8750,
            longitude=74.5800,
            phone="+996 (312) 901-23-45",
            email="express@cargo.kg",
            address="г. Бишкек, ул. Байтик Баатыра, д. 90",
            photo="https://images.unsplash.com/photo-1601581875036-9e7e1c0c0b5e?w=800"
        ),
        ServiceProvider(
            name="Сантехник 'Мастер'",
            category="plumber",
            description="Качественный ремонт сантехники. Установка ванн, унитазов, смесителей.",
            latitude=42.8600,
            longitude=74.5800,
            phone="+996 (312) 012-34-56",
            email="master@plumber.kg",
            address="г. Бишкек, ул. Жибек Жолу, д. 123",
            photo="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"
        ),
        ServiceProvider(
            name="Эвакуатор 'Помощь'",
            category="tow_truck",
            description="Эвакуация легковых и грузовых автомобилей. Низкие цены.",
            latitude=42.8500,
            longitude=74.5700,
            phone="+996 (312) 123-45-67",
            email="help@tow.kg",
            address="г. Бишкек, ул. Тыныстанова, д. 34",
            photo="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ),
        ServiceProvider(
            name="Электрик 'Профи'",
            category="electrician",
            description="Профессиональные электромонтажные работы. Большой опыт работы.",
            latitude=42.8800,
            longitude=74.5500,
            phone="+996 (312) 234-56-78",
            email="profi@electric.kg",
            address="г. Бишкек, ул. Ахунбаева, д. 67",
            photo="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
        ),
        ServiceProvider(
            name="Грузоперевозки 'Надежный'",
            category="cargo",
            description="Перевозка грузов любой сложности. Аккуратно и в срок.",
            latitude=42.8700,
            longitude=74.6000,
            phone="+996 (312) 345-67-89",
            email="reliable@cargo.kg",
            address="г. Бишкек, ул. Фрунзе, д. 145",
            photo="https://images.unsplash.com/photo-1601581875036-9e7e1c0c0b5e?w=800"
        ),
        ServiceProvider(
            name="Сантехник 'Быстрый'",
            category="plumber",
            description="Срочный вызов сантехника. Приедем в течение часа.",
            latitude=42.8650,
            longitude=74.5750,
            phone="+996 (312) 456-78-90",
            email="fast@plumber.kg",
            address="г. Бишкек, ул. Пушкина, д. 89",
            photo="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"
        ),
        ServiceProvider(
            name="Эвакуатор '24/7'",
            category="tow_truck",
            description="Круглосуточная эвакуация. Работаем без выходных.",
            latitude=42.8750,
            longitude=74.5650,
            phone="+996 (312) 567-89-01",
            email="24x7@tow.kg",
            address="г. Бишкек, ул. Манаса, д. 112",
            photo="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ),
        ServiceProvider(
            name="Электрик 'Энергия'",
            category="electrician",
            description="Электромонтажные работы любой сложности. Современное оборудование.",
            latitude=42.8550,
            longitude=74.5850,
            phone="+996 (312) 678-90-12",
            email="energy@electric.kg",
            address="г. Бишкек, ул. Исанова, д. 23",
            photo="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
        ),
        ServiceProvider(
            name="Грузоперевозки 'Тонна'",
            category="cargo",
            description="Перевозка крупногабаритных грузов. Грузовики разной грузоподъемности.",
            latitude=42.8800,
            longitude=74.5900,
            phone="+996 (312) 789-01-23",
            email="tonna@cargo.kg",
            address="г. Бишкек, ул. Раззакова, д. 156",
            photo="https://images.unsplash.com/photo-1601581875036-9e7e1c0c0b5e?w=800"
        ),
    ]
    
    for provider in test_providers:
        db.add(provider)
    
    db.commit()
    print(f"Создано {len(test_providers)} тестовых провайдеров.")
    db.close()

if __name__ == "__main__":
    init_test_data()

