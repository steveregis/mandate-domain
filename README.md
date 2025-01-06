# Mandate Management System (Minimal Yet Extensible)

This reference application pairs **Spring Boot**, **Camunda (for BPMN/DMN execution)**, and **React** to demonstrate how **multi-sign-off approvals**, **threshold-based logic**, and **flexible signatories** can be modeled and automated. By separating the “what” (business logic and decisions in DMN) from the “how” (process flows in BPMN), teams can adapt quickly to changing business requirements **without hardcoding roles or rules**. A minimal UI serves as a proof of concept to validate key domain models, approvals, and process flows. This makes it an ideal starting point for bank mandate management—or any scenario where controlled, auditable workflows are paramount.

Leveraging **BPMN (Business Process Model and Notation)** and **DMN (Decision Model and Notation)** offers a clear, visual way to define and **automate complex business processes and decisions**. For business leaders, BPMN diagrams provide an intuitive view of **how tasks flow from one stage to the next**, while DMN tables make **rules and thresholds transparent and easily adjustable**. For developers, these same models translate into robust, executable workflows and decisions that integrate seamlessly with microservices and modern front-end frameworks.


Also includes a Smart Rule Assistant POC which is a **FastAPI** application that leverages the **NVIDIA Mixtral model** to provide **intelligent parsing and conversion of natural language rules into Mandate Rules expressed as FEEL expressions and DMN decision tables**. this will enable self service 

## 1. Project Goal & Description

### Goal

- Provide an **end-to-end** system that captures **Mandates** (authorization rules), **Signatories** (flexible user references), **Approval Rules**, and **Transactions** (amount, currency, referencing a Mandate).
- Use **Camunda BPMN** to enforce single or multi-sign-off (e.g., \`amount <= 10000\` → single, \`> 10000\` → multi-instance).
- Offer a **minimal** React (or React Native) frontend to test tasks (claim, complete), verify domain logic, and track transaction statuses.
- Offer a **POC** of a Rule Assistant to help the user create approval rules enabling self-care 

### Scope

- **Spring Boot** backend with **Camunda** embedded.
- **React** front end for listing/creating mandates, signatories, rules, transactions, starting processes, viewing tasks, and checking transaction statuses.
- **Basic Auth** for quick testing (in-memory or simple credentials).
- **FastAPI** for quick POC of a Rule Assistant

> **Note**: While the UI is minimal, it allows you to **validate** domain logic and BPMN flows before investing in a full production interface. Also the FastAPI app POC is to understand the suitability of NVIDIA Mixtral model to enable end user . there are other suitable models to consider as well based on this 

## 2. Getting Started

> **Note**: for Getting started with the POC Rule Assistant please follow README.md instruction in manadate-airule

### 2.1 Prerequisites

- **Java 17+**
- **Maven**
- **Node.js** + **npm** (for the React front end)
- **Camunda** (embedded via Spring Boot dependencies)
  

### 2.2 Backend Setup

#### 1) Clone or download the repository

```bash
git clone https://github.com/steveregis/mandate-system.git
```
or 
```bash
git clone git@github.com:steveregis/mandate-domain.git
```
#### 2) Go into the backend folder
```bash
cd mandate-system/mandate-backend
```

#### 3) Build and package
```bash
mvn clean package
```

#### 4) Run the Spring Boot app

```bash
mvn spring-boot:run
```

The backend typically listens on http://localhost:8080. try http://localhost:8080/api/mandates to get a empty json 
Check logs for \`ENGINE-07015 Detected process application...\` to confirm Camunda BPMN deployment.

### 2.3 Frontend Setup

#### 1) Open a new session in Project Root & Go into the frontend folder

```bash

cd mandate-domain/mandate-frontend
```
#### 2) Install dependencies
```bash
npm install
```
#### 3) Start the dev server
```bash
npm start
```

The frontend typically loads at http://localhost:3000.
Log in using Basic Auth credentials (e.g., admin:secret).

#### Sample UI Routes:

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
3. Add Approval Rules (optional- not implemented as of 1 jan '25)
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

## 5 Testing Scenarios: Standalone Backend & Front-End Flows
This section describes step-by-step how to test single-signoff (amount <= 10,000) and multi-signoff (amount > 10,000) both in the backend (standalone) and in the UI (front end).

### 5.1 Standalone Backend Testing
Here, we only use Curl (or Postman) against the Spring Boot + Camunda backend at http://localhost:8080. (If you host elsewhere, replace localhost:8080 with your server address.)

### 5.1.1. Single Sign-Off Scenario (Amount <= 10000)
#### Create Mandate

```bash
curl -X POST "http://localhost:8080/api/mandates" \
  -u admin:secret \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "ACCT-1001",
    "validFrom": "2024-01-01",
    "validTo": "2024-12-31"
  }'
```

Returns a Mandate with id (e.g. 1).
#### Add Signatory

```bash
curl -X POST "http://localhost:8080/api/signatories/mandate/1" \
  -u admin:secret \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "admin",
    "displayName": "Admin User",
    "roleName": "CFO"
  }'
```
We link signatory admin (CFO) to Mandate #1.
#### Create Transaction (amount <= 10000)

```bash
curl -X POST "http://localhost:8080/api/transactions/mandate/1" \
  -u admin:secret \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "USD",
    "status": "INITIATED"
  }'
```
Returns a Transaction (say id=10).
#### Start the BPMN process

```bash
curl -X POST "http://localhost:8080/api/workflow/start-transaction-process?transactionId=10" \
  -u admin:secret
```
Because amount=5000 (<=10000), the BPMN creates a single user task (candidate group or direct assignment).
#### List Tasks

```bash
curl "http://localhost:8080/api/workflow/tasks" \
  -u admin:secret
```
Shows a task assigned or unassigned. If assigned to admin, skip claim. If unassigned, do the claim step.
#### Claim Task (if unassigned)

```bash
curl -X POST "http://localhost:8080/api/workflow/tasks/{taskId}/claim?userId=admin" \
  -u admin:secret
```
Only needed if the BPMN used candidate users, not direct assignment.
#### Complete the Task

```bash
curl -X POST "http://localhost:8080/api/workflow/tasks/{taskId}/complete" \
  -u admin:secret
```
Single sign-off done. The transaction moves to APPROVED.
#### Check Transaction Status

```bash
curl "http://localhost:8080/api/transactions/10" \
  -u admin:secret
```
Should show "status": "APPROVED" if the process ended.
### 5.1.2. Multi Sign-Off Scenario (Amount > 10000)
#### Create Mandate (if not reused from above)

```bash
curl -X POST "http://localhost:8080/api/mandates" \
  -u admin:secret \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "ACCT-2001",
    "validFrom": "2024-01-01",
    "validTo": "2024-12-31"
  }'
```
Suppose it returns id=2.
#### Add Multiple Signatories

##### 1) CFO signatory
```bash
curl -X POST "http://localhost:8080/api/signatories/mandate/2" \
  -u admin:secret \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "cfo",
    "displayName": "John CFO",
    "roleName": "CFO"
  }'
```

##### 2) Treasurer signatory
```bash
curl -X POST "http://localhost:8080/api/signatories/mandate/2" \
  -u admin:secret \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "treasurer",
    "displayName": "Mary Treasurer",
    "roleName": "TREASURER"
  }'
  ```
##### Create Transaction (amount > 10000)

```bash
curl -X POST "http://localhost:8080/api/transactions/mandate/2" \
  -u admin:secret \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 20000,
    "currency": "USD",
    "status": "INITIATED"
  }'
```
Returns, e.g., id=11.
##### Start the BPMN process

```bash
curl -X POST "http://localhost:8080/api/workflow/start-transaction-process?transactionId=11" \
  -u admin:secret
```
Because amount=20000 (>10000), the BPMN will create multi-instance tasks for each signatory (CFO, Treasurer), meaning 2 tasks in parallel.
##### List Tasks

```bash
curl "http://localhost:8080/api/workflow/tasks" \
  -u admin:secret
```
Sees 2 tasks, each assigned or candidate to cfo, treasurer (depending on your BPMN approach).
CFO logs in or uses -u cfo:secret to Claim & Complete:


##### Claim (if unassigned)  - first approver
```bash
curl -X POST "http://localhost:8080/api/workflow/tasks/{cfoTaskId}/claim?userId=cfo" \
  -u cfo:secret
```

##### Complete - first approver
```bash
curl -X POST "http://localhost:8080/api/workflow/tasks/{cfoTaskId}/complete" \
  -u cfo:secret
  ```
Treasurer does the same with -u treasurer:secret:


##### Claim - second approver
```bash
curl -X POST "http://localhost:8080/api/workflow/tasks/{treasurerTaskId}/claim?userId=treasurer" \
  -u treasurer:secret
```

###### Complete - second approver
```bash
curl -X POST "http://localhost:8080/api/workflow/tasks/{treasurerTaskId}/complete" \
  -u treasurer:secret
  ```
Final: Once both tasks are completed, the process ends, and the transaction.status becomes APPROVED.

### 6.2 End-User Journeys in the Front End (React UI)
Here, we run both the backend and front end. Then:

Start both: Backend: mvn spring-boot:run in mandate-backend.\
Front end: npm start in mandate-frontend (listening at http://localhost:3000).\
Login with Basic Auth credentials (e.g., admin/secret, cfo/secret, treasurer/secret).\

### 6.2.1 Single Sign-Off (admin only)
1. Log in as admin.\
2. Create a Mandate at http://localhost:3000/mandates/create.\
3. Add a Signatory (the same admin user, e.g., role=“CFO”) at http://localhost:3000/signatories/create.\
4. Create a Transaction with amount <= 10000 at http://localhost:3000/create-transaction (pick your mandate).\
5. Start the process at http://localhost:3000/start-process (select your newly created transaction).\
6. Navigate to http://localhost:3000/workflow-tasks:\
7. You should see a single task assigned (or unassigned). If assigned to admin, just Complete it. If unassigned, Claim first, then Complete.\
8. Check http://localhost:3000/transaction-status:\
9. The transaction status becomes APPROVED after your sign-off.\
    
###  6.2.2 Multi Sign-Off (CFO + Treasurer)
1. Log in as admin.\
2. Create another Mandate, or reuse an existing one, but add signatories for cfo and treasurer.\
3. Create a Transaction with amount > 10000 (e.g., 20000) referencing that Mandate.\
4. Start the process (using start-process page). Because amount > 10000, the BPMN triggers multi-instance tasks:\
5. One for cfo\
6. One for treasurer\
7. Log out or open another browser tab:\
8. Log in as cfo, go to workflow-tasks. Claim & Complete your CFO task.\
9. Log in as treasurer, do the same.\
10. Once both tasks complete, the transaction is APPROVED. Check transaction-status page to verify.\
    
### 6.3 Postman Collection (Importable)
Below is a Postman Collection (v2.1) in JSON format to test single & multi sign-off. It assumes localhost:8080 for the backend. Adjust if needed. Copy this entire JSON into a file (e.g. MandateSystem.postman_collection.json), then Import into Postman.

```JSON

{
  "info": {
    "name": "Mandate System Test Collection",
    "_postman_id": "42a2d5fa-cccc-1111-bbbb-123456789aaa",
    "description": "Basic tests for single vs multi-signoff in Mandate System at localhost:8080",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Mandate",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Basic YWRtaW46c2VjcmV0",
            "type": "text"
          },
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/mandates",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api","mandates"]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"accountId\": \"ACCT-1001\",\n  \"validFrom\": \"2024-01-01\",\n  \"validTo\": \"2024-12-31\"\n}"
        }
      }
    },
    {
      "name": "Add Signatory to Mandate (ID=1)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Basic YWRtaW46c2VjcmV0",
            "type": "text"
          },
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/signatories/mandate/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api","signatories","mandate","1"]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"userName\": \"admin\",\n  \"displayName\": \"Admin User\",\n  \"roleName\": \"CFO\"\n}"
        }
      }
    },
    {
      "name": "Create Transaction (<=10K)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Basic YWRtaW46c2VjcmV0",
            "type": "text"
          },
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/transactions/mandate/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api","transactions","mandate","1"]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"amount\": 5000,\n  \"currency\": \"USD\",\n  \"status\": \"INITIATED\"\n}"
        }
      }
    },
    {
      "name": "Start Process (Transaction <=10K)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Basic YWRtaW46c2VjcmV0",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/workflow/start-transaction-process?transactionId=10",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api","workflow","start-transaction-process"],
          "query": [
            {"key": "transactionId", "value": "10"}
          ]
        }
      }
    },
    {
      "name": "List Tasks",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Basic YWRtaW46c2VjcmV0",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/workflow/tasks",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api","workflow","tasks"]
        }
      }
    },
    {
      "name": "Claim Task (example ID)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Basic YWRtaW46c2VjcmV0",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/workflow/tasks/TASK_ID/claim?userId=admin",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api","workflow","tasks","TASK_ID","claim"],
          "query": [
            {"key": "userId", "value": "admin"}
          ]
        }
      }
    },
    {
      "name": "Complete Task (example ID)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Basic YWRtaW46c2VjcmV0",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/workflow/tasks/TASK_ID/complete",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api","workflow","tasks","TASK_ID","complete"]
        }
      }
    },
    {
      "name": "Check Transaction (ID=10)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Basic YWRtaW46c2VjcmV0",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/transactions/10",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api","transactions","10"]
        }
      }
    }
  ]
}
```
How to Use:

1. Copy the JSON above into a file named, for example, MandateSystem.postman_collection.json.\
2. Open Postman → Import → File → select MandateSystem.postman_collection.json.\
3. You’ll see the collection named “Mandate System Test Collection,” with requests to create mandates, signatories, transactions, start process, list tasks, etc.\
4. Adjust any IDs or amounts as needed, and update the Authorization if you use different user credentials.\

## 6. Next Enhancements & Production Readiness

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

## 7. Conclusion

This project provides a strong foundation for domain logic (Mandate, Signatory, ApprovalRule, Transaction) and threshold-based BPMN flows. By adding key enhancements—such as advanced authentication and Docker deployment—you can rapidly evolve this proof of concept into a robust enterprise-grade solution for bank mandates and multi-sign-off workflows. 

