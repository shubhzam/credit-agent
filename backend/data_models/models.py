from sqlalchemy import Column, Integer, String
from .db import Base

from sqlalchemy import Column, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class CreditGPTPromptDetails(Base):
    __tablename__ = "CreditGPT_Prompt_Details"
    __table_args__ = {"schema": "dbo"}
    work_id = Column("Work_ID", Text, nullable=True, primary_key=True)
    human_message = Column("human_message", Text, nullable=True)
    call_type = Column("Call_Type", Text, nullable=True)
    status = Column("Status", Text, nullable=True)
    remark = Column("Remark", Text, nullable=True)
    ai_message = Column("ai_message", Text, nullable=True)
    prompt_entry_datetime = Column("Prompt_Entry_Datetime", DateTime, nullable=True)
    response_datetime = Column("Response_Datetime", DateTime, nullable=True)
    user_email_id = Column("User_EmailID", Text,  nullable=True)
