## 가상환경 활성화 방법

.venv 만들어가기
- 맥 : python3 -m venv .venv
- 윈도우 : python -m venv .venv

.venv 있는 위치에서
- 맥 : . .venv/bin/activate
- 윈도우 : source .venv/bin/activate

이렇게 하면 가상환경이 활성화된다!

requirements.txt있는 위치 (그대로) 에서

- pip install -r requirements.txt

그러면 다 세팅 완료!

만약 패키지를 새로 설치하려면

pip install ${name}

그 후에는 이 위치에서

pip freeze > requirements.txt

이렇게 한 후에 깃에 올려주세요.

그리고 이제 pip install django 같은 것을 하면 로컴 컴퓨터 환경에 설치되는게 아니라 가상환경에 설치된다!