###############################################
#    Custom restheart standalone image
###############################################


FROM centos:7
MAINTAINER Xavier Gandillot <xavier@gandillot.com>

COPY mongo.repo /etc/yum.repos.d/mongo.repo

RUN yum -y update && yum -y install mongodb-org java-1.8.0-openjdk curl wget mc httpie && yum clean all

### Copy restheart and its config files
COPY target/restheart.jar 	/restheart/restheart.jar
COPY etc/  			/restheart/etc
COPY static/                    /static

### Copy Mongo init scripts
COPY mongoscripts/		/restheart/mongoscripts

### Ensure expected configuration files are present, even empty
RUN touch /restheart/etc/my_restheart.yml && touch /restheart/mongoscripts/empty.js && touch /static/index.html

EXPOSE 4443

CMD mongo -version && java -version && mongo  --nodb $(ls restheart/mongoscripts/*.js ) && java -jar /restheart/restheart.jar /restheart/etc/my_restheart.yml
