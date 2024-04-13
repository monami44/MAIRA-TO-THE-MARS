from crewai import Crew, Process
from textwrap import dedent
from brad_analysis_agents import BradAnalysisAgents
from brad_analysis_tasks import BradAnalysisTasks
import signal
import sys



from langchain_openai import ChatOpenAI

from langchain_groq import ChatGroq

from langchain_google_genai import ChatGoogleGenerativeAI

from langchain_anthropic import ChatAnthropic


from dotenv import load_dotenv
load_dotenv()


def signal_handler(sig, frame):
    print('Received shutdown signal, exiting...')
    sys.exit(0)

# Register signal handler for graceful shutdown
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)




class FinancialCrew8:
  def __init__(self, company):
    self.company = company
    self.llm = ChatAnthropic(
                    temperature=0, 
                    anthropic_api_key="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", 
                    model_name="claude-3-haiku-20240307"
                )

    
    
    
  def run(self):
    
    
    agents = BradAnalysisAgents()
    tasks = BradAnalysisTasks()

    self.llm = ChatAnthropic(
                    temperature=0, 
                    anthropic_api_key="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", 
                    model_name="claude-3-haiku-20240307"
                )

    
    
    
    
    key_points_of_difference_researcher=agents.sup_key_points_of_difference_researcher()
    
    
    

    

    
    find_key_points_of_difference = tasks.find_key_points_of_difference(key_points_of_difference_researcher, self.company)
    
    

    crew = Crew(
      agents=[
        key_points_of_difference_researcher,
       
      
      ],
      
      tasks=[
        find_key_points_of_difference,
        

      ],
      verbose=True,
      function_calling_llm=self.llm,
      process=Process.sequential,
      max_rpm=1,
      manager_llm=self.llm
    )

    result = crew.kickoff()
    return result
  


if __name__ == "__main__":
  print("## Welcome to Brad's AICrew")
  print('-------------------------------')
  company = input(
    dedent("""
      What is the company you want to analyze?
    """))
  
  financial_crew = FinancialCrew8(company)
  result = financial_crew.run()
  print("\n\n########################")
  print("## Here is the Report")
  print("########################\n")
  print(result)
