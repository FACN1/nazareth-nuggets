BEGIN;

DROP TABLE IF EXISTS nuggets;

CREATE TABLE nuggets(
  id SERIAL PRIMARY KEY,
  lat DOUBLE PRECISION NOT NULL,
  long DOUBLE PRECISION NOT NULL,
  category VARCHAR(30) NOT NULL,
  title VARCHAR(50) NOT NULL,
  description TEXT,
  img_url VARCHAR(100),
  author VARCHAR(30) NOT NULL,
  timestamp timestamp default current_timestamp
);

INSERT INTO nuggets (lat, long, category, title, description, img_url, author)
VALUES (32.699, 35.303, 'food', 'Al Waked', 'A great shwarma place and a great cheeky shwarma', null, 'Elias');

COMMIT;
