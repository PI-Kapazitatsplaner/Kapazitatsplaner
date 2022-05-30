FROM harbor.suvanet.ch/rigi-intern/node-gallium-alpine:V1
WORKDIR /app
COPY package*.json ./
ADD http://swwnexusp0.suvanet.ch:18081/nexus/repository/col-general-hosted/certs/SuvaC3InternalCA1.crt /cert/
ADD http://swwnexusp0.suvanet.ch:18081/nexus/repository/col-general-hosted/certs/Suva_Proxy_ICA_1.crt /cert/

RUN npm config set cafile /cert/Suva_Proxy_ICA_1.crt --global
RUN npm config set strict-ssl false
RUN npm config set timeout 6000
RUN mkdir -p /node_modules
RUN npm config set registry https://swwnexusp0:18443/nexus/repository/npm-all/
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
