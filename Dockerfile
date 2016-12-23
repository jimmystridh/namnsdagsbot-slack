FROM node:7.3.0

RUN apt-get update
RUN apt-get install cron -y

RUN mkdir /app
WORKDIR /app

COPY package.json package.json  
RUN npm install  
COPY . .

ADD crontab /etc/cron.d/namnsdag
 
RUN chmod 0644 /etc/cron.d/namnsdag

VOLUME /var/log/

RUN touch /var/log/cron.log

CMD touch /var/log/cron.log && cron && tail -f /var/log/cron.log