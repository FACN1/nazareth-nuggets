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
  author VARCHAR(30) NOT NULL
);

INSERT INTO nuggets (lat,long,category,title,description,img_url,author)
VALUES (100, 100, 'food', 'bigwave', 'tsunami', null, 'me');

COMMIT;
