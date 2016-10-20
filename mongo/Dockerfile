#########################################
# A custom MongoDB install on centos:7 
#########################################

FROM centos:7
MAINTAINER Xavier Gandillot <xavier@gandillot.com>

COPY mongo.repo /etc/yum.repos.d/mongo.repo

RUN yum -y update && yum -y install mongodb-org && yum clean all

RUN mkdir -p /data/db 
VOLUME /data/db/

EXPOSE 27017

CMD /usr/bin/mongod 
