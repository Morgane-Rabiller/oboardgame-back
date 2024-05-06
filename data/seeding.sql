SET client_encoding = 'UTF8';

INSERT INTO "user" (pseudo, email, password) VALUES
('Mogo', 'morganerabiller@yahoo.fr', 'password');

INSERT INTO "boardgame" (name, player_min, player_max, time, age, type) VALUES
('Deadlies', 2, 5, 30, 8, 'Cartes'),
('SubTerra', 1, 5, 60, 14, 'Plateau'),
('Zombicide', 1, 6, 60, 13, 'Plateau'),
('Smile life', 2, 6, 60, 12, 'Cartes'),
('Cerbere', 3, 6, 45, 10, 'Plateau'),
('Le règne de Cthulhu', 2, 4, 60, 14, 'Plateau'),
('Aeon s end', 1, 4, 60, 14, 'Cartes'),
('Mille sabords', 2, 5, 30, 8, 'Dés'),
('Peur primate', 2, 6, 60, 12, 'Cartes'),
('The loop', 1, 4, 60, 12, 'Plateau');