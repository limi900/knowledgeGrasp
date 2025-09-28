from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import openai
import json

#pip install -r requirements.txt

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

openai.api_key = "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"

@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    try:
        data = request.get_json()
        print(f"Received data: {data}")

        if not data or 'user_input' not in data:
            print("Missing user input")
            return jsonify({'error': 'Missing user input in request'}), 400

        user_input = data['user_input']
        print(f"User input: {user_input}")

        prompt = f"""Based on the user's input {user_input} Break it down into subtopics at most 4 and I need 
        you to generate a list of questions anywhere from 3 to 5 questions per topic and I need you to tell me the 
        number of topics/subtopics generated and the number of questions per topic and please give it to me in the 
        format number_of_topics = x and questions_per_topic_numbers = [A1, A2, ...]. Please also give it as multiple 
        choice of 4 options and list the corresponding correct answer and whether the question difficulty based on a 
        1-5 scale (1 being the easiest). Give the final output to me in json format."""
        
        print(f"Sending prompt to OpenAI: {prompt[:100]}...")

        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            print("OpenAI response received successfully")
        except Exception as e:
            print(f"OpenAI error: {str(e)}")
            return jsonify({'error': f'OpenAI API error: {str(e)}'}), 500

        # Get the response content
        response_text = response.choices[0].message.content
        print(f"Response text: {response_text[:200]}...")
        
        # Try to parse the response directly first
        try:
            parsed_json = json.loads(response_text)
            print("JSON parsed successfully (direct)")
        except json.JSONDecodeError:
            # If direct parsing fails, try to extract JSON from markdown blocks
            print("Direct parsing failed, trying markdown extraction...")
            start_writing = False
            json_lines = []
            
            for line in response_text.splitlines():
                if '```' in line:
                    start_writing = False
                if '```json' in line:
                    start_writing = True
                    continue
                if start_writing:
                    json_lines.append(line)
            
            try:
                json_text = '\n'.join(json_lines)
                if json_text.strip():
                    parsed_json = json.loads(json_text)
                    print("JSON parsed successfully (extracted)")
                else:
                    # If no markdown blocks, try to find JSON in the response
                    import re
                    json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                    if json_match:
                        parsed_json = json.loads(json_match.group())
                        print("JSON parsed successfully (regex)")
                    else:
                        raise json.JSONDecodeError("No valid JSON found", "", 0)
            except json.JSONDecodeError as e:
                print(f"All JSON parsing methods failed: {str(e)}")
                # Return a mock response for now so the frontend can continue
                parsed_json = {
                    "number_of_topics": 1,
                    "questions_per_topic_numbers": [4],
                    "topics": [
                        {
                            "topic": "Learning Topic",
                            "questions": [
                                {
                                    "question": "Sample question 1?",
                                    "options": ["A", "B", "C", "D"],
                                    "correct_answer": "A",
                                    "difficulty": 2
                                }
                            ]
                        }
                    ]
                }
                print("Using mock response")

        return jsonify(parsed_json), 200
        
    except Exception as e:
        print(f"General error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5001, debug=True)
