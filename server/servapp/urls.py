from django.urls import path

from .views import index, compare

urlpatterns = [
    path("upload", index, name="index"),
    path("compare", compare, name="compare")
]