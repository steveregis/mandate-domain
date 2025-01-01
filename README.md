"# Mandate Management System (Minimal Yet Extensible)

A **Spring Boot + Camunda + React** (or React Native) application for **bank mandate** management and **approval workflows**. This solution is a **solid foundation** for multi-sign-off approvals, featuring flexible signatories (no role hardcoding), 
threshold-based logic, and a proof-of-concept UI to validate core domain models and BPMN flows.

## 1. Project Goal & Description

### Goal

- Provide an **end-to-end** system that captures **Mandates** (authorization rules), **Signatories** (flexible user references), **Approval Rules**, and **Transactions** (amount, currency, referencing a Mandate).
- Use **Camunda BPMN** to enforce single or multi-sign-off (e.g., \`amount <= 10000\` → single, \`> 10000\` → multi-instance).
- Offer a **minimal** React (or React Native) frontend to test tasks (claim, complete), verify domain logic, and track transaction statuses.

### Scope

- **Spring Boot** backend with **Camunda** embedded.
- **React** front end for listing/creating mandates, signatories, rules, transactions, starting processes, viewing tasks, and checking transaction statuses.
- **Basic Auth** for quick testing (in-memory or simple credentials).

> **Note**: While the UI is minimal, it allows you to **validate** domain logic and BPMN flows before investing in a full production interface.

## 2. Getting Started

### 2.1 Prerequisites

- **Java 17+**
- **Maven**
- **Node.js** + **npm** (for the React front end)
- **Camunda** (embedded via Spring Boot dependencies)

### 2.2 Backend Setup

# 1) Clone or download the repository

```bash
git clone https://github.com/steveregis/mandate-system.git
```
or 
```bash
git clone git@github.com:steveregis/mandate-domain.git
```
# 2) Go into the backend folder
```bash
cd mandate-system/mandate-backend
```

# 3) Build and package
```bash
mvn clean package
```

# 4) Run the Spring Boot app

```bash
mvn spring-boot:run
```

The backend typically listens on http://localhost:8080.
Check logs for \`ENGINE-07015 Detected process application...\` to confirm Camunda BPMN deployment.

### 2.3 Frontend Setup

# 1) Go into the frontend folder

```bash
cd mandate-system/mandate-frontend
```
# 2) Install dependencies
```bash
npm install
```
# 3) Start the dev server
```bash
npm start
```

The frontend typically loads at http://localhost:3000.
Log in using Basic Auth credentials (e.g., admin:secret).

Sample UI Routes:

/mandates – list existing mandates
/mandates/create – create a new mandate
/signatories – list signatories
/signatories/create – create a new signatory
/rules – list approval rules
/rules/create – create a new approval rule
/create-transaction – create a new transaction
/start-process – start the BPMN for a transaction
/workflow-tasks – see tasks (assign, complete)
/transaction-status – track transaction statuses

### 2.4 Database

By default, uses H2 in-memory or a simple config in \`application.properties\`.
For production, adapt to PostgreSQL or MySQL, add DB migrations (e.g., Flyway).

## 3. Testing

### 3.1 Manual Testing

1. Create a Mandate
   - Fill account details, validity dates, etc.
2. Add Signatories
   - Link them to the Mandate (flexible userName, roleName).
3. Add Approval Rules (optional)
   - e.g., threshold amounts and required signatories.
4. Create a Transaction referencing that Mandate.
5. Start Process
   - If amount > 10000, multi-instance tasks appear for each signatory.
6. Check \`/workflow-tasks\` to see tasks (assigned or unassigned).
   - Claim or complete them, depending on your BPMN assignment logic.
7. Transaction Status
   - Should move from PENDING_APPROVAL to APPROVED once final sign-off is done.

### 3.2 API Testing (Curl / Postman)

Create Mandate:
```bash
curl -X POST http://localhost:8080/api/mandates \
     -u admin:secret \
     -H "Content-Type: application/json" \
     -d '{
       "accountId": "ACCT-001",
       "validFrom": "2024-01-01",
       "validTo": "2024-12-31"
     }'
```

Create Signatory:
```bash
curl -X POST http://localhost:8080/api/signatories/mandate/1 \
     -u admin:secret \
     -H "Content-Type: application/json" \
     -d '{
       "userName": "jack",
       "displayName": "Jack Smith",
       "roleName": "FinanceApprover"
     }'
```

Create a Transaction:
```bash
curl -X POST http://localhost:8080/api/transactions/mandate/1 \
     -u admin:secret \
     -H "Content-Type: application/json" \
     -d '{
       "amount": 15000,
       "currency": "USD",
       "status": "INITIATED"
     }'
```

Start Workflow:
```bash
curl -X POST "http://localhost:8080/api/workflow/start-transaction-process?transactionId=1" \
     -u admin:secret
```

List Tasks:
```bash
curl http://localhost:8080/api/workflow/tasks -u admin:secret
```

Claim a Task:
```bash
curl -X POST "http://localhost:8080/api/workflow/tasks/{taskId}/claim?userId=jack" \
     -u jack:secret
```

Complete a Task:
```bash
curl -X POST "http://localhost:8080/api/workflow/tasks/{taskId}/complete" \
     -u jack:secret
```

Use \`-u admin:secret\` (or relevant credentials) for Basic Auth.

## 4. Domain Models & Key Features

### 4.1 Mandate
- Fields: id, accountId, status, validFrom, validTo, etc.
- Has many Signatories referencing it.

### 4.2 Signatory
- Fields: id, userName, displayName, roleName (no CFO/Treasurer hardcoding).
- Linked to one Mandate.
- Optionally store roleName or groupName for future expansions.

### 4.3 Approval Rule
- Fields: id, ruleName, thresholdAmount, requiredSignatories.
- Linked to Mandate if you want advanced multi-level logic.
- Potentially referenced in BPMN or service tasks to decide sign-off counts.

### 4.4 Transaction
- Fields: id, amount, currency, status (INITIATED, PENDING_APPROVAL, APPROVED, etc.).
- References a Mandate; BPMN references transactionId + amount for single vs. multi sign-off.

### 4.5 Camunda BPMN
- Exclusive gateway checks \#{amount <= 10000}.
- If true, single sign-off with candidateGroups="APPROVERS".
- If false, multi-instance user task for each signatory.
- A final end event or service task sets transaction.status = APPROVED.

### 4.6 Minimal Frontend (React)
- MandateList, CreateMandate for mandates.
- SignatoryList, CreateSignatory for signatories.
- ApprovalRuleList, CreateApprovalRule for optional rules.
- CreateTransaction for new transactions.
- StartProcess to trigger BPMN.
- TaskList to view, claim, complete tasks.
- TransactionStatus to see statuses.

## 5. Next Enhancements & Production Readiness

1. **Role-Based Security**
   - Replace Basic Auth with OAuth2 or an IDP (Keycloak, Okta).
   - Distinguish admin vs. approver roles.

2. **Docker & CI/CD**
   - Containerize backend + frontend; use GitHub Actions/Jenkins for deployment.

3. **Advanced BPMN**
   - Add rejection paths, escalation timers; multi-level approvals (CFO + Board).

4. **Polished UI**
   - Move beyond the minimal test harness to a robust design-friendly interface with real-time notifications or form validations.

5. **DB Migrations**
   - Use Flyway or Liquibase to handle schema changes in real environments.

6. **Monitoring & Metrics**
   - Track performance; sign-off durations; integrate with Prometheus/Grafana.

## 6. Conclusion

While the UI and auth are minimal, this project provides a strong foundation for domain logic (Mandate, Signatory, ApprovalRule, Transaction) and threshold-based BPMN flows. By adding key enhancements—such as advanced authentication and Docker 
deployment—you can rapidly evolve this proof of concept into a robust enterprise-grade solution for bank mandates and multi-sign-off workflows." > README.md 

