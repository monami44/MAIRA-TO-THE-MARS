from crewai import Crew, Process
from textwrap import dedent
from brad_analysis_agents import BradAnalysisAgents
from brad_analysis_tasks import BradAnalysisTasks
import signal
import sys

import os

from langchain_openai import ChatOpenAI

from langchain_groq import ChatGroq

from langchain_google_genai import ChatGoogleGenerativeAI

from langchain_anthropic import ChatAnthropic

import firebase_admin
from firebase_admin import credentials, db

# Initialize the Firebase Admin SDK
cred = credentials.Certificate('/Users/maksymliamin/Desktop/Work/Data Science/Crew AI/brad_Financeteam  Claud/brad-finance-team-firebase-adminsdk-hssdi-c3930799c2.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://brad-finance-team-default-rtdb.europe-west1.firebasedatabase.app'
})


from dotenv import load_dotenv
load_dotenv()


def signal_handler(sig, frame):
    print('Received shutdown signal, exiting...')
    sys.exit(0)

# Register signal handler for graceful shutdown
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)





class FinancialCrew00:
  def __init__(self, company):
    self.company = company
    self.llm = ChatAnthropic(
                    temperature=0, 
                    anthropic_api_key=os.environ.get("ANTHROPIC_API_KEY"),
                    model_name="claude-3-haiku-20240307"
                )

    
    
  def run(self):
    
    
    agents = BradAnalysisAgents()
    tasks = BradAnalysisTasks()

    self.llm = ChatAnthropic(
                    temperature=0, 
                    anthropic_api_key=os.environ.get("ANTHROPIC_API_KEY"),
                    model_name="claude-3-haiku-20240307"
                )


    
    
    
    

    
    
    
    headquaters_researcher = agents.headquaters_researcher()
    
    

    
    
    
    find_headquaters = tasks.find_headquaters(headquaters_researcher, self.company)

    
    

    crew = Crew(
      agents=[
        
        headquaters_researcher,
      
      ],
      
      tasks=[
        
        find_headquaters,

      ],
      verbose=True,
      function_calling_llm=self.llm,
      max_rpm=16,
      max_tokens=16666,
      process=Process.sequential,
      manager_llm=self.llm
    )

    result = crew.kickoff()
    return result



def save_data_to_firebase(data, company):
    # Reference to your database, specify a path where you want to store your data
    ref = db.reference(f'/reports/{company}/headquarters')
    
    # Pushing data to the database, which creates a unique ID for the entry
    ref.push(data)


if __name__ == "__main__":
  print("## Welcome to Brad's AICrew")
  print('-------------------------------')
  company = input(
    dedent("""
      What is the company you want to analyze?
    """))
  
  financial_crew = FinancialCrew00(company)
  result = financial_crew.run()
  print("\n\n########################")
  print("## Here is the Report")
  print("########################\n")
  print(result)

save_data_to_firebase(result, company)
print("Data has been saved to Firebase.")

