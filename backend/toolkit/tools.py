from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage,SystemMessage
from data_igestion.ingestion_pipeline import getstate, updatestate

import os
from dotenv import load_dotenv
load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
llm= ChatOpenAI(
    model_name="gpt-4o-mini",
    temperature=0.0,
    openai_api_key=openai_api_key
)

def ai_response(user_input: str) -> str:
    """ 
    Function to get AI response using OpenAI's Chat API.
    """
    history = getstate()
    human_question = HumanMessage(content=user_input)
    conversation_context = list(history["messages"]) + [human_question]
    ai_response=llm.invoke(conversation_context) 
    ai_result = ai_response.content
    updatestate(human_question,ai_result)
    return ai_result




