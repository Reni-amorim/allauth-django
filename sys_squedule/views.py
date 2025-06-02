from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, 'sys_squedule/index.html')

@login_required
def members(request):
    return render(request, 'sys_squedule/members.html')