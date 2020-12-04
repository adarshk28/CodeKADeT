from logging import StreamHandler
from sys import flags
from django.http.response import HttpResponse
from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.decorators import login_required
from rest_framework import serializers
from shutil import move
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
from rest_framework.decorators import api_view
from django.core.files import File
import os
import json
#def home(request):
    #documents = Code_file.objects.all()
    #return render(request, 'core/home.html', { 'documents': documents })

@api_view(['GET'])
def logout_user(request):
    print(request.user)
    logout(request)
    return JsonResponse({"status": "Logged out"})

@api_view(['POST'])
def upload_from_computer(request):
    print('User is: ',request.user)
    if request.method=='POST':
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            myfile = request.user.code_file_set.create(description = request.POST['description'], content = request.FILES['content'], language = request.POST['language'], file_name = request.POST['file_name'])
            myfile.save()
            return JsonResponse({'status': 'successful'})
        else:
            return JsonResponse({'status': 'failure'})

@api_view(['POST'])
def emptyFileUpload(request):
    print('User is:', request.user)
    data = json.loads(request.body)
    fil = open(data.get('file_name'), 'w+')
    f = File(fil)
    try:
        myfile=request.user.code_file_set.get(file_name = data.get('file_name')).content
        fil.close()
        return JsonResponse({'status': 'Already exists'})
    except:
        myfile = request.user.code_file_set.create(description = data.get('description'), content = f, language = data.get('language'), file_name = data.get('file_name'))
        myfile.save()
        fil.close()
        return JsonResponse({'status': 'Empty file uploaded'})

@api_view(['POST'])
def edit_from_textbox(request):
    print('User is:', request.user)
    data = json.loads(request.body)
    name=data.get('file_name')
    content=data.get('content')
    print(content)
    myfile=request.user.code_file_set.get(file_name=name).content
    print(os.path.dirname(os.path.realpath(__file__)))

    print(str(myfile))
    
    print(type(str(myfile)))
    open('personal_file/28/hello.cpp', 'w').close()
    print("reached here")
    myfile.write(content)
    return JsonResponse({"status":"Edit reflected in backend"})

def deletefile(request):
    if request.method=='POST':
        name=request.POST.get('filename')
        request.user.code_file_set.get(file_name=name).delete()
        return JsonResponse({"status":"done"})

def rename(request):
    if request.method=='POST':
        name=request.POST.get('filename')
        if os.path.isfile(settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/'+name):
            return JsonResponse({'status': 'file with same name exists'})
        myfile=request.user.code_file_set.get(file_name=name)
        myfile.filename=name
        os.rename(settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/'+name)
        return JsonResponse({"status":"done"})

def newfile(request):
    if request.method=='POST':
        name=request.POST.get('filename')
        if os.path.isfile(settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/'+name):
            return JsonResponse({'status': 'file with same name exists'})
        myfile=request.user.code_file_set.create(description=request.POST['description'], content=request.FILES['content'], language=request.POST['language'], file_name=request.POST['file_name'])
        return JsonResponse({'status': 'done'})



def view_function(request):
    if request.method=='GET':
        filename=request.GET.get('file','')
        language=request.user.code_file_set.get(file_name=filename).language
        lines=[]
        with open(settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/'+filename) as f:
            lines=[line.rstrip('\n') for line in f]
        #return JsonResponse({'lines':lines})
        return render(request,'fileview.html',{'lines':lines,'name': filename, 'language': language})

def execute(request):
    if(request.method=='POST'):
        filename=request.POST.get('file','')
        mode=0
        args=[]
        exe=""
        exename=''
        input=request.POST.get('input')
        language=request.POST.get('language', '')
        if language == "c++" or language == "c":
            mode=2
            args=["g++", filename]
            exe="./a.out"
            exename='a.out'
        elif language == "python": 
            mode=1
            args=['python3', filename]
        elif language == "java":
            mode=2
            args=['javac', filename]
            exe=['java', os.path.splitext(filename)]
        if(mode==0):
            return render(request, 'output.html' ,{'out':"invalid language"})
        if(request.POST.get('args')):
            args=request.POST.get('args')
        if(mode==1):
            result=subprocess.Popen(args, cwd= settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/' ,stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            ans = result.communicate(input=input.encode())[0].decode('utf-8').replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')
            return JsonResponse({'out': ans})
        if(mode==2):
            comp=subprocess.run(args, cwd= settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/', capture_output=True)
            # move(exename, settings.MEDIA_ROOT+'temp'+str(request.user.id)+"/"+exename)
            if(comp.stderr):
                return JsonResponse({'status':'1', 'ans':'compilation failed\n'+comp.stderr.decode('utf-8').replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')})
            result=subprocess.Popen(exe, cwd= settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/', stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            ans = result.communicate(input=input.encode())[0].decode('utf-8')
        return JsonResponse({"out": ans.replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')})