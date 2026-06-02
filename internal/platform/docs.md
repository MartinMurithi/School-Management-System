# Platform Module Documentation Overview

The Platform module is responsible for managing the SaaS system itself.

It does not handle school operations such as students, fees, attendance, or exams.

Instead, it manages:

Schools (tenants)
Plans (pricing + feature packages)
Subscriptions (what each school is paying for)
Modules (features that can be enabled or disabled)
Provisioning (setting up a new school in the system)

## Core Responsibility

The Platform module answers this question:

“Who is using the system, what are they allowed to use, and how is their environment created?”

### Key Concepts
#### 1. Tenant (School)

A **tenant** represents a school using the system.

Each school is fully isolated logically using a tenant_id.

A tenant is just an identity record.
It does **NOT** contain students, fees, or academic data.

#### 2. Plan
Plans are created and managed inside Platform.

A plan defines:

What a school is allowed to use in the system.

Example Plans:
1. Basic Plan
2. Standard Plan
3. Premium Plan

A plan contains:
1. Price (monthly or yearly)
2. Allowed modules
3. Feature limits (optional)
4. SMS limits (optional)

Example: 
1. Plan	Modules Included
2. Basic	SIS only
3. Standard	SIS + Attendance
4. Premium	SIS + Finance + Attendance + Academics

Important Rule

A plan is a ***TEMPLATE***.
It does not belong to a school directly.

#### 3. Subscription

A subscription is a school using a specific plan.

Example

Green Valley School → Premium Plan → Active

Subscription contains:
1. Plan reference
2. Start date
3. End date (if applicable)
4. Status (active, expired, suspended)

***Important Rule***
Changing a plan updates a subscription, NOT the plan itself.

#### 4. Module Registry

Modules are the features of the system.

##### Example Modules
1. SIS (Student Information System)
2. Finance
3. Attendance
4. Academics
5. Communication
6. Boarding

***Purpose***
The module registry defines:

What features exist in the platform and can be enabled per school.

***Module Rules***
Each module can be:
1. Enabled
2. Disabled
3. Restricted by plan

****Example****
Premium plan:
Finance → enabled
Boarding → enabled

Basic plan:

Finance → disabled

#### 5. Provisioning Engine
Provisioning is the process of setting up a new school in the system.

****What it does****
When a new school is created, the system automatically:

1. Creates tenant record
2. Assigns a plan
3. Creates subscription
4. Enables modules based on plan
5. Creates default admin user
6. Initializes system settings

***Provisioning is NOT:***
Not student creation
Not academic setup
Not finance setup

****It is ONLY system setup.****
****Provisioning States****
1. PENDING	Request received
2. IN_PROGRESS	Setup running
3. ACTIVE	School is ready
4. FAILED	Setup failed


### Platform Module Structure
#### internal/platform/
***Domain Layer***
Contains core business rules for platform management.

Domain includes:
1. Tenant rules
2. Plan rules
3. Subscription rules
4. Module definitions
5. Provisioning state rules
6. Application Layer

***Infrastructure Layer***
Handles external systems and database access.
It includes:
1. Database repositories
2. Event publishing (NATS)
3. External billing integrations (future)
4. HTTP Interface Layer

***Interfaces/http/***
Example APIs
***Tenant APIs***
2. Create tenant
3. Get tenant
4. Suspend tenant
***Plan APIs***
1. Create plan
2. List plans
3. Update plan
4. Subscription APIs
5. Assign plan to tenant
6. Change subscription status

### Platform Workflows
1. Create School Workflow
    1. Admin sends request: Create School
    2. System creates tenant record
    3. System assigns default plan
    4. System creates subscription
    5. System enables modules based on plan
    6. System creates admin user
    7. School becomes ACTIVE

2. Change Plan Workflow
Step 1

Admin selects new plan

Step 2

System updates subscription

Step 3

System recalculates enabled modules

Step 4

System updates access rights

3. Suspend School Workflow
Step 1

Platform marks tenant as suspended

Step 2

All logins are blocked

Step 3

Modules remain intact but inactive

🔐 Important Rules
Rule 1: Platform is NOT school logic

Platform must NEVER handle:

Students
Exams
Attendance rules
Fee calculations
Rule 2: Plans are immutable templates

Once created:

Plans should not change frequently
Changes should create new versions (optional later)
Rule 3: Tenant isolation is mandatory

Every operation must respect:

tenant_id

No exceptions.

Rule 4: Provisioning is asynchronous (recommended)

Provisioning is handled via background jobs to avoid timeouts.

### Summary
The Platform module is responsible for:
1. Tenants (schools)
2. Plans (what is offered)
3. Subscriptions (what is purchased)
4. Modules (what is enabled)
5. Provisioning (system setup automation)

Think of Platform as the control panel

Not the school itself.