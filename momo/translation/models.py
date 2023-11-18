from django.db import models

# Create your models here.
class Word(models.Model):
    input_word = models.CharField(max_length=200)
    output_word = models.TextField()

    def __str__(self):
        return self.input_word