from flask import Flask, request, jsonify, render_template, send_file
from flask_pymongo import PyMongo
import concurrent.futures
import subprocess
import os
import re
import time
import json




import datetime



from datetime import datetime


from langchain_anthropic import ChatAnthropic
import crewai
from brad_analysis_agents import BradAnalysisAgents
from brad_analysis_tasks import BradAnalysisTasks
from textwrap import dedent
from crewai import Crew, Process

from crewai_tools import WebsiteSearchTool








from urllib.parse import unquote

from groq import Groq
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import yaml
load_dotenv()

import openai
import datetime
from datetime import datetime
from bson import json_util
openai_api_base = os.getenv('OPENAI_API_BASE')
openai_model_name = os.getenv('OPENAI_MODEL_NAME')
openai_api_key = os.getenv('OPENAI_API_KEY')

import firebase_admin
from firebase_admin import credentials, db

# Initialize the Firebase Admin SDK
cred = credentials.Certificate('/Users/maksymliamin/Desktop/Work/Data Science/Crew AI/brad_Financeteam  Claud/brad-finance-team-firebase-adminsdk-hssdi-c3930799c2.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://brad-finance-team-default-rtdb.europe-west1.firebasedatabase.app'
})



app = Flask(__name__)

app.config["MONGO_URI"] = os.environ.get("MONGO_URI")

    
mongo = PyMongo(app)


client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def fetch_data_from_firebase(company):
    # The structure of how your data is stored in Firebase will dictate how you fetch it
    ref = db.reference(f'/reports/{company}')
    report_data = ref.get()
    return report_data

# Define the mapping between the text file names and the sections in your document
file_section_mapping = {
 #   "legal_company_name": "Legal Company Name",
 # "headquarters": "Headquarters",
 #   "year_incorporated": "Year Incorporated",
#    "lines_of_business": "Line(s) of business",
#    "brief_synopsis": "Brief synopsis",
#    "banner_brands": "Banner brands",
 #   "target_market": "Target market",
 #   "revenue": "Revenue",
 #   "financial_performance_2023": "Financial performance 2023",
 #  "market_capitalization": "Market capitalization",
 #  "company_owner": "Company owner",
 # "founding_story": "Founding story",
 #   "key_points_of_difference": "Key points of difference",
 #  "top_5_strategic_initiatives": "Top 5 strategic initiatives",
 #   "worries_risks_and_concerns": "Worries, risks and concerns",
 #   "main_competitors": "Main competitors",
 #   "swot_analysis": "SWOT Analysis",
 #   "store_design_images": "Store design images",
 # "design_agency": "Store design agency",
   "recent_news": "Recent company news",
   "recent_executive_moves": "Recent executive moves"
}


# Define your section template
section_template = {
        "Legal Company Name": "...",
        "Headquarters": "...",
        "Year Incorporated": "...",
        "Line(s) of business": "...",
        "Brief synopsis": "...",
        "Banner brands": "...",
        "Target market": "...",
        "Revenue": "...",
        "Financial performance 2023": "...",
        "Market capitalization": "...",
        "Company owner": "...",
        "Founding story": "...",
        "Key points of difference": "...",
        "Top 5 strategic initiatives": "...",
        "Worries, risks and concerns": "...",
        "Main competitors": "...",
        "SWOT Analysis": "...",
        "Store design images": "...",
        "Store design agency": "...",
        "Recent company news": "...",
        "Recent executive moves": "..."
    }

# Function to run each main file, passing the company name as a command-line argument
def run_script(script_name, company):
    try:
        subprocess.run(['python3', script_name], input=company, text=True, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running script {script_name}: {e}")
        return False

def execute_scripts_in_batches(batches, company):
    success = True
    for batch in batches:
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = [executor.submit(run_script, script, company) for script in batch]
            for future in concurrent.futures.as_completed(futures):
                if not future.result():
                    success = False
    return success

# Function to check if a section exists in Firebase
def check_required_sections_and_trigger(company, sections_required, retries=3):
    for attempt in range(retries):
        try:
            # Reference to the company's reports in Firebase
            sections_ref = db.reference(f'reports/{company}')
            
            # Fetch all sections for the company from Firebase
            sections_data = sections_ref.get() if sections_ref.get() else {}
            sections_present = sections_data.keys()

            missing_sections = [section for section in sections_required if section not in sections_present]

            if not missing_sections:
                print("All required sections are present.")
                return True

            print(f"Attempt {attempt + 1} of {retries}: Missing sections for company: {company}")
            for section in missing_sections:
                print(f"- {section}")
                # Assuming `run_script` is adapted to handle section generation directly in Firebase
                if not run_script(section, company):
                    raise Exception(f"Failed to generate required section: {section}")
            
            print("All missing sections processed on this attempt.")
            return True
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            time.sleep(10)  # Sleep for 10 seconds before retrying
    return False




def compile_and_clean_report(company):
    # Reference to where individual sections are stored in Firebase
    sections_ref = db.reference(f'reports/{company}')

    # Fetch all sections for the company from Firebase
    sections_data = sections_ref.get() if sections_ref.get() else {}

    # Initialize the report dictionary with the company title
    compiled_report = {"Retailer Profile": company, "sections": {}}

    # Iterate over each section retrieved from Firebase
    for section_title, section_details in sections_data.items():
        # Create a dictionary for the section
        section_dict = {}
        
        # Iterate over the details within the section
        for detail_key, detail_value in section_details.items():
            # Assume detail_value is already properly formatted
            section_dict[detail_key] = detail_value
        
        # Add the section dictionary to the compiled report under the section title
        compiled_report["sections"][section_title] = section_dict

    # Save the compiled report dictionary into Firebase, under a node for compiled reports
    compiled_report_ref = db.reference(f'compiled_reports/{company}')
    compiled_report_ref.set(compiled_report)

    print(f"Compiled report saved to Firebase for: {company}")
    return True








def extract_urls_from_report(report_content):
    # This regex pattern looks for strings that start with http:// or https://
    # and continue until a space or newline. It's a simple pattern and might need
    # to be adjusted based on the actual content of the reports.
    url_pattern = re.compile(r'https?://[^\s]+')
    
    # Find all non-overlapping matches in the string
    urls = re.findall(url_pattern, report_content)
    
    # The regex might capture trailing punctuation which is part of HTML, not the URL.
    # This simple filter removes common trailing characters.
    urls = [url.strip('.,;:"\'') for url in urls]
    
    return urls



   

def save_chat_context(company, report_context, urls):
    chat_contexts = mongo.db.chat_contexts
    chat_contexts.update_one(
        {'company': company},
        {'$set': {'report_context': report_context, 'urls': urls}},
        upsert=True
    )

def get_chat_context(company):
    chat_context = mongo.db.chat_contexts.find_one({'company': company})
    if chat_context:
        report_context = chat_context.get('report_context', None)
        urls = chat_context.get('urls', [])
        conversation_history = chat_context.get('conversation_history', [])
        return report_context, urls, conversation_history
    else:
        return None, [], []


def save_interaction(company, question, answer):
    # Append the new interaction to the conversation history
    new_interaction = {'question': question, 'answer': answer, 'timestamp': datetime.utcnow()}
    mongo.db.chat_contexts.update_one(
        {'company': company},
        {'$push': {'conversation_history': new_interaction}},
        upsert=True
    )

def get_latest_interaction(company):
    interactions = mongo.db.interactions
    latest_interaction = interactions.find_one(
        {'company': company},
        sort=[('timestamp', -1)]
    )
    if latest_interaction:
        return latest_interaction.get('question'), latest_interaction.get('answer')
    else:
        return None, None



    




class WebsiteSearchCrew:
  def __init__(self, company, urls, question):
    self.company = company
    self.urls = urls
    self.question = question

    self.llm = ChatAnthropic(
                    temperature=0, 
                    anthropic_api_key=os.environ.get("ANTHROPIC_API_KEY"),
                    model_name="claude-3-haiku-20240307"
                )

 
  def run(self):
    
    
    agents = BradAnalysisAgents()
    tasks = BradAnalysisTasks()
    
    webpage_scraper = agents.webpage_scraper()
    scrape_webpage = tasks.scrape_webpage(webpage_scraper, self.company, self.urls, self.question)

    crew = Crew(
      agents=[
        webpage_scraper,
      
      
      ],
      
      tasks=[
        scrape_webpage,
       

      ],
      verbose=True,
      function_calling_llm=self.llm,
      max_rpm=15,
      process=Process.sequential,
      manager_llm=self.llm
    )

    result = crew.kickoff()
    return result
  


def save_data_to_firebase(data, company):
    # Reference to your database, specify a path where you want to store your data
    ref = db.reference(f'/reports/{company}/result_scraping')
    
    # Pushing data to the database, which creates a unique ID for the entry
    ref.push(data)








@app.route('/')
def index():
    # Serve the HTML file
    return render_template('index.html')

@app.route('/run-script', methods=['POST'])
def handle_run_script():
    company = request.json['company']

    scripts = ['main20.py', 'main21.py']
    


    sections_required = [
   #     "legal_company_name",
    #    "headquarters",
     #   "year_incorporated",
      #  "lines_of_business",
     #   "brief_synopsis",
     #   "banner_brands",
    # "target_market",
    #    "revenue",
    #    "financial_performance_2023",
    #    "market_capitalization",
    #    "company_owner",
    #    "founding_story",
    #    "key_points_of_difference",
    #    "top_5_strategic_initiatives",
    #    "worries_risks_and_concerns",
    #    "main_competitors",
    #    "swot_analysis",
    #    "store_design_images",
    #    "design_agency",
        "recent_news",
        "recent_executive_moves"
    ]

    # Divide the scripts into batches for execution
    batch1 = scripts[0:2]   # Scripts 1-5
  #  batch2 = scripts[5:10]  # Scripts 6-10
  #  batch3 = scripts[10:15] # Scripts 11-15
  #  batch4 = scripts[15:21]   # Scripts 16-21

    # Execute the scripts in batches
    execute_scripts_in_batches([batch1, batch2, batch3, batch4], company)

    # After executing all scripts, check for missing files
    print("Checking for missing files...")
    check_required_sections_and_trigger(company, sections_required, retries=3)

    # Now, compile and clean the report after all scripts have been executed
    compile_and_clean_report(company)

    success = compile_and_clean_report(company)

    if success:
        # Fetch the compiled report from Firebase
        compiled_report_ref = db.reference(f'compiled_reports/{company}')
        report_data = compiled_report_ref.get()
        
        if report_data and 'reportContent' in report_data:
            # Ensure that report_content is a string
            report_content = report_data['reportContent']
            message = f"Report successfully compiled for {company}"

            # Pass the string to the function
            urls = extract_urls_from_report(report_content)

            # Save report context and URLs to MongoDB (or a suitable storage)
            save_chat_context(company, report_content, urls)
        else:
            message = "Failed to compile the report for {company}"
            report_content = ""
            urls = []
    else:
        message = "Failed to initiate report compilation for {company}"
        report_content = ""
        urls = []

    # Return both the message and the report content
    return jsonify(message=message, reportContent=report_content)




@app.route('/get-report')
def get_report():
    # Assuming the company name is passed as a query parameter
    company = request.args.get('company')

    if not company:
        return jsonify(error="Company not specified"), 400

    # Reference to the compiled report in Firebase
    compiled_report_ref = db.reference(f'compiled_reports/{company}')  # No need for "compiled_report_" prefix if the key in Firebase doesn't have it

    # Fetch the compiled report for the company from Firebase
    report_data = compiled_report_ref.get()

    if report_data:
        return jsonify(report_data)  # Return the report JSON object directly
    else:
        return jsonify(error="Report not found"), 404




    



@app.route('/interact', methods=['POST'])
def handle_interaction():
    data = request.json
    company = data.get('company')
    question = data.get('question', '')

    # Fetch report context, URLs, and conversation history
    report_context, urls, conversation_history = get_chat_context(company)

    if not report_context or not urls:
        return jsonify({"error": "Report context or URLs not found for the specified company."})

    if not question:  # Ensure a question is provided
        return jsonify({"error": "Please provide a question."})

    # Initialize and run WebsiteSearchCrew with the fetched URLs and question
    crew = WebsiteSearchCrew(company=company, urls=urls, question=question)
    result_scraping = crew.run()  # Run the Crew.ai scraping task and capture the result
    save_data_to_firebase(result_scraping, company)
    print("Data has been saved to Firebase.")

    ref = db.reference(f'/reports/{company}/result_scraping')
    try:
        results = ref.get()
        # Assuming the latest result is the last one in the database
        latest_result = next(reversed(results.values()))
    except Exception as e:
        print("Failed to retrieve data from Firebase:", e)
        latest_result = "Data retrieval error"

    # Use the latest result as the primary source for the answer
    groq_response = latest_result

    # If no answer was found in Firebase, use Groq API to generate a response
    if not groq_response:
        messages = [
            {"role": "system", "content": "you are a helpful assistant."},
            *conversation_history,
            {"role": "user", "content": question}
        ]

        chat_completion = client.chat.completions.create(
            messages=messages,
            model="mixtral-8x7b-32768",
            temperature=0.01,
            max_tokens=1024,
            top_p=1,
            stop=None,
            stream=False,
        )
        groq_response = chat_completion.choices[0].message.content if chat_completion.choices else "No response"

    # Save the new interaction with the response to MongoDB only if Groq AI was used
    if not results:
        save_interaction(company, question, groq_response)

    # Respond with the final answer
    return jsonify({"answer": groq_response})








if __name__ == '__main__':
    app.run(debug=True, port=5001)
