FROM golang:alpine AS builder

RUN apk add --no-cache git

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/api

FROM alpine:3.21

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

COPY --from=builder /app/server .
COPY --from=builder /app/api/openapi/openapi.yaml ./api/openapi/openapi.yaml
COPY --from=builder /app/database/migrations ./database/migrations

EXPOSE 3200

CMD ["./server"]
