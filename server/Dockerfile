FROM node:16.13.0-alpine as build

WORKDIR /server

ARG DB_URL PORT SECRET SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS
ENV DB_URL={DB_URL} PORT={PORT} SECRET={SECRET} SMTP_HOST={SMTP_HOST} SMTP_PORT={SMTP_PORT} SMTP_USER={SMTP_USER} SMTP_PASS={SMTP_PASS}

COPY . /server
ENV PHANTOMJS_VERSION=2.1.1
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
RUN apk update && apk add --no-cache fontconfig curl curl-dev && \
    cd /tmp && curl -Ls https://github.com/dustinblackman/phantomized/releases/download/${PHANTOMJS_VERSION}/dockerized-phantomjs.tar.gz | tar xz && \
    cp -R lib lib64 / && \
    cp -R usr/lib/x86_64-linux-gnu /usr/lib && \
    cp -R usr/share /usr/share && \
    cp -R etc/fonts /etc && \
    curl -k -Ls https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-${PHANTOMJS_VERSION}-linux-x86_64.tar.bz2 | tar -jxf - && \
    cp phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs

RUN npm install html-pdf -g
RUN npm link html-pdf
RUN npm link phantomjs-prebuilt
RUN npm install
CMD npm start