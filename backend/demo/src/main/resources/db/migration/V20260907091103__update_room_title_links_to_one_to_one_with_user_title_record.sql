
TRUNCATE TABLE room_title_links CASCADE;

ALTER TABLE room_title_links
DROP CONSTRAINT IF EXISTS uk_user_title_record_unique;

ALTER TABLE room_title_links
DROP CONSTRAINT IF EXISTS uk_user_record_room_title;

CREATE FUNCTION check_room_title_link() RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM room_title_links rtl
        JOIN titles t ON rtl.user_title_record_id = t.title_id
        JOIN titles new_t ON new_t.title_id = NEW.user_title_record_id
        WHERE rtl.room_title_id = NEW.room_title_id 
          AND t.user_id = new_t.user_id
          AND rtl.id IS DISTINCT FROM NEW.id
    ) THEN
        RAISE EXCEPTION 'Duplicate link for user and room title' USING ERRCODE = 'unique_violation';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_room_title_link
BEFORE INSERT OR UPDATE ON room_title_links
FOR EACH ROW EXECUTE FUNCTION check_room_title_link();