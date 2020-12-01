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

# def upload_from_textbox(request):
#     if request.method=='POST':
#         form=DocumentForm(request.POST)
#         if form.is_valid():
#             docfile=open(request.filename)
#             myfile=request.user.code_file_set.create(description=request.POST['desc'], content=docfile, language=request.POST['language'], file_name=request.POST['file_name'])
#             myfile.save()
#             return render(request, 'upload_files.html', {})
#     if request.method=='GET':
#         data=request.user.code_file_set.objects.all()
#         dataserializer=CodeFileSerializer(data, many=True)
#         return JsonResponse(dataserializer.data, safe=False)




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
            pass
        if(mode==0):
            return render(request, 'output.html' ,{'out':"invalid language"})
        if(request.POST.get('args')):
            args=request.POST.get('args')
        if(mode==1):
            result=subprocess.Popen(args, cwd= settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/' ,stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            ans = result.communicate(input=input.encode())[0].decode('utf-8').replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')
            return render(request, 'output.html' ,{'out': ans})
        if(mode==2):
            comp=subprocess.run(args, cwd= settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/', capture_output=True)
            # move(exename, settings.MEDIA_ROOT+'temp'+str(request.user.id)+"/"+exename)
            if(comp.stderr):
                return HttpResponse('compilation failed\n'+comp.stderr.decode('utf-8').replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', ''))
            result=subprocess.Popen(exe, cwd= settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/', stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            ans = result.communicate(input=input.encode())[0].decode('utf-8')
        return render(request,'fileview.html',{'name': filename, 'language': language, "out": ans.replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')})



    #      if(result1.stdout):
    #     print('compilation failed\n')
    #     print(result1.stderr.decode("utf-8"))
    #     return ('compilation filed\n'+result1.stderr.decode('utf-8'))
    # else:
    #     command="".split()
    #     result2=subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    #     output=result2.communicate(input='12 14'.encode())[0].decode('utf-8')
    #     return output

