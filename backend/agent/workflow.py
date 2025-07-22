from langgraph.graph.message import add_messages
from langgraph.graph import StateGraph, END
from typing_extensions import Annotated, TypedDict
from prompt_library.prompt import classify_process
from data_igestion.ingestion_pipeline import getstate, resetstate, updatestate

state=getstate()
print(state)
