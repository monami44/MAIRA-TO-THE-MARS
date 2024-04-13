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


from dotenv import load_dotenv
load_dotenv()



def signal_handler(sig, frame):
    print('Received shutdown signal, exiting...')
    sys.exit(0)

# Register signal handler for graceful shutdown
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)



class ControllingCrew:
  def __init__(self):
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
    
    general_controller=agents.general_controller()

    controll_output=tasks.controll_output(general_controller)

    crew = Crew(
       agents=[general_controller],
       tasks=[controll_output],
       verbose=True,
       process=Process.sequential,
       manager_llm=self.llm,
       function_calling_llm=self.llm,
       
    )


    result = crew.kickoff()
    return result
  

if __name__ == "__main__":
    # Initialize the ControllingCrew without specifying a company.
    controlling_crew = ControllingCrew()

    # Run the main process of the ControllingCrew.
    result = controlling_crew.run()

    # Output the result of the ControllingCrew's run method.
    print("Process result:")
    print(result)




  


