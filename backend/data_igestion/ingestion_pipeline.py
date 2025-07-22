from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import AnyMessage
from langgraph.graph.message import add_messages
from exception.exceptions import format_exception
from langchain_core.messages import AnyMessage, HumanMessage, AIMessage

class State(TypedDict):
    messages: Annotated[Sequence[AnyMessage], add_messages]

state: State = {"messages": []}

def updatestate(_question,_response):
    try:
        human_msg = HumanMessage(content=_question)
        ai_msg = AIMessage(content=_response)
        state["messages"] = add_messages(state["messages"], human_msg)
        state["messages"] = add_messages(state["messages"], ai_msg)
        print(state)
        return state
    except Exception as e:
        error_details = format_exception(e)
        return error_details

def getstate() -> Sequence[AnyMessage]:
    """
    Get the current state of the conversation (messages).
    """
    return state

def getlastmessage() -> Sequence[AnyMessage]:
    """
    Get the last state of the conversation (last messages).
    """
    return state["messages"][-1]

def resetstate() -> None:
    """
    Clear out the previous conversation history.
    Call this at the start of a new chat window/session.
    """
    state["messages"] = []

