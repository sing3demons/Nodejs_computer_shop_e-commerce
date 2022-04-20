# FROM node:12.18.1

# WORKDIR /usr/app

# COPY ["package.json", "package-lock.json*", "./"]

# RUN npm install --production

# COPY ./ ./ 

# CMD ["npm","start"]

FROM node:12.18.1 as build

LABEL description="This is a multi-stage NodeJS image"
WORKDIR /src
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .

FROM node:12.18.1-slim
WORKDIR /src 
COPY --from=build /src .
EXPOSE 8080
CMD ["npm", "start"]


# docker build . -t nodejs:1.0 [nametag]:[versiontag]
# -t คือ กำหนด tag ถ้าไม่กำหนด tag มันคือ default
# docker run -p 2000:4000 [nametag]:[versiontag]

# docker run -it --rm -d -p 27017:27017 --name nodejs-mongo mongo:latest
# docker build -t combuy:0.1 .
# docker run -it --rm -d -p 3000:3000 --env-file ./.env --link nodejs-mongo:db  --name nodejs-combuy combuy:0.2