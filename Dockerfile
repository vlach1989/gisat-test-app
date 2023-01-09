FROM python:slim

WORKDIR /srv/www/app

COPY ./build/ ./

EXPOSE 9000

CMD ["python", "-m", "http.server", "9000"]