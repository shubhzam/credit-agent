from fastapi import FastAPI, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from prompt_library.prompt import llm 
from toolkit.tools import ai_response
from exception.exceptions import format_exception
from data_igestion.ingestion_pipeline import updatestate, resetstate, getstate
from toolkit.task_depedency_insertion import task_insertion
import os
from data_models.models import CreditGPTPromptDetails
from data_models.db import engine, Base, get_db
from datetime import datetime
from prompt_library.prompt import llm_router, knowledge_base, general_response
from sqlalchemy import text 

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # e.g. ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
api_router = APIRouter(prefix="/api")

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Credit Agent API"}

@app.post("/api/reset/")
async def reset_state():
    """
    Endpoint to reset the state of the conversation.
    """
    try:
        resetstate()
        return JSONResponse(content={"message": "State has been reset."}, status_code=200)
    except Exception as e:
        error_details = format_exception(e)
        return JSONResponse(content=error_details, status_code=500)

class UserQuery(BaseModel):
    unique_id: str
    user_query: str
@app.post("/api/userquery/",tags=["Pydantic"])
async def create_item(userquery: UserQuery,
                      db: AsyncSession = Depends(get_db)):
    try:
        question = userquery.user_query
        route=llm_router(question)      
        print("Route:", route)

        if route["intent"] == "run_credit_underwriting_bot":
            webtop_id = route["webtop_ids"][0]
            stages = route["stages"][-1]
            prompt_entry_datetime = datetime.now()
            work_id = userquery.unique_id
            response= route["message"]
            response_datetime = datetime.now()
            print(userquery)
            updatestate(question, response)
            result = task_insertion(work_id,webtop_id,'Credit_Ops',stages)
            print("Task Insertion Result:", result)
            log = CreditGPTPromptDetails(
                work_id=work_id,
                user_email_id="shubham.mojidra@idolizesolutions.com",
                human_message=question,
                ai_message=response,
                prompt_entry_datetime=prompt_entry_datetime,
                response_datetime=response_datetime,
                status="InProgress"
            )
            db.add(log)
            await db.commit()
            await db.refresh(log)
            print(response)
            return JSONResponse(content={"mesaage":response}, status_code=200)
        
        elif route["intent"] == "run_bureau_analysis_bot":
            webtop_id = route["webtop_ids"][0]
            stages = route["stages"][-1]
            prompt_entry_datetime = datetime.now()
            work_id = userquery.unique_id
            response= route["message"]
            response_datetime = datetime.now()
            print(userquery)
            updatestate(question, response)
            result = task_insertion(work_id,webtop_id,'Bureau Analysis',stages)
            print("Task Insertion Result:", result)
            log = CreditGPTPromptDetails(
                work_id=work_id,
                user_email_id="shubham.mojidra@idolizesolutions.com",
                human_message=question,
                ai_message=response,
                prompt_entry_datetime=prompt_entry_datetime,
                response_datetime=response_datetime,
                status="InProgress"
            )
            db.add(log)
            await db.commit()
            await db.refresh(log)
            print(response)
            return JSONResponse(content={"mesaage":response}, status_code=200)
        
        elif route["intent"] == "run_bureau_comparison_bot":
            webtop_id = route["webtop_ids"][0]
            stages = route["stages"][-1]
            prompt_entry_datetime = datetime.now()
            work_id = userquery.unique_id
            response= route["message"]
            response_datetime = datetime.now()
            print(userquery)
            updatestate(question, response)
            result = task_insertion(work_id,webtop_id,'Bureau Comparison',stages)
            print("Task Insertion Result:", result)
            log = CreditGPTPromptDetails(
                work_id=work_id,
                user_email_id="shubham.mojidra@idolizesolutions.com",
                human_message=question,
                ai_message=response,
                prompt_entry_datetime=prompt_entry_datetime,
                response_datetime=response_datetime,
                status="InProgress"
            )
            db.add(log)
            await db.commit()
            await db.refresh(log)
            print(response)
            return JSONResponse(content={"mesaage":response}, status_code=200)
        
        elif route["intent"] == "run_bureau_demog_bot":
            webtop_id = route["webtop_ids"][0]
            stages = route["stages"][-1]
            prompt_entry_datetime = datetime.now()
            work_id = userquery.unique_id
            response= route["message"]
            response_datetime = datetime.now()
            print(userquery)
            updatestate(question, response)
            result = task_insertion(work_id,webtop_id,'Bureau Demog',stages)
            print("Task Insertion Result:", result)
            log = CreditGPTPromptDetails(
                work_id=work_id,
                user_email_id="shubham.mojidra@idolizesolutions.com",
                human_message=question,
                ai_message=response,
                prompt_entry_datetime=prompt_entry_datetime,
                response_datetime=response_datetime,
                status="InProgress"
            )
            db.add(log)
            await db.commit()
            await db.refresh(log)
            print(response)
            return JSONResponse(content={"mesaage":response}, status_code=200)
        
        elif route["intent"] == "run_bureau_deviation_bot":
            webtop_id = route["webtop_ids"][0]
            stages = route["stages"][-1]
            prompt_entry_datetime = datetime.now()
            work_id = userquery.unique_id
            response= route["message"]
            response_datetime = datetime.now()
            print(userquery)
            updatestate(question, response)
            result = task_insertion(work_id,webtop_id,'Bureau Deviation',stages)
            print("Task Insertion Result:", result)
            log = CreditGPTPromptDetails(
                work_id=work_id,
                user_email_id="shubham.mojidra@idolizesolutions.com",
                human_message=question,
                ai_message=response,
                prompt_entry_datetime=prompt_entry_datetime,
                response_datetime=response_datetime,
                status="InProgress"
            )
            db.add(log)
            await db.commit()
            await db.refresh(log)
            print(response)
            return JSONResponse(content={"mesaage":response}, status_code=200)
        
        elif route["intent"] == "checkstatus":
            query=route["query"]
            stmt=text(query)
            result = await db.execute(stmt)
            records = result.mappings().all()
            prompt_text = (
                "I queried our task table and got these rows:\n"
                f"{records}\n\n"
                "In one simple English sentence, tell me which tasks are in progress and which are completed along with Webtop ID."
            )
            llm_response = llm.invoke(
                input=prompt_text,
                temperature=0.0
            )
            summary = llm_response.content
            updatestate(question, summary)
            return JSONResponse(
                content={"message":summary},
                status_code=200
            )
        elif route["intent"] == "knowledge_base":
            response=knowledge_base(question)
            return JSONResponse(content={"message":response})
        elif route["intent"] == "general":   
            response= general_response(question)
            return JSONResponse(content={"message": response}, status_code=200)
    except Exception as e:
            error_details = format_exception(e)
            print("Error:", error_details)
            return JSONResponse(content=error_details, status_code=500)

