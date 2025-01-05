from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# NVIDIA API Configuration
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",  # NVIDIA Playground Base URL
    api_key="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"  # Replace with your API key
)



# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def call_nvidia_model(messages: list):
    """Call NVIDIA Mixtral API for a streaming response."""
    completion = client.chat.completions.create(
        model="mistralai/mixtral-8x7b-instruct-v0.1",  # NVIDIA model
        messages=messages,
        temperature=0.5,
        top_p=0.7,
        max_tokens=1024,
        stream=True
    )
    for chunk in completion:
        if chunk.choices[0].delta.content is not None:
            yield chunk.choices[0].delta.content


@app.get("/")
async def welcome():
    """Welcome endpoint with instructions."""
    return {"message": "Hello! I'm your assistant. I can convert natural language rules into FEEL expressions or DMN decision tables. Type your rule to get started."}


@app.get("/chat")
async def chat_stream(request: Request, query: str):
    """Stream assistant responses for user queries."""
    async def event_generator():
        if "rule" in query.lower():
            messages = [
                {"role": "system", "content": "You are a helpful assistant that parses natural language rules."},
                {"role": "user", "content": query}
            ]
        else:
            yield "data: Sorry, I can only assist with rule-related queries.\n\n"
            return

        for chunk in call_nvidia_model(messages):
            yield f"data: {chunk}\n\n"

    return EventSourceResponse(event_generator())


@app.post("/generate-feel")
async def generate_feel(request: Request):
    """Convert structured rule to a FEEL expression."""
    body = await request.json()
    rule_text = body.get("rule_text")

    if not rule_text:
        return {"error": "Rule text is required"}

    messages = [
        {"role": "system", "content": "You are a helpful assistant that converts structured rules into FEEL expressions."},
        {"role": "user", "content": f"Convert the following rule into a FEEL expression:\n\n{rule_text}"}
    ]
    response = "".join(call_nvidia_model(messages))
    return {"feel_expression": response}


@app.post("/generate-dmn")
async def generate_dmn(request: Request):
    """Convert FEEL expression to DMN decision table."""
    body = await request.json()
    feel_expression = body.get("feel_expression")

    if not feel_expression:
        return {"error": "FEEL expression is required"}

    messages = [
        {"role": "system", "content": "You are a helpful assistant that converts FEEL expressions into DMN decision tables."},
        {"role": "user", "content": f"Convert this FEEL expression into a DMN decision table:\n\n{feel_expression}"}
    ]
    response = "".join(call_nvidia_model(messages))
    return {"dmn": response}
