from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse 
from .models import Word

API_KEY = settings.API_KEY

# Create your views here.
def home(request):
    if request.method == 'GET':
        user_input = request.GET.get('word', False)
        print(user_input)
        import openai
        import os
        openai.api_key = API_KEY
        model = "gpt-3.5-turbo"

        try:
            word = Word.objects.get(input_word=user_input)
            
            data = {}
            line = word.output_word.split("/")
            for i in range(10):
                split_word = line[i].split(")")
                key = split_word[0]+")"
                value = split_word[1]
                data[key] = value

        except Word.DoesNotExist:
            system_prompt = """You are the best Korean, English and linguistic expert. If I tell you Korean pronunciation, answer 10 similar English words, their pronunciation, and definition.

            EXAMPLE OF OUTPUT 1:
            input: 어그먼트
            output:
            Argument (어그먼트): 논쟁, 주장
            Augment (어그먼트): 증가시키다, 향상시키다
            Armament (아머먼트): 무장, 무기
            Ointment (오인트먼트): 연고
            Agreement (어그리먼트): 합의, 동의;
            Arrogant (아로건트): 거만한
            Argonaut (아거노트): 모험가
            Apartment (아파트먼트): 아파트
            Alignment (어라인먼트): 정렬
            Ornament (오나먼트): 장식
            
            END OF EXAMPLE

            EXAMPLE OF OUTPUT 2:
            input: 햅삐
            output:
            Happy (햅삐): 행복한
            Hobby (호비): 취미
            Hoppy (호피): 홉이 많은
            Hippy (히피): 히피
            Heppy (헤피): 행복한
            Hippy (히피): 히피
            Hopi (호피): 호피 인디언
            Hap (햅): 운, 운명
            Hop (합): 뛰다, 뛰어오르다
            Happy (햅삐): 행복한
            END OF EXAMPLE
            
            OUTPUT FORMAT:
            similar_English_word (pronounciation): definition"""
            

            conversation = []
            conversation.append({"role": "system", "content": system_prompt})
            conversation.append({"role": "user", "content": user_input})

            chat_completion = openai.chat.completions.create(
            messages=conversation,
            temperature=0,
            model=model,
            )
            response = chat_completion.choices[0].message.content
            
            #print('res: ', response)
            lines = response.strip().split('\n')
            #print(lines)

            output_word = ""
            data = {}
            for line in lines:
                key_pro, value = line.split(':')
                key = key_pro.split()[0].strip() # 영어 단어만 추출
                value = value.strip() # 값 정리
                output_word = output_word + key_pro + value + "/"
                data[key_pro] = value

            # word 객체 생성
            input_word = user_input
            Word.objects.create(
                input_word = input_word,
                output_word = output_word
            )

        return JsonResponse([data], safe=False)