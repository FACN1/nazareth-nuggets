BEGIN;

DROP TABLE IF EXISTS nuggets;

CREATE TABLE nuggets(
  id SERIAL PRIMARY KEY,
  x_coordinate INTEGER NOT NULL,
  y_coordinate INTEGER NOT NULL,
  category VARCHAR(20) NOT NULL,
  title VARCHAR(30) NOT NULL,
  description TEXT,
  img_url TEXT,
  author VARCHAR(15) NOT NULL
)

COMMIT;
