# Dockerfile
FROM python:3.11-alpine

WORKDIR /usr/src/app

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD sh -c "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"
