from django.shortcuts import render
from django.conf import settings

API_KEY = settings.API_KEY

# Create your views here.
def home(request):
    import openai
    import os
    openai.api_key = API_KEY
    model = "gpt-3.5-turbo"

    system_prompt = """
    영어 발음을 듣고 이를 어떤 영어 단어인지 알려주는 서비스를 만들려고 하는데 어떻게 구현할 수 있을까
    """
    user_prompt = """
    """

    conversation = []
    conversation.append({"role": "system", "content": system_prompt})
    conversation.append({"role": "user", "content": user_prompt})

    chat_completion = openai.chat.completions.create(
    messages=conversation,
    temperature=0.5,
    model=model,
    )
    print(chat_completion)
    print(chat_completion.choices[0].message.content)

    return render(request, 'popup.html')