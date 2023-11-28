from django.db import models

# Create your models here.
class Output(models.Model):
    input_word = models.CharField(max_length=200, unique=True)
    output1 = models.CharField(max_length=100)
    output2 = models.CharField(max_length=100)
    output3 = models.CharField(max_length=100)
    output4 = models.CharField(max_length=100)
    output5 = models.CharField(max_length=100)
    output6 = models.CharField(max_length=100)
    output7 = models.CharField(max_length=100)
    output8 = models.CharField(max_length=100)
    output9 = models.CharField(max_length=100)
    output10 = models.CharField(max_length=100)

    def __str__(self):
        return self.input_word
    
class Word(models.Model):
    word = models.CharField(max_length=100)
    pronounciation = models.CharField(max_length=100)
    definition = models.TextField()