CREATE EXTENSION "timescaledb" CASCADE;


SELECT * FROM create_hypertable(
  '"Ephemeris"',
  'Epoch',
  partitioning_column => 'ID',
  number_partitions => 4
);