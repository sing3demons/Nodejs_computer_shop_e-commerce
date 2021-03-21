FROM node:10

WORKDIR /usr/app

COPY ./package.json ./
#copy file [เริ่มต้น] => [สิ้นสุด] เอาไฟล์ทั้งหมดไป
RUN npm install
COPY ./ ./ 
#หลังจาก install แล้วก็จะทำการ เริ่มโปรแกรม
CMD ["npm","start"]

# docker build . -t [nametag]:[versiontag]
# -t คือ กำหนด tag ถ้าไม่กำหนด tag มันคือ default
# docker run -p 2000:4000 [nametag]:[versiontag]