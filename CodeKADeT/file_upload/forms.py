from django import forms

from .models import Code_file


class DocumentForm(forms.ModelForm):
    class Meta:
        model = Code_file
        fields = ('description', 'content', )