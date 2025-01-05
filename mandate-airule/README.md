# Rule-to-FEEL and DMN Converter API
A **FastAPI application** that leverages the **NVIDIA Mixtral model** to provide intelligent parsing and conversion of natural language rules into FEEL expressions and DMN decision tables. This service enables seamless integration with front-end applications via streaming and REST APIs.

## Features
### Natural Language Rule Conversion:

Converts user-defined rules into FEEL expressions.
Transforms FEEL expressions into DMN decision tables.
### Streaming Support:

Provides streaming responses using Server-Sent Events (SSE).
NVIDIA AI Integration:

Utilizes the NVIDIA Mixtral model for advanced natural language understanding.
CORS Support:

Configurable Cross-Origin Resource Sharing (CORS) for frontend integration.

## Prerequisites
Python 3.8+
FastAPI
openai (for NVIDIA API)
sse-starlette
uvicorn (ASGI server)
## Installation
### Clone the Repository:

```bash
 
git clone https://github.com/your-repo/rule-to-feel-api.git
cd rule-to-feel-api
```
### Install Dependencies:

```bash
pip install -r requirements.txt
Set NVIDIA API Key: Replace api_key in the code with your NVIDIA API key.
```
### Running the Application
Start the server with uvicorn:

```bash

uvicorn main:app --reload
```

API available at: http://127.0.0.1:8000
API Endpoints
1. Welcome Endpoint
GET /
Provides a welcome message and brief instructions.

Response:

```json
{
  "message": "Hello! I'm your assistant. I can convert natural language rules into FEEL expressions or DMN decision tables. Type your rule to get started."
}
```
2. Chat Stream
GET /chat
Streams responses for rule-related queries.

Query Parameters:
query: The user's question or rule.
Response:
Server-Sent Events (SSE) streaming.

3. Generate FEEL Expression
POST /generate-feel
Converts a structured rule into a FEEL expression.

Request Body:

```json
{
  "rule_text": "If the loan amount is greater than $10,000, approval requires two signatures."
}
```
Response:

```json
 {
  "feel_expression": "loanAmount > 10000 ? 'Approval requires two signatures' : 'Single signature sufficient'"
}
```
4. Generate DMN Decision Table
POST /generate-dmn
Transforms a FEEL expression into a DMN decision table.

Request Body:

```json
 {
  "feel_expression": "loanAmount > 10000 ? 'Approval requires two signatures' : 'Single signature sufficient'"
}
```
Response:

```json
 {
  "dmn": "<decisionTable>...</decisionTable>"
}
```
### Configuration
NVIDIA API
Base URL: https://integrate.api.nvidia.com/v1
Model: mistralai/mixtral-8x7b-instruct-v0.1
CORS
Update the allow_origins in the middleware configuration to match your frontend's URL.

### Example Usage
Sending a Rule for Conversion
Rule-to-FEEL:

```bash
curl -X POST http://127.0.0.1:8000/generate-feel \
-H "Content-Type: application/json" \
-d '{"rule_text": "If the loan amount is greater than $10,000, approval requires two signatures."}'
```
FEEL-to-DMN:

```bash
Copy code
curl -X POST http://127.0.0.1:8000/generate-dmn \
-H "Content-Type: application/json" \
-d '{"feel_expression": "loanAmount > 10000 ? Approval requires two signatures : Single signature sufficient"}'
```
## Next Steps
Expand AI Model Use Cases:

Support additional rule formats and languages.
Enhance Frontend Integration:

Develop a user-friendly interface for seamless rule conversion.
Production Readiness:

Add authentication and rate limiting.
Containerize with Docker.