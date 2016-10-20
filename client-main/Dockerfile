###########################################
# Restheart (custom)  mongo-angular image #
#             October 14, 2016            #
#          (c) Xavier Gandillot           #
###########################################

FROM centos:7
MAINTAINER Xavier Gandillot <xavier@gandillot.com>

## define database volume
RUN mkdir -p /data/db
VOLUME /data/db/

## Grab mongo pakage repos
COPY mongo.repo /etc/yum.repos.d/mongo.repo

## Install & update packages
RUN yum -y update && \
yum -y install mongodb-org java-1.8.0-openjdk curl wget mc httpie && \
yum clean all

### Copy restheart and its config files
COPY target/restheart.jar /restheart/restheart.jar
COPY etc/  /restheart/etc/
COPY mongoscripts/ /restheart/mongoscripts/

### Esure expected files are present, even empty
RUN touch /restheart/mongoscripts/emptyscript.js && touch /restheart/etc/my_restheart.yml

# Copy fixed assets into "static" folder
COPY *.html  /restheart/static/
COPY *.css   /restheart/static/
COPY *.ico   /restheart/static/
COPY dist/   /restheart/static/dist/

EXPOSE 27017
EXPOSE 4443

### Default CMD launches everything
CMD mongod --fork --syslog  && \
sleep 3 && \
mongo $(ls /restheart/mongoscripts/*.js)  && \
java -jar /restheart/restheart.jar /restheart/etc/my_restheart.yml
