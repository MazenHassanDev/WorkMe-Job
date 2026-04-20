import anthropic
import json
from django.conf import settings

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

PROMPT = "Summarise this job description in 3-5 bullet points highlighting the key responsibilities, required skills, and any notable benefits."

def summarize_job(content):
    try:
        response = client.messages.create(
            model = 'claude-opus-4-6',
            max_tokens=1000,
            system=PROMPT,
            messages=[{'role': 'user', 'content': f'{content}'}]
        )
    except anthropic.APIConnectionError:
        return {'error': 'Could not connect to Claude. Check internet connection.'}
    except anthropic.AuthenticationError:
        return {'error': 'Invalid API key. Check ANTHROPIC_API_KEY setting.'}
    except anthropic.RateLimitError:
        return {'error': 'Rate limit reached. Please wait a moment and try again.'}
    except anthropic.APIStatusError as e:
        return {'error': f'Claude API error: {e.status_code}'}
    
    if not response.content:
        return {'error': 'Calude returned an empty response.'}
    
    return {'result': response.content[0].text}

