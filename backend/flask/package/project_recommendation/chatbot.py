import json
import re
from groq import Groq
import random

def chat(data):
    client = Groq(api_key="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")
    completion = client.chat.completions.create(
        model="mixtral-8x7b-32768",
        messages=[
            {
                "role": "user",
                "content":
                    f"{data} this is a readme. Based on the readme give me 1 innovative project idea. Your response format should be in a json {{title: '', description: '', key_features:['', '', '']}}. Don't answer anything else."
            }
        ],
        temperature=0.2,
        max_completion_tokens=2048,
        top_p=1,
        stream=True,
        stop=None,
    )
    
    resp = ""
    for chunk in completion:
        resp += (chunk.choices[0].delta.content or "")
    
    # Define a regex pattern to match a single JSON object at the top level
    json_pattern = r'\{.*\}'
    
    match = re.search(json_pattern, resp, re.DOTALL)
    
    if match:
        json_string = match.group(0)  # Extract the JSON string
        
        try:
            # Parse the JSON string into a Python dictionary
            json_data = json.loads(json_string)
            return json_data  # Return the parsed dictionary
        except json.JSONDecodeError as e:
            return {"error": "Invalid JSON format", "details": str(e)}
    else:
        return {"error": "No valid JSON found in the response"}

