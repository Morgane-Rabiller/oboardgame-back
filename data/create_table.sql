SET client_encoding = 'UTF8';

BEGIN;

DROP TABLE IF EXISTS "user_boardgame";
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "boardgame";
DROP TYPE IF EXISTS "type";

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY NOT NULL,
    pseudo VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TYPE type AS ENUM ('Dés', 'Cartes', 'Plateau');

CREATE TABLE "boardgame" (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    player_min INT NOT NULL,
    player_max INT NOT NULL,
    time INT NOT NULL,
    age INT NOT NULL,
    type type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE "user_boardgame" (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    boardgame_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (boardgame_id) REFERENCES "boardgame"(id) ON DELETE CASCADE,
    player_min INT NOT NULL,
    player_max INT NOT NULL,
    time INT NOT NULL,
    age INT NOT NULL,
    type_game type NOT NULL
);

CREATE TABLE "passwordResetTokens" (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    token VARCHAR(150) NOT NULL,
    expiration TIMESTAMP NOT NULL
);

COMMIT;
