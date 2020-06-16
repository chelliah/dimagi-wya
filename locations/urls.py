from django.urls import path

from . import views

urlpatterns = [
    path('api/location/', views.LocationListCreate.as_view()),
]