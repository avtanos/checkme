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
        # Грузовые машины (cargo)
        ServiceProvider(
            name="Грузоперевозки 'Быстрый'",
            category="cargo",
            description="Профессиональные грузоперевозки по Бишкеку и области. Грузчики, упаковка, страховка. Работаем с 8:00 до 20:00.",
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
        # Дополнительные провайдеры для большего разнообразия
        ServiceProvider(
            name="Грузоперевозки 'Ташкент'",
            category="cargo",
            description="Международные перевозки в Узбекистан. Таможенное оформление. Быстро и надежно.",
            latitude=42.8500,
            longitude=74.6000,
            phone="+996 (312) 111-22-33",
            email="tashkent@cargo.kg",
            address="г. Бишкек, ул. Ахунбаева, д. 200",
            photo="https://images.unsplash.com/photo-1601581875036-9e7e1c0c0b5e?w=800"
        ),
        ServiceProvider(
            name="Сантехник 'Ак-Суу'",
            category="plumber",
            description="Услуги сантехника в Ак-Суу. Установка и ремонт водопровода, канализации.",
            latitude=42.5000,
            longitude=78.6000,
            phone="+996 (3922) 11-22-33",
            email="aksuu@plumber.kg",
            address="с. Ак-Суу, Иссык-Кульская область",
            photo="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"
        ),
        ServiceProvider(
            name="Эвакуатор 'Чолпон-Ата'",
            category="tow_truck",
            description="Эвакуация на Иссык-Куле. Работаем в Чолпон-Ате и окрестностях. Круглосуточно.",
            latitude=42.6500,
            longitude=77.0833,
            phone="+996 (3943) 22-33-44",
            email="cholpon@tow.kg",
            address="г. Чолпон-Ата, Иссык-Кульская область",
            photo="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ),
        ServiceProvider(
            name="Электрик 'Нарын'",
            category="electrician",
            description="Электромонтажные работы в Нарыне. Установка освещения, ремонт электропроводки.",
            latitude=41.4333,
            longitude=75.9833,
            phone="+996 (3522) 33-44-55",
            email="naryn@electric.kg",
            address="г. Нарын, ул. Ленина, д. 45",
            photo="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
        ),
        ServiceProvider(
            name="Грузоперевозки 'Талас'",
            category="cargo",
            description="Перевозка грузов в Таласе и области. Доставка мебели, техники, стройматериалов.",
            latitude=42.5167,
            longitude=72.2333,
            phone="+996 (3422) 44-55-66",
            email="talas@cargo.kg",
            address="г. Талас, ул. Манаса, д. 78",
            photo="https://images.unsplash.com/photo-1601581875036-9e7e1c0c0b5e?w=800"
        ),
        ServiceProvider(
            name="Сантехник 'Баткен'",
            category="plumber",
            description="Услуги сантехника в Баткене. Ремонт и установка сантехники. Гарантия качества.",
            latitude=40.0500,
            longitude=70.8167,
            phone="+996 (3622) 55-66-77",
            email="batken@plumber.kg",
            address="г. Баткен, ул. Абдыкадырова, д. 12",
            photo="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"
        ),
        ServiceProvider(
            name="Эвакуатор 'Кызыл-Кия'",
            category="tow_truck",
            description="Эвакуация автомобилей в Кызыл-Кие. Быстрый выезд. Доступные цены.",
            latitude=39.7167,
            longitude=72.0667,
            phone="+996 (3733) 66-77-88",
            email="kyzylkia@tow.kg",
            address="г. Кызыл-Кия, Баткенская область",
            photo="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ),
        ServiceProvider(
            name="Электрик 'Кара-Балта'",
            category="electrician",
            description="Электромонтажные работы в Кара-Балте. Установка счетчиков, замена проводки.",
            latitude=42.8167,
            longitude=73.8500,
            phone="+996 (3131) 77-88-99",
            email="karabalta@electric.kg",
            address="г. Кара-Балта, Чуйская область",
            photo="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
        ),
        ServiceProvider(
            name="Грузоперевозки 'Кант'",
            category="cargo",
            description="Перевозка грузов в Канте и окрестностях. Грузчики, упаковка, страховка.",
            latitude=42.8833,
            longitude=74.8500,
            phone="+996 (3132) 88-99-00",
            email="kant@cargo.kg",
            address="г. Кант, Чуйская область",
            photo="https://images.unsplash.com/photo-1601581875036-9e7e1c0c0b5e?w=800"
        ),
        ServiceProvider(
            name="Сантехник 'Токмок'",
            category="plumber",
            description="Услуги сантехника в Токмоке. Профессиональный ремонт сантехники. Работаем с 9:00 до 18:00.",
            latitude=42.8333,
            longitude=75.2833,
            phone="+996 (3133) 99-00-11",
            email="tokmok@plumber.kg",
            address="г. Токмок, Чуйская область",
            photo="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"
        ),
        ServiceProvider(
            name="Эвакуатор 'Балыкчы'",
            category="tow_truck",
            description="Эвакуация на Иссык-Куле. Работаем в Балыкчы и прибрежных зонах.",
            latitude=42.4667,
            longitude=76.1833,
            phone="+996 (3944) 00-11-22",
            email="balykchy@tow.kg",
            address="г. Балыкчы, Иссык-Кульская область",
            photo="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ),
        ServiceProvider(
            name="Электрик 'Каракол Про'",
            category="electrician",
            description="Профессиональные электромонтажные работы в Караколе. Большой опыт, гарантия.",
            latitude=42.4907,
            longitude=78.3936,
            phone="+996 (3922) 11-33-55",
            email="karakolpro@electric.kg",
            address="г. Каракол, ул. Ленина, д. 90",
            photo="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
        ),
        ServiceProvider(
            name="Грузоперевозки 'Узген'",
            category="cargo",
            description="Перевозка грузов в Узгене и Ошской области. Надежно и в срок.",
            latitude=40.7667,
            longitude=73.3000,
            phone="+996 (3233) 22-44-66",
            email="uzgen@cargo.kg",
            address="г. Узген, Ошская область",
            photo="https://images.unsplash.com/photo-1601581875036-9e7e1c0c0b5e?w=800"
        ),
        ServiceProvider(
            name="Сантехник 'Кара-Суу'",
            category="plumber",
            description="Услуги сантехника в Кара-Суу. Быстрый выезд, качественный ремонт.",
            latitude=40.7000,
            longitude=72.8667,
            phone="+996 (3223) 33-55-77",
            email="karasuu@plumber.kg",
            address="г. Кара-Суу, Ошская область",
            photo="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"
        ),
        ServiceProvider(
            name="Эвакуатор 'Сулюкта'",
            category="tow_truck",
            description="Эвакуация автомобилей в Сулюкте. Работаем круглосуточно. Низкие цены.",
            latitude=39.9333,
            longitude=69.5667,
            phone="+996 (3744) 44-66-88",
            email="sulukta@tow.kg",
            address="г. Сулюкта, Баткенская область",
            photo="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ),
        ServiceProvider(
            name="Электрик 'Майлуу-Суу'",
            category="electrician",
            description="Электромонтажные работы в Майлуу-Суу. Установка и ремонт электрооборудования.",
            latitude=41.2667,
            longitude=72.4667,
            phone="+996 (3745) 55-77-99",
            email="mailuusuu@electric.kg",
            address="г. Майлуу-Суу, Джалал-Абадская область",
            photo="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
        ),
        ServiceProvider(
            name="Грузоперевозки 'Кочкор-Ата'",
            category="cargo",
            description="Перевозка грузов в Кочкор-Ате. Грузовики разной грузоподъемности. Грузчики в подарок.",
            latitude=41.0333,
            longitude=72.4833,
            phone="+996 (3746) 66-88-00",
            email="kochkorata@cargo.kg",
            address="г. Кочкор-Ата, Джалал-Абадская область",
            photo="https://images.unsplash.com/photo-1601581875036-9e7e1c0c0b5e?w=800"
        ),
        ServiceProvider(
            name="Сантехник 'Таш-Кумыр'",
            category="plumber",
            description="Услуги сантехника в Таш-Кумыре. Профессиональный подход, гарантия качества.",
            latitude=41.3500,
            longitude=72.2167,
            phone="+996 (3747) 77-99-11",
            email="tashkumyr@plumber.kg",
            address="г. Таш-Кумыр, Джалал-Абадская область",
            photo="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"
        ),
        ServiceProvider(
            name="Эвакуатор 'Караван'",
            category="tow_truck",
            description="Эвакуация по всему Кыргызстану. Междугородние перевозки. Работаем 24/7.",
            latitude=42.8700,
            longitude=74.6000,
            phone="+996 (312) 200-30-40",
            email="karavan@tow.kg",
            address="г. Бишкек, ул. Абдымомунова, д. 300",
            photo="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ),
        ServiceProvider(
            name="Электрик 'Свет'",
            category="electrician",
            description="Электромонтажные работы любой сложности. Установка освещения, ремонт проводки. Бишкек и область.",
            latitude=42.8750,
            longitude=74.5750,
            phone="+996 (312) 300-40-50",
            email="svet@electric.kg",
            address="г. Бишкек, ул. Московская, д. 150",
            photo="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
        ),
        ServiceProvider(
            name="Грузоперевозки 'Алматы Экспресс'",
            category="cargo",
            description="Международные перевозки в Казахстан. Таможенное оформление. Быстрая доставка.",
            latitude=42.8800,
            longitude=74.5800,
            phone="+996 (312) 400-50-60",
            email="almaty@cargo.kg",
            address="г. Бишкек, ул. Логвиненко, д. 250",
            photo="https://images.unsplash.com/photo-1601581875036-9e7e1c0c0b5e?w=800"
        ),
        ServiceProvider(
            name="Сантехник 'Ак-Талаа'",
            category="plumber",
            description="Услуги сантехника в Ак-Талаа. Установка и ремонт сантехники. Работаем с 8:00 до 20:00.",
            latitude=41.2833,
            longitude=72.9000,
            phone="+996 (3748) 88-00-22",
            email="aktalaa@plumber.kg",
            address="с. Ак-Талаа, Джалал-Абадская область",
            photo="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"
        ),
        ServiceProvider(
            name="Эвакуатор 'Бишкек-Сервис'",
            category="tow_truck",
            description="Эвакуация в Бишкеке и области. Приедем в течение 30 минут. Круглосуточно.",
            latitude=42.8746,
            longitude=74.5698,
            phone="+996 (312) 500-60-70",
            email="bishkekservice@tow.kg",
            address="г. Бишкек, ул. Чуй, д. 400",
            photo="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ),
        ServiceProvider(
            name="Электрик 'Ток'",
            category="electrician",
            description="Электромонтажные работы в Бишкеке. Установка розеток, выключателей, ремонт проводки.",
            latitude=42.8600,
            longitude=74.5700,
            phone="+996 (312) 600-70-80",
            email="tok@electric.kg",
            address="г. Бишкек, ул. Токтогула, д. 500",
            photo="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
        ),
        ServiceProvider(
            name="Грузоперевозки 'Ош-Бишкек'",
            category="cargo",
            description="Междугородние перевозки Ош-Бишкек. Регулярные рейсы. Доставка в срок.",
            latitude=40.5150,
            longitude=72.8081,
            phone="+996 (3222) 50-60-70",
            email="oshbishkek@cargo.kg",
            address="г. Ош, ул. Ленина, д. 200",
            photo="https://images.unsplash.com/photo-1601581875036-9e7e1c0c0b5e?w=800"
        ),
        ServiceProvider(
            name="Сантехник 'Джалал-Абад Мастер'",
            category="plumber",
            description="Профессиональные услуги сантехника в Джалал-Абаде. Большой опыт, гарантия качества.",
            latitude=40.9333,
            longitude=72.9833,
            phone="+996 (3722) 60-70-80",
            email="jalalabadmaster@plumber.kg",
            address="г. Джалал-Абад, ул. Токтогула, д. 100",
            photo="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"
        ),
        ServiceProvider(
            name="Эвакуатор 'Иссык-Куль'",
            category="tow_truck",
            description="Эвакуация на Иссык-Куле. Работаем по всему побережью. Круглосуточный сервис.",
            latitude=42.6500,
            longitude=77.0833,
            phone="+996 (3943) 70-80-90",
            email="issykul@tow.kg",
            address="г. Чолпон-Ата, Иссык-Кульская область",
            photo="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ),
        ServiceProvider(
            name="Электрик 'Нарын Энерго'",
            category="electrician",
            description="Электромонтажные работы в Нарыне. Установка счетчиков, замена проводки, ремонт.",
            latitude=41.4333,
            longitude=75.9833,
            phone="+996 (3522) 80-90-00",
            email="narynenergo@electric.kg",
            address="г. Нарын, ул. Ленина, д. 150",
            photo="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
        ),
    ]
    
    for provider in test_providers:
        db.add(provider)
    
    db.commit()
    print(f"Создано {len(test_providers)} тестовых провайдеров.")
    db.close()

if __name__ == "__main__":
    init_test_data()

