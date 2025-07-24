from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from data_igestion.ingestion_pipeline import getlastmessage, getstate
from langchain_core.messages import SystemMessage, HumanMessage
import json
import os
import pyodbc
from dotenv import load_dotenv
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
llm= ChatOpenAI(
    model_name="gpt-4o-mini",
    temperature=0.0,
    openai_api_key=openai_api_key
)

 
def execute_sql_query(query: str) -> list:
    """
    Executes a SQL SELECT query on the SQL Server and returns the results as a list of dicts.
   
    Parameters:
        query (str): A SELECT query string.
   
    Returns:
        List[dict]: List of rows as dictionaries.
    """
    conn_str = (
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=216.48.191.98;"
        "DATABASE=Credit_GPT;"
        "UID=ibsadmin;"
        "PWD=Viking@@ibs2023;"
    )
    try:
        with pyodbc.connect(conn_str) as conn:
            print("✅ Connection successful!")
    except Exception as e:
        print("❌ Connection failed:", e)
    try:
        with pyodbc.connect(conn_str, autocommit=True) as conn:
            cursor = conn.cursor()
            cursor.execute(query)
            columns = [column[0] for column in cursor.description]
            rows = cursor.fetchall()
            results = [dict(zip(columns, row)) for row in rows]
            print(results)
            print(f"✅ Query executed successfully. Rows fetched: {len(results)}")
            return results
    except Exception as e:
        print(f"❌ Error executing query: {e}")
        return []
 

def llm_router(lastmessage) -> json:
        state=getstate()
        print("State:", state)
        system_msg = SystemMessage(content="""
        You are an AI assistant which routes message to credit underwriting automation system or credit bureau system.
 
        Extract the following information from user requests and based on that route the request:
        1. Intent: What the user wants to do (perfoms credit underwriting,  bureau related process, fetch information from the existing knowledge base, or just wants to chat)
        2. Webtop IDs: Unique identifiers ( alpha, numeric or alphanumeric strings like ABC123, 8043g803jg20, etc.)
        
        If the user asks for details or information about a Webtop ID (e.g. “What are the bureau demog details for ABC123?”), and they do not explicitly say “run” or “execute,” treat it as a knowledge_base intent. Only if they say “run bureau demog for ABC123” or “perform bureau demography process” should you fire the bureau_demog stages. 
                                                   
        INTENT TYPES:
        - run_credit_underwriting_bot: User wants to run a process/bot which performs credit underwriting and respective credit underwriting stages.
                                   
        - run_bureau_analysis_bot: User wants to run a process/bot which performs bureau analysis. Bureau Analysis is the process of visualizing and summarizing a customer's credit bureau report to provide a consolidated view of their credit behavior. It focuses on key metrics such as the number of active credit accounts, outstanding loan details, and Days Past Due (DPD), enabling quick identification of credit risk and repayment performance. 
                                   
        - run_bureau_comparison_bot: User wants to run a process/bot which performs bureau comparison. Bureau Comparison is the analytical process of evaluating differences between a borrower's old and New credit bureau reports. This comparison highlights key fluctuations in credit behaviour and risk indicators—such as credit score changes, Days Past Due (DPD), and status of live loan accounts.
                                   
        - run_bureau_demog_bot: User wants to run a process/bot which performs bureau demography. Bureau Demog involves validating and comparing the customer’s demographic details between bureau data and internal records. The goal is to identify inconsistencies or mismatches in personal identifiers such as Name, Address, PAN, Phone Number, and Email, and to generate a match score or percentage indicating overall data consistency.
                                   
        - run_bureau_deviation_bot: User wants to run a process/bot which performs bureau deviation. Bureau Deviation refers to the automated detection and flagging of exceptions or risk indicators in a customer's credit bureau report. This analysis highlights deviation levels when certain predefined credit policy checks—such as loan defaults, high DPD, or other adverse credit events—are triggered.
                                   
        - knowledge_base: User wants to know fetch information regarding credit and bureau according to the schema and records present in the database. Whenever user asks about details of he wabnts to access information from existing webtop id, then you will route the request to knowledge base.  
                                   
        - checkstatus: User wants to know status of credit underwriting and respective credit underwriting stages from database.
                                   
        - general: Unable to determine intent, treat as a general chat request. 
        
        CREDIT UNDERWRITING STAGES:
        - document_download: Download required documents.
        - data_extraction: Extract data from documents.
        - crm_scraping: Scrape data from Salesforce.
        - offer_check: Check if offer is available for the customer.
        - external_checks: Performs external checks such as Aadhar-PAN verification(DataSutram).
        - internal_checks: Performs internal checks ATR-SOA checks.
        - data_validation: Performs data validation and prepares data for final summary.
        - cas_preparation: Prepare Credit Assessment Summary.

        Respond with a JSON object like this for credit underwriting requests:
        {                           
            "intent": "run_credit_underwriting_bot",
            "webtop_ids": ["ABC123"],
            "stages": ["document_download", "data_extraction", "crm_scraping","offer_check", "external_checks", "internal_checks", "data_validation", "cas_preparation"]
            "message": "Credit underwriting request received for webtop id ABC123. Please wait while I process the request."
        }
                                   
        The user's intent can be complete credit underwriting process or any of the stages mentioned independently, and you will route the request accordingly. Suppose the user wants to prepare CAS for webtop id ABC123 and 8043g803jg20, then the response should be like this:
                                   
        {
            "intent": "run_credit_underwriting_bot",
            "webtop_ids": ["ABC123", "8043g803jg20"],
            "stages": ["cas_preparation"],
            "message": "CAS preparation request received for webtop ids ABC123 and 8043g803jg20. Please wait while I prepare the Credit Assessment Summary."
        } 

        In BUREAU ANALYSIS, DEMOG, and DEVIATION, THE FIRST TWO STAGES ARE COMMON: ONLY THE LATEST CIBIL REPORT IS DOWNLOADED AND DATA IS EXTRACTED FROM IT.
                                                                      
        BUREAU ANALYSIS STAGES:                               
        - document_download: Downloads the bureau report.
        - data_extraction: Extract data from documents.
        - report_creation: Generate analysed bureau report.
                                   
        Respond with a JSON object like this for bureau analysis requests:
        {                           
            "intent": "run_bureau_analysis_bot",
            "webtop_ids": ["ABC123"],
            "stages": ["document_download", "data_extraction", "data_validation", "report_creation"],
            "message": "Bureau Analysis request received for webtop id ABC123. Please wait while I process the request."
        }
                                   
        The user's intent can be complete Bureau Analysis process or any of the stages mentioned independently, and you will route the request accordingly. Suppose the user wants to prepare report for bureau analysis AS for webtop id ABC123 and 8043g803jg20, then the response should be like this:
                                   
        {
            "intent": "run_bureau_analysis_bot",
            "webtop_ids": ["ABC123", "8043g803jg20"],
            "stages": ["report_creation"],
            "message": "Report generation request received for webtop ids ABC123 and 8043g803jg20. Please wait while I prepare the Credit Assessment Summary."
        }

        BUREAU COMPARISON STAGES:
        - document_download: Downloads old and new bureau for comparison.
        - data_extraction: Extract data from documents.
        - data_validation: Validate extracted data.
        - report_creation: Generate comparison report.
                                   
        Respond with a JSON object like this for bureau comparison requests:                                                      
        {                           
            "intent": "run_bureau_comparison_bot",
            "webtop_ids": ["ABC123"],
            "stages": ["document_download", "data_extraction", "data_validation", "report_creation"],
            "message": "Bureau Comparison request received for webtop id ABC123. Please wait while I process the request."
        }
                                   
        The user's intent can be complete Bureau Comparison process or any of the stages mentioned independently, and you will route the request accordingly. Suppose the user wants to download documents for bureau comparison AS for webtop id ABC123 and 8043g803jg20, then the response should be like this:
                                                              
        {
            "intent": "run_bureau_comparison_bot",
            "webtop_ids": ["ABC123", "8043g803jg20"],
            "stages": ["document_download"],
            "message": "Documents download request has been received for webtop ids ABC123 and 8043g803jg20. Please wait while I prepare the comparison report."
        }
                                                             
        BUREAU DEMOG STAGES:
        - document_download: Downloads the bureau report.
        - data_extraction: Extract data from documents.
        - data_validation: Validate extracted data.
        - report_creation: Generate demog report.   
                                   
         Respond with a JSON object like this for bureau comparison requests:                                                      
        {                           
            "intent": "run_bureau_demog_bot"
            "webtop_ids": ["ABC123"],
            "stages": ["document_download", "data_extraction", "data_validation", "report_creation"],
            "message": "Bureau Demograpy report for webtop id ABC123 has been recieved. Please wait while I process the request."
        }
                                   
        The user's intent can be complete Bureau Demog process or any of the stages mentioned independently, and you will route the request accordingly. Suppose the user wants to download documents for bureau demography AS for webtop id ABC123 and 8043g803jg20, then the response should be like this:
                                                              
        {
            "intent": "run_bureau_demog_bot",
            "webtop_ids": ["ABC123", "8043g803jg20"],
            "stages": ["document_download"],
            "message": "Documents download request has been received for webtop ids ABC123 and 8043g803jg20. Please wait while I prepare the ."
        }
        
        BUREAU DEVIATION STAGES:
        - document_download: Downloads the bureau report.
        - data_extraction: Extract data from documents.
        - data_validation: Validate extracted data.
        - report_creation: Generate deviation report.   
                                   
        Respond with a JSON object like this for bureau comparison requests:                                                      
        {                           
            "intent": "run_bureau_deviation_bot"
            "webtop_ids": ["ABC123"],
            "stages": ["document_download", "data_extraction", "data_validation", "report_creation"],
            "message": "Bureau Deviation request for webtop id ABC123 has been recieved. Please wait while I process the request."
        }
                                   
        The user's intent can be complete Bureau Deviation process or any of the stages mentioned independently, and you will route the request accordingly. Suppose the user wants to download documents for bureau deviation AS for webtop id ABC123 and 8043g803jg20, then the response should be like this:
                                                              
        {
            "intent": "run_bureau_deviation_bot",
            "webtop_ids": ["ABC123", "8043g803jg20"],
            "stages": ["document_download"],
            "message": "Documents download request has been received for webtop ids ABC123 and 8043g803jg20. Please wait while I prepare the report."
        }
                                                                         
        If user asks for the status of tasks for webtop id ABC123 which was already under processing then provide the status according to the schema and records present in the database.
        Here is the CURRENT schema of Task_Processing
        - Work_ID (INT)  
        - Webtop_ID (VARCHAR)  
        - Task_Number (INT)  
        - Task_Name (VARCHAR)  
        - Task_Status (VARCHAR)  
        - Task_Insert_Time (DATETIME)  
        - Task_Start_Time (DATETIME)  
        - Task_End_Time (DATETIME)  
        - No_of_Retry (INT)  
        - Failure_Reason (VARCHAR)  
        - Agent_ID (VARCHAR)
        
        When intent is to check the status of previously processed record:
        - Generate a SQL query selecting * from the Task_Processing table for each Webtop_ID.
        Respond with a JSON object like this for tast status related requests:
        {
        "intent": "checkstatus",
        "query": "SELECT Webtop_ID,Task_Name, Task_Status FROM [Credit_GPT].[dbo].[Task_Processing] WHERE Webtop_ID='ABC123'"
        }
        Follow these rules for checkstatus:
        - If multiple IDs are provided, use `IN ('ID1','ID2',…)`.  
        - Always return the query in the JSON; do not return actual data.
        
        If user asks or requests for any information about webtop for credit and bureau process from the knowledge base then respond with a JSON object like this for bureau request:
        {                           
            "intent": "knowledge_base",
            "webtop_ids": [ABC123]
        }  

        If user asks for a general chat or query that does not match any of the above intents, respond a JSON object:
        {                               "intent":"general"
                                   }                                         
        """
        )

        human_msg = HumanMessage(content=lastmessage)
        response = llm.invoke([system_msg, human_msg])
        payload = json.loads(response.content)
        return payload

# llm_router("i want to perform credit underwriting for webtop id ABC123 and 8043g803jg20")

def knowledge_base(userinput) -> str:
    system_msg = SystemMessage(content="""
    You are an AI that only returns SQL SELECT queries based on user requests.
    You must only follow the provided schema and instructions.
    Return the result as a JSON object with a single key `query`, where the value is a valid SQL SELECT statement
    as a single-line string, without newlines or formatting.
    Only return the query in the following JSON format:
    {"query": "<SQL query>"}
 
    Use only the given schema. Do not guess column or table names.
 
    When writing INNER JOIN queries between any two tables, you must:
    - Only join on the column named `Webtop_ID`.
    - Only join tables that contain the column `Webtop_ID`.
    - Do not use any other column for joining.
 
    Always clarify and use the best matching table and columns based on the user's natural language description.  
    If unsure, choose the most relevant columns/tables described in the schema.
 
    You have access to the following database schemas:
    Here are the tables and their purposes:
    - Credit_Headers: This table includes the details of the customer, like customer name, PAN number, DOB, email ID, address, phone number, and the overall account details like total number of accounts, total live accounts, etc.
                               
    - Credit_Details: This table includes the history of customer loans like the opened date, loan amount, EMI amount, tenure, interest, account type, account status, derog status, loan type, etc.
                               
    - Credit_DPD: This table includes the DPD of the customer for each month. If the payment history starts from 20-02-2023 and ends on 07-09-2024, it will have the DPD for each month to check whether the customer has defaults in DPD, like not paying EMIs on time or having SUB/DBT/LSS in the DPD history.
                               
    - Credit_Enquries: This table includes the history of the customer's enquiries for loans, with enquiry date, enquiry amount, enquiry loan type, etc.
                               
    - Customer_Demog_Detail: This table is used to store customer demographic details such as Name, Date of Birth, PAN Number, Address, Email, and Mobile Number, which are extracted from various sources like the Application Form, KYC documents (CKYC, OKYC, VKYC), and scraped details from Salesforce (SFDC).
                               
    - Verifications_Detail: This table is used to store all compliance-related details such as CIBIL score, Hunter status, Posidex verification, PAN information, and other credit bureau checks required for risk assessment and underwriting. All fields in this table are extracted from the VM Summary Report, which consolidates data from multiple verification and fraud detection sources.
                               
    - ATR_Detail: This table is used to identify if any applicant has taken a loan from the organization and to check the current status of that loan. It also facilitates the extraction of key details such as the LAN (Loan Account Number) and other relevant information for further processing or verification.
                               
    - Offer_Detail: The OfferDetails table is used to store and track pre-approved or system-generated loan offer information for customers under the Personal Loan (PL) product segment

    1. Table: Credit_GPT.dbo.Credit_Headers  
    - Cibil_Member_Ref_No (nvarchar): Member Reference Number  
    - Consumer_Name (nvarchar): Name of the Customer  
    - Report_Date_Time (datetime): Date and time on which CIBIL report was created  
    - Gender (nvarchar): Customer Gender  
    - Date_Of_Birth (date): Customer Date of Birth  
    - Cibil_Score (nvarchar): Customer CIBIL Score  
    - PAN_No (nvarchar): Customer PAN Number  
    - PAN_Issuance_Date (date): Date on which Customer PAN Card was issued  
    - PAN_Expiry_Date (date): Customer's PAN Card Expiry Date  
    - Voter_Id (nvarchar): Customer Voter ID  
    - Voter_Id_Issuance_Date (date): Date on which Customer Voter ID was issued  
    - Voter_Id_Expiry_Date (date): Customer's Voter ID Expiry Date  
    - Ration_Card (nvarchar): Customer Ration Card  
    - Ration_Card_Issuance_Date (date): Date on which Customer Ration Card was issued  
    - Ration_Card_Expiry_Date (date): Customer's Ration Card Expiry Date  
    - Passport_No (nvarchar): Customer Passport Number  
    - Passport_Issuance_Date (date): Date on which Customer Passport was issued  
    - Passport_Expiry_Date (date): Customer's Passport Expiry Date  
    - Aadhar_No (nvarchar): Customer Aadhar Card Number  
    - Aadhar_Issuance_Date (date): Date on which Customer Aadhar Card was issued  
    - Aadhar_Expiry_Date (date): Customer's Aadhar Card Expiry Date  
    - Driving_Licence (nvarchar): Customer Driving License Number  
    - Driving_Licence_Issuance_Date (date): Date on which Customer Driving License was issued  
    - Driving_Licence_Expiry_Date (date): Customer's Driving License Expiry Date  
    - Primary_Mobile (nvarchar): Customer's Primary Mobile Number  
    - Alternate_Mobile (nvarchar): Customer's Alternate Mobile Number  
    - Email_Address (nvarchar): Customer Email Address  
    - Address_Office (nvarchar): Customer Office Address  
    - Address_Office_Category (nvarchar): Office Address Category  
    - Address_Permanent (nvarchar): Customer Permanent Address  
    - Address_Permanent_Category (nvarchar): Permanent Address Category  
    - Occupation_Code (nvarchar): Occupation Code from CIBIL Report  
    - Account_Type (nvarchar): Account Type from CIBIL Report  
    - Total_Account (nvarchar): Total number of accounts in CIBIL report  
    - Total_Account_Overdue (nvarchar): Total overdue accounts in CIBIL report  
    - Total_Overdue_Amount (decimal): Total overdue amount in CIBIL report  
    - Total_Balance_Amount (decimal): Total balance amount in CIBIL report  
    - DPD_3_30 (nvarchar): Days Past Due count in last 3 months  
    - DPD_6_15 (nvarchar): Days Past Due count in last 6 months  
    - DPD_12_90 (nvarchar): Days Past Due count in last 12 months  
    - Enq_7 (nvarchar): Count of enquiries in last 7 days  
    - Enq_30 (nvarchar): Count of enquiries in last 30 days  
    - Enq_90 (nvarchar): Count of enquiries in last 90 days  
    - Enq_180 (nvarchar): Count of enquiries in last 180 days  
    - Applicant_Type (nvarchar): Applicant Type from CIBIL report  
    - Application_ID (nvarchar): Customer Application Number  
    - No_Of_Enquiry (nvarchar): Number of enquiries in CIBIL report  
    - Loan_Principal_Outstanding (nvarchar): Loan principal outstanding  
    - Credit_Card_Outstanding (nvarchar): Credit card outstanding  
    - Live_Loan_Acc (nvarchar): Count of live loan accounts  
    - Deviation_Status (nvarchar): Deviation status  
    - Total_Sanc_Amnt (nvarchar): Total sanction amount in CIBIL report  
    - No_Of_HFS_Enquiry (nvarchar): Number of HFS-related enquiries  
    - Live_LAP_Loan (nvarchar): Count of live LAP loans  
    - Total_Unsecured_Live_Loan (nvarchar): Count of total unsecured live loans  
    - Total_LAP_Acc (nvarchar): Count of total LAP accounts  
    - Overidding_Status (nvarchar): Overriding status  
    - Derog_Account_Status (nvarchar): Derogatory account status  
    - Gold_DPD_Count (nvarchar): Count of gold loan DPD  
    - DPD_Count_12M (nvarchar): Count of DPD in last 12 months  
    - Total_Active_Sanc_Amnt (nvarchar): Total active sanction amount  
    - Credit_Card_Status (nvarchar): Credit card status  
    - Dubious_Loan_Count (nvarchar): Count of dubious loans  
    - Control_Number (nvarchar): Control number from CIBIL report  
    - Deviation_Level (nvarchar): Deviation level  
    - CC_Default (nvarchar): Credit card default status  
    - CC_DPD_6M (nvarchar): Credit card DPD in last 6 months  
    - CC_DPD (nvarchar): Total credit card DPD  
    - PSL_Default (nvarchar): Private sector loan default status  
    - Gold_Default (nvarchar): Gold loan default status  
    - Gold_DPD (nvarchar): Count of gold loan DPD  
    - Default_AllLoans_1 (nvarchar): Default status for all loans (variant 1)  
    - Default_AllLoans_2 (nvarchar): Default status for all loans (variant 2)  
    - dpd_les_30_Last_6M (nvarchar): DPD < 30 in last 6 months  
    - dpd_les_30_beyond_6M (nvarchar): DPD < 30 beyond 6 months  
    - dpd_gt_30_Last_6M (nvarchar): DPD > 30 in last 6 months  
    - dpd_gt_30_Beyond_6M (nvarchar): DPD > 30 beyond 6 months  
    - Age (nvarchar): Customer age  
    - Overdue_10K (nvarchar): Count of loans overdue by 10,000  
    - Overdue_1K (nvarchar): Count of loans overdue by 1,000  
    - Derog_Status (nvarchar): Derogatory loan status  
    - Loan_in_150Days (nvarchar): Loans active within 150 days  
    - Unsecured_Loan_6M (nvarchar): Count of unsecured loans in last 6 months  
    - Internal_Loan_2M (nvarchar): Count of internal loans in last 2 months  
    - Internal_Loan_6M (nvarchar): Count of internal loans in last 6 months  
    - Internal_Loan_12M (nvarchar): Count of internal loans in last 12 months  
    - Enquiries_30days (nvarchar): Count of enquiries in last 30 days  
    - Enquiries_6M_1lac_PL (nvarchar): Enquiries in last 6M for personal loans > ₹1L  
    - Enquiries_6M_ALL (nvarchar): Total enquiries in last 6 months  
    - DPD_12M (nvarchar): DPD count for 12 months  
    - DPD_30_6M (nvarchar): DPD 30 in last 6 months  
    - DPD_30_18M (nvarchar): DPD 30 in last 18 months  
    - Seasoning_less_23 (nvarchar): Loans seasoned less than 23 months  
    - Seasoning_Greater_23 (nvarchar): Loans seasoned more than 23 months  
    - Webtop_ID (nvarchar): Webtop ID (used for joining with other tables)  
    - Document_Type (nvarchar): Document type ("Old" or "New") — one Webtop ID may have both


2.Table: Credit_GPT.dbo.Credit_Details  
    - Account_No (nvarchar): Account Number  
    - Closed_Date (date): Loan Closed Date  
    - Opened_Date (date): Loan Open Date  
    - Last_Payment_Date (date): Last EMI Payment Date for the particular loan  
    - High_Credit (decimal): High Credit for the Loan  
    - Current_Balance (decimal): Current Balance mentioned for the particular loan  
    - Amount_Overdue (decimal): Overdue amount of the loan  
    - Account_Status (nvarchar): Loan Account Status  
    - Sanctioned_Amount (decimal): Loan Sanction Amount  
    - EMI (decimal): EMI of the Loan  
    - Account_Ownership (nvarchar): Loan Account Ownership  
    - Reported_Date (date): Loan Reported Date in the CIBIL Report  
    - Credit_Limit (decimal): Loan Credit Limit  
    - Cash_Limit (decimal): Loan Cash Limit  
    - Payment_Start_Date (date): Loan Payment Start Date  
    - Payment_End_Date (date): Loan Payment End Date  
    - Collateral_Type (nvarchar): Loan Collateral Type  
    - Payment_Frequency (nvarchar): Loan Payment Frequency  
    - Repayment_Tenure (nvarchar): Loan Repayment Tenure  
    - Interest_Rate (decimal): Interest Rate  
    - Actual_Payment (decimal): Actual Payment  
    - Loan_Type (nvarchar): Loan Type  
    - Cibil_Account_No (nvarchar): CIBIL Account Number  
    - Member_Name (nvarchar): Loan Member Name  
    - DPD_3_30 (nvarchar): Count of DPD in last 3 months  
    - DPD_6_15 (nvarchar): Count of DPD in last 6 months  
    - DPD_12_90 (nvarchar): Count of DPD in last 12 months  
    - Applicant_Type (nvarchar): Loan Applicant Type  
    - Application_ID (nvarchar): Customer Application ID  
    - PAN_No (nvarchar): Customer PAN Number  
    - Source (nvarchar): Loan Source  
    - Obligation_Status (nvarchar): Loan Obligation Status  
    - Account_Loan_Status (nvarchar): Account Loan Status  
    - Control_Number (nvarchar): Control Number  
    - Webtop_ID (nvarchar): Webtop ID (used to link with `Credit_Headers`)  
    - Document_Type (nvarchar): Document Type (can be "Old" or "New" for the same Webtop ID)  


3.Table: Credit_GPT.dbo.Credit_DPD  
    - Webtop_ID (nvarchar): Webtop ID  
    - Account_No (nvarchar): Account Number  
    - DPD (nvarchar): Due Past Days (DPD) present in the CIBIL Report  
    - DPD_Month (nvarchar): DPD Month  
    - Applicant_Type (nvarchar): Applicant Type  
    - Application_ID (nvarchar): Application ID  
    - PAN_No (nvarchar): Customer PAN Number  
    - Revised_DPD (nvarchar): Revised DPD  
    - EMI_Days (date): EMI Days  
    - Updated_EMI_Date (date): Updated EMI Date  
    - Control_Number (nvarchar): Control Number  
    - Document_Type (nvarchar): Document Type (e.g., "Old" or "New")  

4.Table: Credit_GPT.dbo.Credit_Enquries  
    - Webtop_ID (nvarchar): Webtop ID  
    - Document_Type (nvarchar): Document Type (can be "Old_CIBIL_Report" or "New_CIBIL_Report" — in some cases, both exist for one Webtop ID)  
    - Member (nvarchar): Member Type  
    - Enquiry_Date (date): Enquiry date for the particular loan enquiry  
    - Enquiry_Purpose (nvarchar): Purpose of loan for the particular enquiry  
    - Enquiry_Amount (decimal): Enquiry amount for the particular loan  
    - Cibil_Member_Ref_No (nvarchar): CIBIL reference number for the particular enquiry  
    - Applicant_Type (nvarchar): Applicant Type for the particular enquiry  
    - Application_ID (nvarchar): Application ID  
    - PAN_No (nvarchar): PAN Number  
    - Control_Number (nvarchar): Control Number  

5.table: Credit_GPT.dbo.Customer_Demog_Detail
    - Webtop_ID: Unique identifier for tracking applications in the credit system.
    - Case_Number: Reference number for the loan or screening case.
    - Customer_Name: Customer Name extracted from Input Extract Report.
    - APF_Name: Customer name extracted from the application form.
    - KYC_Name: Customer name as per official KYC document.
    - SFDC_Customer_name: Name as captured in SFDC (CRM system).
    - APF_DOB: Date of birth from application form.
    - KYC_DOB: Date of birth from KYC documents.
    - SFDC_DOB: Date of birth as per SFDC records.
    - APF_Pan_No: PAN number from application form.
    - SFDC_Pan_No: PAN number from SFDC.
    - APF_Address: Residential address from the application form.
    - KYC_Address: Address as per KYC documents.
    - SFDC_Address: Address from SFDC CRM.
    - NgeativeArea_Matser_Address: Address flagged as high-risk or blacklisted area.
    - APF_Pin_Code: Pincode from application form address.
    - KYC_Pincode: Pincode from KYC address.
    - SFDC_Pin_Code: Pincode from SFDC address.
    - APF_Mobile_No: Mobile number from application form.
    - SFDC_Mobile_No: Mobile number from SFDC system.
    - APF_Email: Email ID from the application form.
    - SFDC_Email: Email ID from SFDC records.
    - APF_Presence: Indicator of applicant's physical presence during application.
    - APF_Loan_Amt: Requested loan amount from the application.
    - SFDC_Loan_Amt: Loan amount recorded in SFDC.
    - APF_Tenure: Requested loan tenure (in months/years).
    - SFDC_Tenure: Loan tenure recorded in SFDC.
    - SFDC_Customer_Age: Customer’s calculated age from SFDC.
    - SFDC_Maturity_Age: Age of customer at the end of loan tenure.
    - SFDC_DSA_Connector_name: Extract the DSA Name from SFDC.
    - KYC_Photo_flag: Flag indicating if KYC photo is available or valid.
    - Liveness_Live: Check The Liveliness Status of Customer.
    - Face_Match_Score: Extract The Face Match score from document.
    - Live_Photo_flag: Flag showing if a live photo was successfully taken.
    - Match_Flag: Final flag indicating identity match success/failure.
    - Explosre_check: Indicating the Maximum Amount of Loan for exposure.
    - APF_Resi_Address: Detailed residential address from application form.
    - APF_Office_Address: Applicant's office/employer address from application form.

6.table_name: Credit_GPT.dbo.Verifications_Detail

    - Webtop_ID: Unique system-generated ID for the loan application process.
    - Case_Number: Identifier for the specific loan case or customer application.
    - Customer_Name: Customer Name extracted from Input Extract Report.
    - VM_Cust_Name_asperApp: Name as per application form (from VM Summary).
    - VM_Cust_Name_asperBeauro: Name as reported by credit bureau (from VM Summary).
    - Cibil_Name: Name extracted directly from CIBIL report.
    - SFDC_Customer_name: Name pulled from SFDC CRM.
    - Cibil_Date: Date on which CIBIL report was pulled.
    - VM_DOB_asperApp: DOB from application form (via VM Summary).
    - VM_DOB_asperBeauro: DOB from credit bureau (via VM Summary).
    - Cibil_DOB: DOB reported in CIBIL report.
    - SFDC_DOB: DOB as per SFDC records.
    - VM_Pan_asperApp: PAN number entered in the application (via VM Summary).
    - SFDC_Pan_No: PAN number recorded in SFDC.
    - VM_MobileNo_asperApp: Mobile number entered in the application (via VM Summary).
    - VM_MobileNo_asperBeauro: Mobile number reported by credit bureau (via VM Summary).
    - SFDC_Mobile_No: Mobile number recorded in SFDC.
    - VM_Cibil_score: CIBIL score fetched via VM Summary module.
    - Cibil_Score: Credit score as per the official CIBIL report.
    - VM_Hunter_Status: Match status from Hunter (fraud detection tool), via VM Summary.
    - VM_Hunter_Score: Risk score from Hunter system (via VM Summary).
    - VM_BRE_Decision: Final decision output from Business Rule Engine (Approve/Reject/Refer).
    - VM_Employeed_Type: Employment type from application (via VM Summary).
    - SFDC_Employeed_Type: Employment type recorded in SFDC CRM.
    - VM_Email_asperApp: Email ID from the application form (via VM Summary).
    - VM_Email_asperBeauro: Email ID reported by the credit bureau (via VM Summary).
    - Cibil_Address: Customer address from CIBIL report.
    - SFDC_Address: Address from SFDC system.
    - KYC_Aadhar_No: Aadhaar number collected during KYC.
    - KYC_Aadhar_link: Flag indicating if Aadhaar is linked with PAN/Mobile (Yes/No).
    - KYC_Aadhar_Match: Result of Aadhaar number matching with other sources.
    - KYC_Verified: Indicates if Aadhaar-based KYC is successfully verified.
    - Cibil_Pincode: Pin code derived from address in CIBIL report.
    - VM_Posidex_Status: Status from Posidex deduplication check (fraud match/no match).
    - VM_Pan_asperBeauro: PAN number from bureau report (via VM Summary).
    - Past_Last_3_Months_Status: Summary of repayment performance in past 3 months from bureau.
    - Cibil_Pan_No: PAN number from CIBIL data.
    - Cibil_Overdue: Amount overdue as per CIBIL report.
    - Liabelity_Deatils: Existing liabilities (loan, credit card, etc.) from credit report.
    - Cibil_Enquiry_Count: Count of credit enquiries in recent months (credit hunger signal).
    - VM_Calculation_Method: Method used to compute derived financial fields (manual/auto/rule-based).


7.table: Credit_GPT.[dbo].[ATR_Detail]

    - Webtop_ID: Unique system ID used to track the application or customer in the platform.
    - Case_Number: Reference number assigned to the specific loan or application case.
    - Customer_Name: Name of the customer associated with the loan application.
    - ATR_Primary_Name: Primary applicant’s name from the ATR (Application Tracking Report).
    - ATR_Branch_Name: Branch location where the application was initiated or processed.
    - ATR_Reason: Reason code for application status (e.g. rejection, hold, discrepancy).
    - ATR_Scheme: Loan scheme or product type applied under.
    - ATR_ApplicationNo: Unique identifier for the application form in the ATR.
    - ATR_LAN_No: Loan Account Number generated post sanction.
    - ATR_Application_Created_By: User ID or system that created the loan application in ATR.
    - ATR_Active_Status: Indicates whether the application is active, inactive, or cancelled.
    - ATR_Pending: Shows if there are any pending actions or tasks on the application.
    - ATR_Last_Action_Date: Timestamp of the most recent action taken on the application.
    - ATR_Last_Updated_Date: Timestamp when the record was last updated in the ATR.
    - ATR_Requested_Amount: Loan amount requested by the customer in the application.
    - SOA_Address: Address as mentioned in the Statement of Account (SOA).
    - SOA_Outstanding_POS: Current outstanding principal amount from SOA.
    - SOA_Loan_Status: Current loan status (e.g. Active, Closed, Delinquent) from SOA.
    - SOA_Clousre_Type: Type of loan closure (e.g. Normal, Pre-closure, Settlement).
    - SOA_Recent_Bounce: Indicates whether a recent EMI payment has bounced.
    - SOA_Status: Overall health or status of the account per the Statement of Account.
    - Customer_Type: Specifies if the customer is new, repeat, walk-in, DSA-sourced, etc.
    - ATR_Last_Action_Date_Status: Status flag based on the timing of the last action (e.g., stale, recent).

8.table_name: Credit_GPT.[dbo].[Offer_Detail]

    - Webtop_ID: Unique system-generated ID for tracking the customer or offer record.
    - Case_Number: Application or customer case number linked to the offer.
    - Customer_Name: Name of the customer to whom the offer is made.
    - Offer_Loan_Amt: Loan amount offered to the customer.
    - SDFC_Loan_Amt: Loan amount as recorded or calculated in Salesforce (SFDC).
    - Offer_Validity_Date: Date until which the offer remains valid.
    - Offer_tenure: Proposed loan tenure (in months) under the offer.
    - SFDC_Tenure: Loan tenure as per Salesforce application record.
    - Offer_DOB: Date of birth used for offer creation or matching.
    - SFDC_DOB: Date of birth from the Salesforce profile.
    - Offer_Pan_No: PAN number used during offer generation.
    - SFDC_Pan_No: PAN number from Salesforce records.
    - Offer_Flag: Flag to indicate whether the offer is active, accepted, or expired.
    - SFDC_Scheme_Flag: Internal scheme flag from Salesforce indicating the applied offer scheme.
    - SFDC_Member_Reference_ID: Salesforce member or lead reference ID linked to the customer.
    - Last_Four_Pan_No: Last 4 digits of the PAN number for display/security purposes.
    - Offer_Pincode: Pincode used to determine customer location for the offer.
    - Offer_Product: Product type under which the offer is made (e.g., Personal Loan, Top-up).
    - Offer_Name: Name or title of the offer assigned to the customer.
    - Offer_Scorecard_cat: Category of the credit scorecard used for offer generation (e.g., Prime, Subprime).
    - Offer_Min_Tenure: Minimum tenure the customer can choose for the loan offer.
    - Offer_Max_Tenure: Maximum allowed tenure for the loan offer.
    - Offer_Expiry_Date: Date when the offer will expire or become invalid.
    - Offer_Campaign_Name: Marketing or promotional campaign name tied to the offer.
                               
      
    """)
 
    human_msg = HumanMessage(content=userinput)
 
    response = llm.invoke([system_msg, human_msg])

    payload = json.loads(response.content)
    query = payload["query"]
    print(query)
    data = execute_sql_query(query)
    prompt_text = (
    "As per the user input, the database was queried and the following rows were fetched:\n"
    f"{data}\n\n"
   "Convert the following JSON-like Python data into a Markdown table."
    "Use human-readable headers (e.g. account_no → Account Number)."
    "Only output the table; no extra text."
            )
    
    llm_response = llm.invoke(
                input=prompt_text,
                temperature=0.1
            )
    
    summary = llm_response.content
    return summary


def general_response(userinput) -> str:
    system_msg = system_msg = SystemMessage(content="""
You are CreditKnowledgeAssistant, an expert in credit underwriting, NBFC operations, banking regulations, and credit-related terminology. Your job is to clearly and accurately explain any term, process, or FAQ related to these domains.

• If the user’s query involves any of the following:
    – Credit underwriting processes or steps
    – Terms related to NBFCs (Non-Banking Financial Companies)
    – Banking industry terms (e.g. loan types, account classifications, compliance)
    – Credit scores, bureau reports, CIBIL, Experian, Equifax, etc.
    – Loan eligibility, interest rates, repayment structures
    – Risk assessment, KYC, AML, and regulatory checks

   → Answer in a simple, accurate, and concise manner using your internal knowledge.

• If the question is **not** related to any of the above domains, respond with:
   “Currently we only provide services related to Credit, Banking, and NBFC-related tasks. Please provide a relevant query.”
""")
 
    human_msg = HumanMessage(content=userinput)
 
    response = llm.invoke([system_msg, human_msg])
    return response.content