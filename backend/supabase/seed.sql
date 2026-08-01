-- ==========================================
-- HARVEY SEED DATA FOR SUPABASE
-- Sample initial fields and irrigation schedules
-- ==========================================

INSERT INTO public.fields (id, name, owner, crop_type, soil_type, growth_stage, area_ha, coordinates, center, last_irrigated, notes)
VALUES
  ('f-1', 'Lahan Padi Suka Maju (Blok A)', 'Pak Sukirman', 'Padi Irigasi', 'Berpasir', 'Vegetatif', 2.4, '[{"lat": -7.252, "lng": 112.765}, {"lat": -7.255, "lng": 112.768}, {"lat": -7.258, "lng": 112.764}, {"lat": -7.254, "lng": 112.761}]'::jsonb, '{"lat": -7.2547, "lng": 112.7645}'::jsonb, '2026-07-30', 'Kondisi tanah berpasir mudah kering, membutuhkan pasokan air rutin.'),
  ('f-2', 'Lahan Jagung Subur (Blok B)', 'Bu Kartini', 'Jagung Hibrida', 'Lempung Berpasir', 'Generatif', 1.8, '[{"lat": -7.260, "lng": 112.770}, {"lat": -7.263, "lng": 112.773}, {"lat": -7.265, "lng": 112.769}, {"lat": -7.261, "lng": 112.767}]'::jsonb, '{"lat": -7.2622, "lng": 112.7697}'::jsonb, '2026-07-28', 'Memasuki tahap pembungaan, sangat responsif terhadap kelembaban.'),
  ('f-3', 'Lahan Bawang Merah Makmur', 'Pak Bambang', 'Bawang Merah', 'Lempung', 'Pra-Panen', 1.2, '[{"lat": -7.245, "lng": 112.755}, {"lat": -7.248, "lng": 112.758}, {"lat": -7.250, "lng": 112.754}, {"lat": -7.246, "lng": 112.752}]'::jsonb, '{"lat": -7.2472, "lng": 112.7547}'::jsonb, '2026-07-31', 'Penyiapan menjelang panen, pengurangan volume siram.'),
  ('f-4', 'Lahan Kedelai Mandiri', 'Pak Ahmad', 'Kedelai', 'Liat', 'Generatif', 3.1, '[{"lat": -7.268, "lng": 112.775}, {"lat": -7.271, "lng": 112.778}, {"lat": -7.273, "lng": 112.774}, {"lat": -7.269, "lng": 112.772}]'::jsonb, '{"lat": -7.2702, "lng": 112.7747}'::jsonb, '2026-07-26', 'Tanah liat tahan menyimpan air namun rentan retak jika kering panjang.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.schedules (id, field_id, field_name, scheduled_date, water_volume_liters, status, notes)
VALUES
  ('sch-1', 'f-1', 'Lahan Padi Suka Maju (Blok A)', '2026-08-02', 42000, 'Dijadwalkan', 'Penyiraman pagi jam 06:00 WIB (Prioritas Kritis)'),
  ('sch-2', 'f-2', 'Lahan Jagung Subur (Blok B)', '2026-08-02', 28000, 'Dijadwalkan', 'Penyiraman sore jam 16:00 WIB'),
  ('sch-3', 'f-4', 'Lahan Kedelai Mandiri', '2026-08-03', 35000, 'Dijadwalkan', 'Penyiraman berkala')
ON CONFLICT (id) DO NOTHING;
