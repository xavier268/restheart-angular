#####################################################
# Serve custom aot client files from the container  #
#          (c) Xavier Gandillot                     #
#####################################################

FROM node:latest
MAINTAINER Xavier Gandillot <xavier@gandillot.com>

RUN npm install http-server -g

# Copy fixed assets into "html" folder
COPY *.html  /html/
COPY *.css   /html/
COPY *.ico   /html/
COPY dist/   /html/dist/

EXPOSE 8080

CMD http-server /html/
