-- v1.2 amendment: character-application narrative fields are optional.
-- Safe to run repeatedly against PostgreSQL.

BEGIN;

ALTER TABLE game.character_applications
    DROP CONSTRAINT IF EXISTS ck_ca_appearance_len,
    DROP CONSTRAINT IF EXISTS ck_ca_personality_len,
    DROP CONSTRAINT IF EXISTS ck_ca_strengths_len,
    DROP CONSTRAINT IF EXISTS ck_ca_weaknesses_len,
    DROP CONSTRAINT IF EXISTS ck_ca_likes_len,
    DROP CONSTRAINT IF EXISTS ck_ca_dislikes_len,
    DROP CONSTRAINT IF EXISTS ck_ca_biography_len;

COMMIT;
