from django.shortcuts import render, redirect
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.decorators import login_required
from .models import Code_file
from .forms import DocumentForm


def home(request):
    documents = Code_file.objects.all()
    return render(request, 'core/home.html', { 'documents': documents })

@login_required
def upload_from_computer(request):
    if request.method=='POST':
        form=DocumentForm(request.POST, request.FILES)
    if form.is_valid():
        myfile=request.user.code_file_set.create(description=request.POST['desc'], content=request.FILES['docfile'], language=request.POST['language'], file_name=request.POST['file_name'])
        myfile.save()
        return render(request, 'upload_files.html', {})

def upload_from_textbox(request):
    if request.method=='POST':
        form=DocumentForm(request.POST)
    if form.is_valid():
        docfile=open(request.filename)
        myfile=request.user.code_file_set.create(description=request.POST['desc'], content=docfile, language=request.POST['language'], file_name=request.POST['file_name'])
        myfile.save()
        return render(request, 'upload_files.html', {})

