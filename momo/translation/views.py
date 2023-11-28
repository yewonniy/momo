from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse 
from .models import Word
from .models import Output

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
            word = Output.objects.get(input_word=user_input)
            
            data_list = []
            output_list = []
            for i in range(1, 11):
                output_list.append(getattr(word, f"output{i}"))

                # 중복인 게 있으면 data_list에 넣지 않음 (중복되는 게 3개면 그냥 7개 단어만 보여줌)
                if output_list[i-1] !="중복":
                    data = {}
                    data['word'] = output_list[i-1]
                    output_info = Word.objects.get(word = output_list[i-1])
                    data["pronun"] = output_info.pronounciation
                    data["value"] = output_info.definition
                    data_list.append(data)

        except Output.DoesNotExist:
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

            data_list = []
            find_duplicate = []
            output = [] # Output 테이블에 output1, outpu2, ... output10을 저장하기 위함.
            for line in lines:
                eng_and_pro, korean_meaning = line.split(':')
                eng = eng_and_pro.split()[0].strip()
                pronunciation = eng_and_pro.split()[1].strip()
                korean_meaning = korean_meaning.strip()

                if eng in find_duplicate: # 중복이면 Output테이블의 n번째 output에 "중복"을 저장, Word 테이블은 아예 생성 X
                    output.append("중복")
                else: 
                    find_duplicate.append(eng)
                    data = {}
                    data['word'] = eng
                    data["pronun"] = pronunciation
                    data["value"] = korean_meaning
                    data_list.append(data)
                    output.append(eng)
                
                    Word.objects.create(
                        word = eng,
                        pronounciation = pronunciation,
                        definition = korean_meaning
                    )

            Output.objects.create(
                input_word = user_input,
                output1 = output[0],
                output2 = output[1],
                output3 = output[2],
                output4 = output[3],
                output5 = output[4],
                output6 = output[5],
                output7 = output[6],
                output8 = output[7],
                output9 = output[8],
                output10 = output[9],
            )

            #  data_list = 
            #             [
            # {
            #     "word": "Arrogant",
            #     "pronun": "(애로건트)",
            #     "value": "거만한"
            # },
            # {
            #     "word": "Argonaut",
            #     "pronun": "(아거노트)",
            #     "value": "모험가"
            # },
            # {
            #     "word": "Apartment",
            #     "pronun": "(아파트먼트)",
            #     "value": "아파트"
            # },
            #       .
            #       .
            #       .
            # {
            #     "word": "Agreement",
            #     "pronun": "(어그리먼트)",
            #     "value": "합의, 동의"
            # }
            # ]

        return JsonResponse(data_list, safe=False)
