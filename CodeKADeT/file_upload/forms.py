from django import forms
from django.forms import fields

from .models import Code_file


class DocumentForm(forms.ModelForm):
    class Meta:
        model=Code_file
        fields=['description', 'file_name', 'language', 'content']