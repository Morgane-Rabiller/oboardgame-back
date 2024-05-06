SET client_encoding = 'UTF8';

BEGIN;

-- DROP TABLE IF EXISTS "user";
-- DROP TABLE IF EXISTS "boardgame";
-- DROP TABLE IF EXISTS "user_boardgame";

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY NOT NULL,
    pseudo VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TYPE type AS ENUM ('Dés', 'Cartes', 'Plateau');

CREATE TABLE "boardgame" (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    player_min INT NOT NULL,
    player_max INT NOT NULL,
    time INT NOT NULL,
    age INT NOT NULL,
    type type NOT NULL
);

CREATE TABLE "user_boardgame" (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    boardgame_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (boardgame_id) REFERENCES "boardgame"(id),
    player_min INT NOT NULL,
    player_max INT NOT NULL,
    time INT NOT NULL,
    age INT NOT NULL,
    type_game type NOT NULL
);

COMMIT;
