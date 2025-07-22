from langchain_openai import ChatOpenAI

from langchain_core.tools import tool

from langgraph_supervisor import create_supervisor

from langgraph.graph.message import add_messages

from typing import TypedDict, Annotated, List

from dotenv import load_dotenv

from langgraph.prebuilt import create_react_agent

import os

# Load env variables
load_dotenv()

class DataObject(TypedDict):

    messages: Annotated[List, add_messages]

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3, api_key=os.getenv("OPENAI_API_KEY"))

# Tool
@tool
def credit_ops(webtop_id: str, process_id: str) -> str:
    """
    Run the 'credit ops' underwriting process.

    Args:
        webtop_id (str): An alphanumeric ID representing the document or client.
        process_id (str): A process ID, starting with 'p' followed by digits.

    Returns:
        str: Confirmation that the process ran successfully.
    """
    return f"output : abhiraj1234"


# ✅ Agents
agent1 = create_react_agent(

    model=llm,

    tools=[],

    name="database_agent",

    prompt="You manage database queries: SELECT or INSERT operations."
)

agent2 = create_react_agent(

    model=llm,

    tools=[credit_ops],

    name="underwriting_agent",

    prompt="""You specialize in underwriting processes like 'credit ops'.

        Input required: 'webtop id' and 'process id'."""
)

# ✅ Supervisor without threads or checkpointing
supervisor = create_supervisor(

    agents=[agent1, agent2],

    model=llm,

    prompt="""

Your only job is to:
- Route the user's message to the correct agent.

- Let that agent perform its action (possibly using a tool).

- If a tool is called and returns an output,
    respond to the user with ** the output from that tool**.


You have two agents:

1. database_agent - handles SELECT/INSERT operations, no tools.

2. underwriting_agent - handles underwriting processes. This agent has the following tool:

    - credit_ops: accepts webtop id and process id.

If a user says "run credit ops", that maps to the tool inside underwriting_agent.

Always extract webtop id and process id if they mention 'credit ops'.

If user says anything unrelated to these processes, list available agents.

if user asks anyting which is not related to the processes then only ask user to choose from the available tools.

For tool-based requests, collect webtop id and process id. Task name is optional.

If the user asks about a process, explain its purpose.

"""
).compile()

#  Initialize LangGraph state directly using DataObject
state: DataObject = {"messages": []}

def chat_bot(user_input: str):
    # Append user input to messages
    state["messages"].append({"role": "user", "content": user_input})

    # Run supervisor
    result = supervisor.invoke(state)

    # Get and store response
    response = result["messages"][-1]
    state["messages"].append(response)

    return response.content


