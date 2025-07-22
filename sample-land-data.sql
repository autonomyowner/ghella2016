-- Sample Land Marketplace Data for Elghella Agritech Platform
-- This script creates realistic sample data for the agricultural land marketplace

-- First, create users (required for profiles foreign key)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'ahmed.benali@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"أحمد بن علي","phone":"+213 555 123 456"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440002', 'fatima.meziane@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"فاطمة مزين","phone":"+213 555 234 567"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440003', 'mohammed.ouled@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"محمد ولد","phone":"+213 555 345 678"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440004', 'aicha.toumi@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"عائشة تومي","phone":"+213 555 456 789"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440005', 'brahim.khelifi@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"براهيم خليفي","phone":"+213 555 567 890"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440006', 'nadia.bouazza@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"نادية بوعزة","phone":"+213 555 678 901"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440007', 'youssef.hamidi@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"يوسف حميدي","phone":"+213 555 789 012"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440008', 'samira.benchaabane@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"سميرة بن شعبان","phone":"+213 555 890 123"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440009', 'karim.mansouri@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"كريم منصوري","phone":"+213 555 901 234"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440010', 'leila.benmoussa@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"ليلى بن موسى","phone":"+213 555 012 345"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440011', 'omar.belhadj@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"عمر بلحاج","phone":"+213 555 123 456"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440012', 'amina.chaouch@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"أمينة شاوش","phone":"+213 555 234 567"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440013', 'hassan.benyoucef@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"حسن بن يوسف","phone":"+213 555 345 678"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440014', 'zineb.boukhari@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"زينب بخاري","phone":"+213 555 456 789"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440015', 'adil.benrahma@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"عادل بن رحمة","phone":"+213 555 567 890"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440016', 'souad.benali@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"سعاد بن علي","phone":"+213 555 678 901"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440017', 'rachid.benchaabane@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"رشيد بن شعبان","phone":"+213 555 789 012"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440018', 'malika.benmoussa@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"مالكة بن موسى","phone":"+213 555 890 123"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440019', 'tarek.belhadj@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"طارق بلحاج","phone":"+213 555 901 234"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440020', 'nawel.chaouch@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"نوال شاوش","phone":"+213 555 012 345"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440021', 'bilal.benyoucef@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"بلال بن يوسف","phone":"+213 555 123 456"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440022', 'djamila.boukhari@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"جميلة بخاري","phone":"+213 555 234 567"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440023', 'reda.benrahma@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"رضا بن رحمة","phone":"+213 555 345 678"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440024', 'meriem.benali@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"مريم بن علي","phone":"+213 555 456 789"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440025', 'walid.benchaabane@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"وليد بن شعبان","phone":"+213 555 567 890"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440026', 'sarah.benmoussa@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"سارة بن موسى","phone":"+213 555 678 901"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440027', 'anis.belhadj@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"أنيس بلحاج","phone":"+213 555 789 012"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440028', 'hafsa.chaouch@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"حفصة شاوش","phone":"+213 555 890 123"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440029', 'aymen.benyoucef@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"أيمن بن يوسف","phone":"+213 555 901 234"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440030', 'khadija.boukhari@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"خديجة بخاري","phone":"+213 555 012 345"}', false, '', '', '', '');

-- Now create profiles (after users exist)
INSERT INTO public.profiles (id, full_name, avatar_url, phone, address, city, state, country, bio, website, company_name, user_type, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'أحمد بن علي', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '+213 555 123 456', 'حي القبة، شارع الأمير عبد القادر', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مزارع محترف مع 15 سنة خبرة في زراعة الحبوب والخضروات. متخصص في الزراعة العضوية والري الذكي.', 'www.ahmed-farm.dz', 'مزرعة أحمد العضوية', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'فاطمة مزين', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '+213 555 234 567', 'حي باب الوادي، شارع الشهداء', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'خبيرة في زراعة الفواكه والتمور. أملك مزرعة تمور في بسكرة وأبحث عن شركاء للتصدير.', 'www.fatima-dates.dz', 'مزرعة فاطمة للتمور', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'محمد ولد', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '+213 555 345 678', 'حي القصبة، شارع علي بومنجل', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مستثمر في الأراضي الزراعية. أبحث عن أراضي خصبة للاستثمار في مشاريع زراعية حديثة.', '', 'مجموعة محمد للاستثمارات', 'buyer', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'عائشة تومي', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '+213 555 456 789', 'حي بولوغين، شارع محمد بوضياف', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مهندسة زراعية متخصصة في تكنولوجيا الزراعة الحديثة. أساعد المزارعين في تحسين إنتاجيتهم.', 'www.aicha-agro.dz', 'مكتب عائشة للاستشارات الزراعية', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'براهيم خليفي', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', '+213 555 567 890', 'حي الحراش، شارع الشهداء', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مزارع شاب متحمس للزراعة العضوية. أزرع الخضروات والفواكه الطازجة للأسواق المحلية.', '', 'مزرعة براهيم العضوية', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'نادية بوعزة', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', '+213 555 678 901', 'حي باب الزوار، شارع أحمد بن بلة', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'متخصصة في زراعة الزيتون وإنتاج زيت الزيتون البكر الممتاز. مزرعة عائلية منذ 3 أجيال.', 'www.nadia-olive.dz', 'مزرعة نادية للزيتون', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'يوسف حميدي', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '+213 555 789 012', 'حي القبة، شارع الأمير عبد القادر', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مستثمر في مجال التصدير الزراعي. أبحث عن منتجات عالية الجودة للتصدير إلى الأسواق الأوروبية.', 'www.youssef-export.dz', 'شركة يوسف للتصدير', 'buyer', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'سميرة بن شعبان', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '+213 555 890 123', 'حي بولوغين، شارع محمد بوضياف', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'متخصصة في زراعة الأعشاب الطبية والنباتات العطرية. منتجات طبيعية 100% للاستخدام الطبي والتجميلي.', 'www.samira-herbs.dz', 'مزرعة سميرة للأعشاب', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'كريم منصوري', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '+213 555 901 234', 'حي باب الوادي، شارع الشهداء', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مزارع متخصص في زراعة الحمضيات. برتقال وليمون طازج من مزرعتي في تيبازة.', '', 'مزرعة كريم للحمضيات', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'ليلى بن موسى', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '+213 555 012 345', 'حي الحراش، شارع الشهداء', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'متخصصة في الزراعة المائية والبيوت المحمية. خضروات طازجة على مدار السنة.', 'www.leila-hydroponic.dz', 'مزرعة ليلى المائية', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'عمر بلحاج', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', '+213 555 123 456', 'حي باب الزوار، شارع أحمد بن بلة', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مستثمر في مجال العقارات الزراعية. أبحث عن أراضي للشراء أو الاستئجار في مناطق مختلفة.', 'www.omar-agro.dz', 'مجموعة عمر العقارية', 'buyer', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'أمينة شاوش', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', '+213 555 234 567', 'حي القصبة، شارع علي بومنجل', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'متخصصة في تربية النحل وإنتاج العسل الطبيعي. عسل طبيعي 100% من مختلف أنواع الأزهار.', 'www.amina-honey.dz', 'مزرعة أمينة للنحل', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440013', 'حسن بن يوسف', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '+213 555 345 678', 'حي القبة، شارع الأمير عبد القادر', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مزارع متخصص في زراعة القمح والشعير. منتجات حبوب عالية الجودة للاستهلاك المحلي والتصدير.', 'www.hassan-grains.dz', 'مزرعة حسن للحبوب', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440014', 'زينب بخاري', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '+213 555 456 789', 'حي بولوغين، شارع محمد بوضياف', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'متخصصة في زراعة العنب وإنتاج النبيذ الطبيعي. عنب طازج وعصائر طبيعية.', 'www.zineb-grapes.dz', 'مزرعة زينب للعنب', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440015', 'عادل بن رحمة', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '+213 555 567 890', 'حي باب الوادي، شارع الشهداء', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مستثمر في مجال التكنولوجيا الزراعية. أبحث عن شركاء لتطوير مشاريع زراعية ذكية.', 'www.adil-smart.dz', 'شركة عادل للتكنولوجيا الزراعية', 'buyer', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440016', 'سعاد بن علي', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '+213 555 678 901', 'حي الحراش، شارع الشهداء', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'متخصصة في زراعة البطاطس والبصل. خضروات جذرية عالية الجودة من مزرعتي في تيارت.', 'www.souad-vegetables.dz', 'مزرعة سعاد للخضروات', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440017', 'رشيد بن شعبان', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', '+213 555 789 012', 'حي باب الزوار، شارع أحمد بن بلة', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مزارع متخصص في تربية الأغنام والماعز. لحوم طازجة وألبان طبيعية.', 'www.rachid-livestock.dz', 'مزرعة رشيد للماشية', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440018', 'مالكة بن موسى', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', '+213 555 890 123', 'حي القصبة، شارع علي بومنجل', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'متخصصة في زراعة الفواكه الاستوائية. مانجو وبابايا طازجة من مزرعتي في عنابة.', 'www.malika-tropical.dz', 'مزرعة ماليكا للفواكه الاستوائية', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440019', 'طارق بلحاج', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '+213 555 901 234', 'حي القبة، شارع الأمير عبد القادر', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مستثمر في مجال الأمن الغذائي. أبحث عن شراكات مع مزارعين موثوقين لتوريد المنتجات الطازجة.', 'www.tarek-food.dz', 'شركة طارق للأمن الغذائي', 'buyer', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440020', 'نوال شاوش', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '+213 555 012 345', 'حي بولوغين، شارع محمد بوضياف', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'متخصصة في زراعة البقوليات. فاصوليا وعدس وبازلاء طازجة من مزرعتي في سطيف.', 'www.nawal-legumes.dz', 'مزرعة نوال للبقوليات', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440021', 'بلال بن يوسف', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '+213 555 123 456', 'حي باب الوادي، شارع الشهداء', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مزارع متخصص في زراعة الذرة والقمح. حبوب عالية الجودة للاستهلاك المحلي والتصدير.', 'www.bilal-corn.dz', 'مزرعة بلال للذرة', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440022', 'جميلة بخاري', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '+213 555 234 567', 'حي الحراش، شارع الشهداء', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'متخصصة في زراعة البطيخ والشمام. فواكه صيفية طازجة من مزرعتي في غرداية.', 'www.djamila-melon.dz', 'مزرعة جميلة للبطيخ', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440023', 'رضا بن رحمة', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', '+213 555 345 678', 'حي باب الزوار، شارع أحمد بن بلة', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مستثمر في مجال التصدير الزراعي. أبحث عن منتجات عالية الجودة للتصدير إلى الأسواق الآسيوية.', 'www.reda-asia.dz', 'شركة رضا للتصدير الآسيوي', 'buyer', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440024', 'مريم بن علي', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', '+213 555 456 789', 'حي القصبة، شارع علي بومنجل', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'متخصصة في زراعة الأعشاب العطرية. نعناع وريحان وكزبرة طازجة للاستخدام المنزلي والمطاعم.', 'www.meriem-herbs.dz', 'مزرعة مريم للأعشاب العطرية', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440025', 'وليد بن شعبان', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '+213 555 567 890', 'حي القبة، شارع الأمير عبد القادر', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مزارع متخصص في زراعة البطاطا الحلوة واليام. خضروات جذرية مغذية من مزرعتي في تمنراست.', 'www.walid-sweet.dz', 'مزرعة وليد للبطاطا الحلوة', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440026', 'سارة بن موسى', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '+213 555 678 901', 'حي بولوغين، شارع محمد بوضياف', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'متخصصة في زراعة الفراولة والتوت. فواكه طازجة وحلوة من مزرعتي في البليدة.', 'www.sarah-berries.dz', 'مزرعة سارة للفراولة', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440027', 'أنيس بلحاج', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '+213 555 789 012', 'حي باب الوادي، شارع الشهداء', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مستثمر في مجال السياحة الزراعية. أبحث عن مزارع مناسبة لتطوير مشاريع السياحة الريفية.', 'www.anis-agrotourism.dz', 'شركة أنيس للسياحة الزراعية', 'buyer', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440028', 'حفصة شاوش', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '+213 555 890 123', 'حي الحراش، شارع الشهداء', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'متخصصة في زراعة البامية والباذنجان. خضروات طازجة من مزرعتي في معسكر.', 'www.hafsa-okra.dz', 'مزرعة حفصة للبامية', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440029', 'أيمن بن يوسف', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', '+213 555 901 234', 'حي باب الزوار، شارع أحمد بن بلة', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'مزارع متخصص في زراعة الفول السوداني والسمسم. محاصيل زيتية عالية الجودة.', 'www.aymen-peanuts.dz', 'مزرعة أيمن للفول السوداني', 'seller', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440030', 'خديجة بخاري', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', '+213 555 012 345', 'حي القصبة، شارع علي بومنجل', 'الجزائر العاصمة', 'الجزائر', 'الجزائر', 'متخصصة في زراعة الكركم والزنجبيل. توابل طبيعية طازجة للاستخدام الطبي والطهي.', 'www.khadija-spices.dz', 'مزرعة خديجة للتوابل', 'seller', NOW(), NOW());

-- Sample Land Listings for Sale
INSERT INTO land_listings (
  user_id, title, description, price, currency, listing_type, 
  area_size, area_unit, location, soil_type, water_source, 
  images, is_available, is_featured
) VALUES
-- Large Farm for Sale in Tiaret
(
  '550e8400-e29b-41d4-a716-446655440001',
  'مزرعة كبيرة للبيع في تيارت',
  'مزرعة ممتازة مساحتها 50 هكتار، تربة خصبة مناسبة لزراعة القمح والشعير. تتوفر على مصدر مياه جيد وطرق معبدة. مثالية للمستثمرين الجادين.',
  45000000,
  'DZD',
  'sale',
  50,
  'hectare',
  'تيارت',
  'تربة طينية خصبة',
  'بئر ارتوازي + قناة ري',
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'],
  true,
  true
),

-- Medium Farm for Rent in Setif
(
  '550e8400-e29b-41d4-a716-446655440002',
  'مزرعة متوسطة للإيجار في سطيف',
  'مزرعة 25 هكتار متاحة للإيجار السنوي. مناسبة لزراعة الخضروات والفواكه. تتوفر على نظام ري حديث وبيوت بلاستيكية.',
  2500000,
  'DZD',
  'rent',
  25,
  'hectare',
  'سطيف',
  'تربة رملية طينية',
  'نظام ري بالتنقيط',
  ARRAY['https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'],
  true,
  true
),

-- Small Organic Farm for Sale in Constantine
(
  '550e8400-e29b-41d4-a716-446655440003',
  'مزرعة عضوية صغيرة للبيع في قسنطينة',
  'مزرعة عضوية معتمدة مساحتها 10 هكتار. مثالية لزراعة الخضروات العضوية والفواكه. تتوفر على شهادة عضوية معتمدة.',
  18000000,
  'DZD',
  'sale',
  10,
  'hectare',
  'قسنطينة',
  'تربة عضوية غنية',
  'مياه طبيعية + نظام ري ذكي',
  ARRAY['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'],
  true,
  false
),

-- Large Farm for Rent in Oran
(
  '550e8400-e29b-41d4-a716-446655440004',
  'مزرعة كبيرة للإيجار في وهران',
  'مزرعة 80 هكتار متاحة للإيجار طويل المدى. مناسبة لزراعة الحبوب والبقوليات. تتوفر على معدات زراعية حديثة.',
  5000000,
  'DZD',
  'rent',
  80,
  'hectare',
  'وهران',
  'تربة طينية ثقيلة',
  'بئر ارتوازي + خزان مياه',
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
  true,
  true
),

-- Vineyard for Sale in Mostaganem
(
  '550e8400-e29b-41d4-a716-446655440005',
  'كرم عنب للبيع في مستغانم',
  'كرم عنب قديم مساحته 15 هكتار مع منزل ريفي. ينتج عنب عالي الجودة. يتوفر على معصرة تقليدية.',
  25000000,
  'DZD',
  'sale',
  15,
  'hectare',
  'مستغانم',
  'تربة كلسية مناسبة للعنب',
  'ري بالتنقيط + مياه جوفية',
  ARRAY['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
  true,
  false
),

-- Date Palm Farm for Sale in Algiers
(
  '550e8400-e29b-41d4-a716-446655440006',
  'مزرعة نخيل للبيع في الجزائر العاصمة',
  'مزرعة نخيل مساحتها 30 هكتار مع 500 نخلة مثمرة. تنتج تمور عالية الجودة. تتوفر على مخزن ومرافق تجهيز.',
  35000000,
  'DZD',
  'sale',
  30,
  'hectare',
  'الجزائر العاصمة',
  'تربة رملية مناسبة للنخيل',
  'نظام ري بالتنقيط + بئر ارتوازي',
  ARRAY['https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800'],
  true,
  true
),

-- Small Farm for Rent in Annaba
(
  '550e8400-e29b-41d4-a716-446655440007',
  'مزرعة صغيرة للإيجار في عنابة',
  'مزرعة 8 هكتار متاحة للإيجار السنوي. مناسبة لزراعة الخضروات الصيفية. تتوفر على بيت بلاستيكي ومرافق أساسية.',
  1200000,
  'DZD',
  'rent',
  8,
  'hectare',
  'عنابة',
  'تربة خصبة مناسبة للخضروات',
  'ري بالرش + مياه عذبة',
  ARRAY['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'],
  true,
  false
),

-- Large Farm for Sale in Batna
(
  '550e8400-e29b-41d4-a716-446655440008',
  'مزرعة كبيرة للبيع في باتنة',
  'مزرعة 100 هكتار في منطقة جبلية. مناسبة لزراعة التفاح والكرز. تتوفر على منزل ريفي ومعدات زراعية.',
  60000000,
  'DZD',
  'sale',
  100,
  'hectare',
  'باتنة',
  'تربة جبلية غنية',
  'مياه جبلية طبيعية + خزانات',
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800'],
  true,
  true
),

-- Medium Farm for Rent in Tiaret
(
  '550e8400-e29b-41d4-a716-446655440001',
  'مزرعة متوسطة للإيجار في تيارت',
  'مزرعة 35 هكتار متاحة للإيجار. مناسبة لزراعة القمح والشعير. تتوفر على جرار زراعي ومعدات أساسية.',
  3000000,
  'DZD',
  'rent',
  35,
  'hectare',
  'تيارت',
  'تربة طينية خصبة',
  'بئر ارتوازي + نظام ري',
  ARRAY['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'],
  true,
  false
),

-- Small Organic Farm for Rent in Setif
(
  '550e8400-e29b-41d4-a716-446655440002',
  'مزرعة عضوية صغيرة للإيجار في سطيف',
  'مزرعة عضوية 5 هكتار متاحة للإيجار. مثالية لزراعة الخضروات العضوية. تتوفر على شهادة عضوية.',
  800000,
  'DZD',
  'rent',
  5,
  'hectare',
  'سطيف',
  'تربة عضوية معتمدة',
  'مياه طبيعية + نظام ري عضوي',
  ARRAY['https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800'],
  true,
  false
),

-- Large Farm for Sale in Constantine
(
  '550e8400-e29b-41d4-a716-446655440003',
  'مزرعة كبيرة للبيع في قسنطينة',
  'مزرعة 120 هكتار في منطقة خصبة. مناسبة لزراعة الحبوب والبقوليات. تتوفر على منزل ريفي ومخازن.',
  75000000,
  'DZD',
  'sale',
  120,
  'hectare',
  'قسنطينة',
  'تربة طينية خصبة',
  'نظام ري شامل + خزانات مياه',
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
  true,
  true
),

-- Medium Farm for Rent in Oran
(
  '550e8400-e29b-41d4-a716-446655440004',
  'مزرعة متوسطة للإيجار في وهران',
  'مزرعة 40 هكتار متاحة للإيجار السنوي. مناسبة لزراعة الخضروات والفواكه. تتوفر على بيوت بلاستيكية.',
  3500000,
  'DZD',
  'rent',
  40,
  'hectare',
  'وهران',
  'تربة رملية طينية',
  'نظام ري بالتنقيط + مياه جوفية',
  ARRAY['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'],
  true,
  false
);

-- Add some reviews for the land listings
INSERT INTO reviews (reviewer_id, reviewed_user_id, rating, comment, listing_id, listing_type) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 5, 'مزرعة ممتازة ومالك محترم', '550e8400-e29b-41d4-a716-446655440001', 'land'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 4, 'تجربة جيدة، أرض خصبة', '550e8400-e29b-41d4-a716-446655440001', 'land'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 5, 'خدمة ممتازة وأرض مناسبة', '550e8400-e29b-41d4-a716-446655440002', 'land'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 4, 'مزرعة عضوية عالية الجودة', '550e8400-e29b-41d4-a716-446655440003', 'land');

-- Add some favorites
INSERT INTO favorites (user_id, listing_id, listing_type) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'land'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'land'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'land'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'land'); 
