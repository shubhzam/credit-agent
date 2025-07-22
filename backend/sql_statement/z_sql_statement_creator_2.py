# imports

from langgraph.graph import StateGraph,START,END

from dotenv import load_dotenv

from typing import TypedDict,List,Annotated,Literal

from langchain_openai import ChatOpenAI

from langgraph.graph.message import add_messages

from langchain.schema import AIMessage,HumanMessage

from langchain_core.tools import tool

from langgraph.prebuilt import ToolNode, tools_condition

from langchain.prompts import ChatPromptTemplate

from langchain_core.output_parsers import JsonOutputParser

from table_schema import TABLE_SCHEMA

from z_data_fetcher import  execute_sql_query

import os


# prompt 
system_message = f"""
You are an AI that only returns SQL SELECT queries based on user requests.

Return the result as a JSON object with a single key `query`, where the value is a valid SQL SELECT statement
as a single-line string, without newlines or formatting.
Only return the query in the following JSON format:
{{{{"query": "<SQL query>"}}}}

Use only the given schema. Do not guess column or table names.

When writing INNER JOIN queries between any two tables, you must:
- Only join on the column named `Webtop_ID`.
- Only join tables that contain the column `Webtop_ID`.
- Do not use any other column for joining.

Always clarify and use the best matching table and columns based on the user's natural language description.  
If unsure, choose the most relevant columns/tables described in the schema.

{TABLE_SCHEMA}
"""

prompt = ChatPromptTemplate.from_messages([

    ("system", system_message),

    ("human", "{input}")
    
])

load_dotenv()

openai_key = os.getenv('OPENAI_API_KEY')

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3, api_key=openai_key)

parser = JsonOutputParser()

chain = prompt | llm | parser

def data_fetcher(query):

    result = chain.invoke({'input': query })

    query = result['query']

    response = execute_sql_query(query)

    return response