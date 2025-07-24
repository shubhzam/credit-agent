from typing_extensions import TypedDict
 
from typing import Annotated, Dict, Any
 
import time
 
import pyodbc
 
from contextlib import closing
 
import pandas as pd
 
from warnings import filterwarnings
 
filterwarnings('ignore')
 
 
class config:
 
    conn_str = (
 
        "DRIVER={SQL Server};"
 
        "SERVER=216.48.191.98;"
 
        "DATABASE=Agentic_Automation;"
 
        "UID=ibsadmin;"
 
        "PWD=Viking@@ibs2023;"
 
    )
 
def task_insertion(work_id,webtop_id,process_name,task_name):
 
    conn=pyodbc.connect(config.conn_str)
 
    cur=conn.cursor()
 
    task_master_data=pd.read_sql(f'''select tm.*,td.Dependency_Task_Number from Credit_GPT.dbo.Task_master as tm left join Credit_GPT.dbo.[Task_Dependencies] as td
 
                                 on tm.Task_Number=td.Task_Number where tm.Process_Name='{process_name}'
 
                                  ''',conn)
 
    task_number_list=[]
 
    cr=0
 
    # print(task_master_data)
 
    while True:
 
        cr+=1
 
        if cr==1:
 
            task_number=task_master_data[task_master_data["Task_Name"]==task_name]["Task_Number"]
 
            dependecy_task_number=task_master_data[task_master_data["Task_Name"]==task_name]["Dependency_Task_Number"]
 
        else:
 
            task_number=task_master_data[task_master_data["Task_Number"].isin(dependecy_task_number)]["Task_Number"]
 
            dependecy_task_number=task_master_data[task_master_data["Task_Number"].isin(dependecy_task_number)]["Dependency_Task_Number"]
 
        task_number_list.extend(list(set(task_number)))
 
        print(f"task_number_list={task_number_list}\ndependecy_task_number={list(dependecy_task_number)}\n==============")
 
        if dependecy_task_number.empty:
 
            break
 
        elif dependecy_task_number.iloc[0] == None and len(dependecy_task_number)==1:
 
            break
 
    sTask_number_list="'"+"','".join(task_number_list)+"'"
 
    Already_present_records=pd.read_sql(f'''select Task_Number from Credit_GPT.dbo.Task_Processing where Webtop_ID='{webtop_id}' and
    process_name='{process_name}' and
                                        Task_Number in ({sTask_number_list})''',conn)
 
    set_Already_present_records=set(Already_present_records['Task_Number'])
    
    set_task_number_list=set(task_number_list)
    print(sTask_number_list)
    set_new_tasks_to_insert=set_task_number_list-set_Already_present_records
 
    sNew_tasks_to_insert="'"+"','".join(set_new_tasks_to_insert)+"'"
    tp_iq=f'''Insert Into Credit_GPT.dbo.Task_Processing
 
                    select '{work_id}','{webtop_id}', Task_Number,Task_Name ,'New',getdate(),Null,Null,0,Null,Null,'{process_name}'
 
                    from Credit_GPT.dbo.Task_Master where Task_Number in ({sNew_tasks_to_insert})
 
                '''
    print(tp_iq)
    cur.execute(tp_iq)
    cur.execute(f'''
                INSERT INTO [Credit_GPT].dbo.Customer_Demog_Detail   (Webtop_ID)
                VALUES ('{webtop_id}')
                INSERT INTO [Credit_GPT].dbo.Verifications_Detail   (Webtop_ID)
                VALUES ('{webtop_id}')
                INSERT INTO [Credit_GPT].dbo.Offer_Detail (Webtop_ID)
                VALUES ('{webtop_id}')
                INSERT INTO [Credit_GPT].dbo.Loan_Detail (Webtop_ID)
                VALUES ('{webtop_id}')
                INSERT INTO [Credit_GPT].dbo.Credit_Headers (Webtop_ID)
                VALUES ('{webtop_id}');
                ''')
 
    conn.commit()
 
    conn.close()

    return sTask_number_list

# task_insertion("890999AQE","349PZ8633504","Credit_Ops","Send_Output")