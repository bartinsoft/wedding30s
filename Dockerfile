FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY dist/ ./dist/
COPY templates/ ./templates/
COPY public/ ./public/
RUN mkdir -p weddings public/uploads/tmp
EXPOSE 3000
CMD ["node", "dist/server/index.js"]
