from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.chat_history import InMemoryChatMessageHistory, BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import HumanMessage, AIMessage
from dotenv import load_dotenv
import os
import requests
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)

store = {}
public_url = os.getenv("PUBLIC_URL", "https://your-ngrok-url.com")
classify_url = f"{public_url}/classify"

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

def get_session_history(session_id: str) -> BaseChatMessageHistory :
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

def get_prompt(emotion):
    prompts = {
        "love": "I can sense a lot of love here. That’s such a powerful emotion! It's amazing to see that you're feeling so much love. Is there anything you’d like to share more about this feeling?",
        "surprise": "Wow, something unexpected has come up! Tell me more about it. Surprises can really make things interesting. Do you want to explore how this surprise made you feel?",
        "joy": "I'm so glad you're feeling joyful! Moments like these are what make life great. Do you want to talk about what’s bringing you so much happiness?",
        "sadness": "I’m really sorry you’re feeling sad. It’s okay to feel this way sometimes. If you’d like, we can talk more about what’s causing this sadness or we can do something to lift your mood.",
        "anger": "It sounds like you're feeling frustrated or angry. It’s important to express how you feel. How about we try something together to calm down a bit?",
        "fear": "I understand that you might be feeling scared or anxious. It’s okay to feel fear sometimes. I’m here with you. Let’s focus on what we can do to make things feel a little more manageable."
    }
    
    general_prompt = "Whatever you're feeling, I'm here to support you. Feel free to share anything you’d like to talk about."
    
    return prompts.get(emotion.lower(), general_prompt)

def classify_emotion(text):
    response = requests.post(classify_url, json={'text': text})
    if response.status_code == 200:
        return response.json().strip().lower()
    else:
        return "general"

def detect_crisis(text):
    crisis_keywords = ["self-harm", "suicide", "hurt myself", "kill myself", "end my life", "cut myself", "depressed"]
    for keyword in crisis_keywords:
        if keyword in text.lower():
            return True
    return False

def create_prompt(emotion, crisis_detected=False):
    if crisis_detected:
        return ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Act as a compassionate person, where your friend is in a crisis questioning their life, ask them to talk to someone who is close to them in family."
                    "I'm really concerned about how you're feeling right now. It’s important to talk to someone who can offer more help."
                    " Would you like me to connect you with a mental health professional or provide the contact for a crisis helpline? \n\n"
                    "Answer in a very supportive, compassionate, and caring tone."
                ),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )
    else:
        input = emotion
        if session_id in store:
            input = 'none'
        emo_prompt = get_prompt(input)
        return ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a conversational mental health assistant. Provide emotional support like a caring friend. " 
                    "Follow the guidelines based on the user's emotional state: \n\n"
                    f"{emo_prompt}"
                    "Answer in a friendly and conversational manner, like talking to a close friend. \n\n"
                ),
                MessagesPlaceholder(variable_name="history"),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

def handle_action(emotion, crisis_detected=False):
    if crisis_detected:
        return "It sounds like you’re going through something really tough right now. I highly recommend talking to someone who can help you, like a mental health professional or a crisis counselor. Would you like me to provide you with contact information for support?"
    
    actions = {
        "joy": "How about sharing this joy with a friend or writing it down so you can come back to it later? It’s always nice to hold onto moments like these.",
        "sadness": "It might help to take a few deep breaths or try a short mindfulness exercise. Or if you prefer, we can talk more about what’s troubling you.",
        "anger": "Let’s try a calming exercise. Take a deep breath in... hold it... and slowly let it out. Let’s repeat that a few times.",
        "fear": "I have a grounding technique we can try. Focus on 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. It can help bring you back to the present moment."
    }
    return actions.get(emotion, "I'm here to support you in any way I can. Feel free to share more.")

def generate_response(text, session_id):
    emotion = classify_emotion(text)
    crisis_detected = detect_crisis(text)
    prompt = create_prompt(emotion, crisis_detected)
    chain = prompt | llm
    history = get_session_history(session_id)
    with_message_history = RunnableWithMessageHistory(chain, get_session_history, input_messages_key="messages", history_messages_key="history",)
    config = {"configurable": {"session_id": session_id}}
    response = with_message_history.invoke({"messages": [HumanMessage(content=text)]}, config=config)
    action = handle_action(emotion, crisis_detected)

    return response.content, action

text = "my dog died"
session_id = "abc2"
response_content, suggested_action = generate_response(text, session_id)

print(response_content)
# print(suggested_action)

# text = "his name was rishabh"
# session_id = "abc2"
# response_content, suggested_action = generate_response(text, session_id)

# print(response_content)



