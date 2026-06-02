internal/platform/

├── domain/
│   ├── tenant/
│   ├── subscription/
│   ├── plan/
│   ├── module/
│   ├── provisioning/
│   ├── events/
│   └── errors.go
│
├── application/
│   ├── tenant/
│   │   ├── commands/
│   │   ├── queries/
│   │   └── handlers/
│   │
│   ├── subscription/
│   │   ├── commands/
│   │   ├── queries/
│   │   └── handlers/
│   │
│   ├── provisioning/
│   │   ├── commands/
│   │   ├── handlers/
│   │   └── saga/
│   │
│   └── dto/
│
├── infrastructure/
│   ├── persistence/
│   │   ├── tenant_repository.go
│   │   ├── subscription_repository.go
│   │   └── provisioning_repository.go
│   │
│   ├── messaging/
│   │   ├── publisher.go
│   │   └── events.go
│   │
│   ├── external/
│   │   └── billing_provider.go
│   │
│   └── migrations/
│
├── interfaces/
│   └── http/
│       ├── handlers/
│       │   ├── tenant_handler.go
│       │   ├── subscription_handler.go
│       │   └── provisioning_handler.go
│       │
│       ├── requests/
│       ├── responses/
│       └── routes.go
│
└── module.go