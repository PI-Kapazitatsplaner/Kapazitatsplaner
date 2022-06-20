FROM harbor.suvanet.ch/rigi-intern/prisma-binaries:latest AS prisma

FROM harbor.suvanet.ch/rigi-intern/node-gallium-alpine:latest
COPY --from=prisma /query-engine /migration-engine /prisma-engines/
# specify environment variables
ENV PRISMA_QUERY_ENGINE_BINARY=/prisma-engines/query-engine \
	PRISMA_MIGRATION_ENGINE_BINARY=/prisma-engines/migration-engine \
	PRISMA_CLI_QUERY_ENGINE_TYPE=binary \
	PRISMA_CLIENT_ENGINE_TYPE=binary

WORKDIR /app
COPY package*.json ./
ADD http://swwnexusp0.suvanet.ch:18081/nexus/repository/col-general-hosted/certs/SuvaC3InternalCA1.crt /cert/
ADD http://swwnexusp0.suvanet.ch:18081/nexus/repository/col-general-hosted/certs/Suva_Proxy_ICA_1.crt /cert/

RUN npm config set cafile /cert/Suva_Proxy_ICA_1.crt --global
RUN npm config set cafile /cert/SuvaC3InternalCA1.crt --global
RUN npm config set strict-ssl false
RUN npm config set timeout 6000
RUN mkdir -p /node_modules
RUN npm config set registry https://swwnexusp0:18443/nexus/repository/npm-all/
RUN PRISMA_CLI_BINARY_TARGETS=linux-musl npm install --only=prod
RUN npm i @prisma/engines
COPY . .
#PRISMA_MIGRATION_ENGINE_BINARY=/ PRISMA_INTROSPECTION_ENGINE_BINARY=/ PRISMA_QUERY_ENGINE_LIBRARY=/ PRISMA_FMT_BINARY=/
RUN npm run setup-db
EXPOSE 3000
CMD ["npm", "start"]
