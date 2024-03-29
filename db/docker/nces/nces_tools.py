import os
import sys
import argparse
import pandas as pd
import logging
from sqlalchemy import create_engine, select, Table, MetaData, func
from dotenv import load_dotenv


env_file = './.env.localdb'


def build_hd_table(path):

    full_path = os.path.abspath(path)
    # Load environment variables from .env file
    load_dotenv(dotenv_path=full_path, verbose=True)

    print('PYPEDS Import')
    db_username = os.environ['DB_USERNAME']
    db_password = os.environ['DB_PASSWORD']
    db_host = os.environ['DB_HOST']
    db_name = os.environ['DB_NAME']
    db_port = os.getenv('DB_PORT', 5432)
    postgres_table_name = os.getenv('TARGET_POSTGRES_TABLE', 'HD2021')

    # Create the database engine
    engine = create_engine(
        f'postgresql://{db_username}:{db_password}@{db_host}:{db_port}/{db_name}')

    # Read from a feather file.
    df = pd.read_feather("hd2020.feather")

    # Push DataFrame to postgres
    print(f"\n 3. Push DataFrame to postgres")
    print(df)

    df.to_sql(postgres_table_name, engine,
              if_exists='replace', index=False)
    print()
    print("Import complete")


if __name__ == '__main__':
    # Create an ArgumentParser object
    parser = argparse.ArgumentParser(
        description='Import ipeds data.')

    # Add arguments to the parser
    parser.add_argument('--data-import', '-i', action='store_true',
                        help='Import HD2021 tables into Postgres')
    parser.add_argument(
        '--env-file', help='Env file override (default: .env.localdb)')

    logging.basicConfig()
    logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

    # Parse the arguments
    args = parser.parse_args()

    if args.env_file:
        env_file = args.env_file

    if args.data_import:
        build_hd_table(env_file)

    # Check if no arguments were provided and print the help message
    if len(sys.argv) == 1:
        parser.print_help(sys.stderr)
        sys.exit(1)
