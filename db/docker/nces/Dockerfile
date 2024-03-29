FROM python:latest
WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt
CMD ./wait-for-it.sh "$DB_HOST:$DB_PORT" -- python -u pypeds_import.py