!pip install --upgrade openai
!pip install jsonlines

import os
import openai
from openai import OpenAI
import json

os.environ['OPENAI_API_KEY']="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"

#get user input 
user_input = input("Get user input:")

#chat prompt for now
prompt = f"""Based on the user's input {user_input} Break it down into subtopics at most 4 and I need 
you to generate a list of questions anywhere from 3 to 5 questions per topic and I need you to tell me the 
number of topics/subtopics generated and the number of questions per topic and please give it to me in the 
format number_of_topics = x and questions_per_topic_numbers = [A1, A2, ...]. Please also give it as multiple 
choice of 4 options and list the corresponding correct answer and whether the question difficulty based on a 
1-5 scale (1 being the easiest). Give the final output to me in json format."""

#calling chat with prompt
client = OpenAI()

response = client.responses.create(
  model="gpt-4.1-nano",
  input= prompt
)
#print(response.output_text)

#This gives the json file containing the number of topics, questions per topic numbers, 

start_writing = False
file_path = "output.json"

with open(file_path, 'w') as json_file:
    for line in response.output_text.splitlines():
        #print("line", line)
        if '```' in line: 
            start_writing = False
        if '```json' in line:
            start_writing = True
    
        if start_writing:
            print(line)
            json_file.write(line)
            json_file.write("\n")

#to get rid of the '''json
with open(file_path, 'r') as f:
    lines = f.readlines()

with open(file_path, 'w') as f:
    f.writelines(lines[1:])
