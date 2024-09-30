import os
import logging
import requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from typing import Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.chat_history import InMemoryChatMessageHistory, BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import HumanMessage, AIMessage

load_dotenv()
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
store: Dict[str, Dict[str, Any]] = {}  # Each session_id maps to a dict with 'history' and 'emotion'
public_url = os.getenv("PUBLIC_URL", "https://your-ngrok-url.com")
classify_url = f"{public_url}/classify"

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = {'history': InMemoryChatMessageHistory(), 'emotion': None}
    return store[session_id]['history']

def set_session_emotion(session_id: str, emotion: str):
    if session_id not in store:
        store[session_id] = {'history': InMemoryChatMessageHistory(), 'emotion': emotion}
    else:
        store[session_id]['emotion'] = emotion

def get_session_emotion(session_id: str) -> str:
    if session_id in store:
        return store[session_id].get('emotion', None)
    return None

def get_prompt(emotion):
    prompts = {
        "love": "I can sense a lot of love here. That’s such a powerful emotion! Is there anything you’d like to share more about this feeling?",
        "surprise": "Wow, something unexpected has come up! Tell me more about it. Do you want to explore how this surprise made you feel?",
        "joy": "I'm so glad you're feeling joyful! Do you want to talk about what’s bringing you so much happiness?",
        "sadness": "I’m sorry you’re feeling sad. If you’d like, we can talk more about what’s causing this sadness or do something to lift your mood.",
        "anger": "It sounds like you're feeling frustrated or angry. How about we try something together to calm down a bit?",
        "fear": "I understand that you might be feeling scared or anxious. Let’s focus on what we can do to make things feel a little more manageable."
    }
    general_prompt = "Whatever you're feeling, I'm here to support you. Feel free to share anything you’d like to talk about."
    return prompts.get(emotion.lower(), general_prompt)

def classify_emotion(text):
    try:
        response = requests.post(classify_url, json={'text': text})
        if response.status_code == 200:
            emotion = response.json().strip().lower()
            return emotion
        else:
            logging.error(f"Emotion classification failed with status code {response.status_code}")
            return "general"
    except Exception as e:
        logging.error(f"Error during emotion classification: {e}")
        return "general"

def detect_crisis(text):
    crisis_keywords = [
        "self-harm", "suicide", "hurt myself", "kill myself", "end my life",
        "cut myself", "depressed", "overdose", "harm myself", "worthless"
    ]
    text_lower = text.lower()
    for keyword in crisis_keywords:
        if keyword in text_lower:
            return True
    return False

def create_prompt(emotion, session_id, crisis_detected=False):
    if crisis_detected:
        return ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Act as a compassionate friend. Your friend is in a crisis and is questioning their life. Encourage them to talk to someone who is close to them in their family.\n\n"
                    "I'm really concerned about how you're feeling right now. It’s important to talk to someone who can offer more help."
                    " Would you like me to connect you with a mental health professional or provide the contact for a crisis helpline?\n\n"
                    "Answer in a very supportive, compassionate, and caring tone in short. Don't respond with long paragraphs."
                ),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )
    else:
        history = get_session_history(session_id)
        if history.messages:
            input_emotion = 'none'
        else:
            input_emotion = emotion
        emo_prompt = get_prompt(input_emotion)
        return ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a conversational mental health assistant. Provide emotional support like a caring friend.\n\n"
                    f"{emo_prompt}\n\n"
                    "Answer in a friendly and conversational manner, like talking to a close friend. Answer in short, in plain text format"
                    "Answer in three lines, one line to be emphatetic to console the user based on their emotion."
                    "Answer in next line on how they can cope up with their situtation"
                    "Answer in next line with one or two follow up questions to keep the conversation continue in such a way that user feels comfortable sharing stuff with you"
                    "Dont answer in paragraphs, and only three sentences in plain text as specified."
                    "Dont ask questions which can further trigger the user."
                ),
                MessagesPlaceholder(variable_name="history"),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

def handle_action(emotion, crisis_detected=False):
    if crisis_detected:
        return "It sounds like you’re going through something really tough right now. I highly recommend talking to someone who can help you, like a mental health professional or a crisis counselor. Would you like me to provide you with contact information for support?"
    actions = {
        "joy": ["write", "medidate"],
        "sadness": ["breathe", "write"],
        "anger": ["medidate", "breathe"],
        "fear": ["medidate"],
    }
    return actions.get(emotion, ["general"])

def generate_response(text, session_id):
    emotion = get_session_emotion(session_id)
    if not emotion:
        emotion = classify_emotion(text)
        set_session_emotion(session_id, emotion)
    crisis_detected = detect_crisis(text)
    prompt = create_prompt(emotion, session_id, crisis_detected)
    chain = prompt | llm
    history = get_session_history(session_id)
    with_message_history = RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="messages",
        history_messages_key="history",
    )
    config = {"configurable": {"session_id": session_id}}
    try:
        response = with_message_history.invoke({"messages": [HumanMessage(content=text)]}, config=config)
        action = handle_action(emotion, crisis_detected)
        return response.content, action
    except Exception as e:
        logging.error(f"Error during response generation: {e}")
        return "I'm sorry, but I'm having trouble processing your request right now.", ""

@app.route('/classify', methods=['POST'])
def classify():
    data = request.get_json()
    text = data.get('text', '')
    session_id = data.get('session_id', '')
    if not text or not session_id:
        return jsonify({'error': 'Invalid input parameters'}), 400
    emotion = classify_emotion(text)
    set_session_emotion(session_id, emotion)
    return jsonify({'emotion': emotion})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    text = data.get('text', '')
    session_id = data.get('session_id', '')
    if not text or not session_id:
        return jsonify({'error': 'Invalid input parameters'}), 400
    response_content, suggested_action = generate_response(text, session_id)
    return jsonify({
        'response': response_content,
        'action': suggested_action
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
