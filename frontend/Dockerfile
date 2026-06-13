FROM oven/bun:1

WORKDIR /app

COPY package.json bunfig.toml ./
RUN rm -f bun.lock && bun install

COPY . .

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080

CMD ["bun", "run", "dev", "--host"]
