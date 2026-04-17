from django.urls import path
from . import views

urlpatterns = [
    path('', views.prompt_list_create, name='prompt_list_create'),
    path('<int:prompt_id>/', views.prompt_detail, name='prompt_detail'),
]
