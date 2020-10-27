from sys import flags
from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.decorators import login_required
from rest_framework import serializers

from .models import Code_file
from .forms import DocumentForm
from django.middleware.csrf import CsrfViewMiddleware
from django.contrib.auth import logout
from .models import UserProfile as User
from django.db import IntegrityError
from django.contrib import auth
import subprocess
from django.http import JsonResponse
import logging
logger=logging.getLogger(__name__)
from .serializers import *
#def home(request):
    #documents = Code_file.objects.all()
    #return render(request, 'core/home.html', { 'documents': documents })


def logout_user(request):
    logout(request)
    return redirect("signup")


@login_required
def upload_from_computer(request):
    if request.method=='POST':
        form=DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            myfile=request.user.code_file_set.create(description=request.POST['description'], content=request.FILES['content'], language=request.POST['language'], file_name=request.POST['file_name'])
            myfile.save()
            return render(request, 'user_page.html', {'info':"works!", 'files':request.user.code_file_set.all(), 'userid':request.user.id, 'user':request.user})
        else:
            return render(request, 'user_page.html', {'info':"does not work !", 'files':request.user.code_file_set.all(), 'userid':request.user.id, 'user':request.user})

    # if request.method=='GET':
    #     data=request.user.code_file_set
    #     dataserializer=CodeFileSerializer(data, many=True)
    #     return JsonResponse(dataserializer.data, safe=False)   
    if request.method=='GET':
        return render(request, 'user_page.html', {'info':"works!", 'files':request.user.code_file_set.all(), 'userid':request.user.id, 'user':request.user})

def upload_from_textbox(request):
    if request.method=='POST':
        form=DocumentForm(request.POST)
        if form.is_valid():
            docfile=open(request.filename)
            myfile=request.user.code_file_set.create(description=request.POST['desc'], content=docfile, language=request.POST['language'], file_name=request.POST['file_name'])
            myfile.save()
            return render(request, 'upload_files.html', {})
    if request.method=='GET':
        data=request.user.code_file_set.objects.all()
        dataserializer=CodeFileSerializer(data, many=True)
        return JsonResponse(dataserializer.data, safe=False)




def view_function(request):
    if request.method=='GET':
        filename=request.GET.get('file','')
        lines=[]
        with open(settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/'+filename) as f:
            lines=[line.rstrip('\n') for line in f]
        return JsonResponse({'lines':lines})

def execute(request):
    if(request.method=='POST'):
       process= subprocess.run(["tree"])
       logger.log(process.stdout)
       

