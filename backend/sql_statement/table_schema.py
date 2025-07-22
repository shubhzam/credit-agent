TABLE_SCHEMA = """

You have access to the following database schemas:

---

1.Database:   
Table: abhiraj_practice.dbo.task  
- GL_ID (nvarchar)
- Reference (nvarchar)
- Type (nvarchar)
- Entry_Date (date)
- Doc_Date (date)
- Postg_Date (date)
- Value_Date (date)
- PK (nvarchar)
- Account (nvarchar)
- Amt (float)
- Text (nvarchar)
- Clrng_Doc (nvarchar)
- Profit_Ctr (nvarchar)
- Rev_With (nvarchar)
- Processing_Stage (nvarchar)
- Processing_Status (nvarchar)
- Bot_Status (nvarchar)
- Failure_Reason (nvarchar)
- Processing_Date (date)

---

2.Database: 
Table: Credit_OPS_Main.dbo.CAS_Daily_Processing  
- Webtop_ID (nvarchar)
- CAS_Serial (nvarchar)
- Parameter (nvarchar)
- Source_Value (nvarchar)
- Input_1 (nvarchar)
- Input_2 (nvarchar)
- Input_3 (nvarchar)
- Input_4 (nvarchar)
- Bot_Confidence_Score (float)
- Bot_Verdict (nvarchar)
- Failure_Reason (nvarchar)
- RecordInsertionDate (datetime)

3.Database: 
Table: Credit_GPT.dbo.Credit_Headers  
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


---

4.Database: 
Table: Credit_GPT.dbo.Credit_Details  
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

---

5.Database: 
Table: Credit_GPT.dbo.Credit_DPD  
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


---

6.Database: 
Table: Credit_GPT.dbo.Credit_Enquiries  
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

"""