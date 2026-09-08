DROP VIEW IF EXISTS v_room_title_stats;

CREATE VIEW v_room_title_stats AS
SELECT 
    rt.id as id,
    rt.room_id as room_id,
    AVG(tr.value) as avg_rating,
    rt.title_name as title_name,
    rt.created_at as created_at
FROM room_titles rt
LEFT JOIN room_title_links rtl ON rtl.room_title_id = rt.id
LEFT JOIN titles t ON rtl.user_title_record_id = t.title_id
LEFT JOIN title_ratings tr ON tr.title_id = t.title_id AND tr.name = 'overall'
GROUP BY rt.id, rt.room_id, rt.title_name, rt.created_at;