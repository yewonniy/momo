from django.shortcuts import render
from django.conf import settings

API_KEY = settings.API_KEY

# Create your views here.
def home(request):

    return render(request, 'popup.html')