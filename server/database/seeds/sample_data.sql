-- Sample reloading data for testing
INSERT INTO loads (
    test_weapon, caliber,
    bullet_manufacturer, bullet_type, bullet_weight_grains,
    powder_manufacturer, powder_type, charge_weight_grains,
    primer_manufacturer, primer_type,
    case_manufacturer,
    velocity_ms, group_size_mm, distance_meters,
    notes, source
) VALUES
(
    'Huskvarna', '.222 Remington',
    'Lapua', 'FMJ', 55,
    'Norma', '200', 19.5,
    'CCI', 'SR',
    'Norma',
    881, 33, 80,
    'Excellent accuracy', 'user'
),
(
    'Tikka T3', '.308 Winchester',
    'Sierra', 'HPBT MatchKing', 168,
    'Vihtavuori', 'N140', 42.5,
    'CCI', 'BR2',
    'Lapua',
    790, 25, 100,
    'Very consistent load', 'user'
),
(
    'Sako 85', '6.5 Creedmoor',
    'Hornady', 'ELD Match', 140,
    'Hodgdon', 'H4350', 41.0,
    'Federal', '210M',
    'Hornady',
    815, 18, 100,
    'Outstanding precision', 'user'
);
