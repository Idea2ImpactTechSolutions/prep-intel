import time
import os
from pypeds import ipeds
from sqlalchemy import create_engine, select, Table, MetaData, func

db_username = os.environ['DB_USERNAME']
db_password = os.environ['DB_PASSWORD']
db_host = os.environ['DB_HOST']
db_name = os.environ['DB_NAME']
db_port = os.environ['DB_PORT']
postgres_table_name = os.environ['TARGET_POSTGRES_TABLE']

if __name__ == '__main__':
    print('PYPEDS Import')

    # Create the database engine
    engine = create_engine(f'postgresql://{db_username}:{db_password}@{db_host}:{db_port}/{db_name}')
    connection = engine.connect()

    # Reflect the table or view from the database
    metadata = MetaData()
    target_table = Table(postgres_table_name, metadata, autoload_with=engine)

    # Choose a column to count (for example, 'id')
    column_to_count = target_table.c.UNITID

    # Query the table and count the records in the specified column
    stmt = select(func.count(column_to_count)).select_from(target_table)
    record_count = connection.execute(stmt).scalar()
    connection.close()

    if record_count <= 0:
        print(f'Table {postgres_table_name} is empty, Starting import...')

        print(" 1. Collecting IPEDS archives")
        # YEARS = [2019,2020]
        YEARS = [2020]
        hd = ipeds.HD(years=YEARS)
        print(f"\n 2. Extracting HD for {YEARS}")
        hd.extract()
        df = hd.load()
        print(df)

        # Push DataFrame to postgres
        print(f"\n 3. Push DataFrame to postgres")
        df.to_sql(postgres_table_name, engine, if_exists='replace', index=False)
        print()
        print("Import complete")
    else:
        print(f"Table {postgres_table_name} contains {record_count} records, skipping pypeds import")

    # Useful for debugging, to keep the container open, allowing for terminal
    # access and debugging
    # time.sleep(150)