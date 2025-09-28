from flask import Flask, request, jsonify
import os
import openai
from openai import OpenAI
import json

#pip install -r requirements.txt

app = Flask(__name__)

os.environ['OPENAI_API_KEY']="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"

client = OpenAI()

@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    data = request.get_json()

    if not data or 'user_input' not in data:
        return jsonify({'error': 'Missing user input in request'}), 400

    user_input = data['user_input']

    prompt = f"""Based on the user's input {user_input} Break it down into subtopics at most 4 and I need 
    you to generate a list of questions anywhere from 3 to 5 questions per topic and I need you to tell me the 
    number of topics/subtopics generated and the number of questions per topic and please give it to me in the 
    format number_of_topics = x and questions_per_topic_numbers = [A1, A2, ...]. Please also give it as multiple 
    choice of 4 options and list the corresponding correct answer and whether the question difficulty based on a 
    1-5 scale (1 being the easiest). Give the final output to me in json format."""

    try:
        response = client.responses.create(
            model="gpt-4.1-nano",
            input=prompt
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    start_writing = False
    json_lines = []
    
    for line in response.output_text.splitlines():
        if '```' in line:
            start_writing = False
        if '```json' in line:
            start_writing = True
            continue
        if start_writing:
            json_lines.append(line)

    try:
        parsed_json = json.loads('\n'.join(json_lines))
    except json.JSONDecodeError as e:
        return jsonify({'error': f'Invalid JSON format from model: {str(e)}'}), 500

    return jsonify(parsed_json), 200

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5001, debug=True)
