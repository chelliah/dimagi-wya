from django.db import models

# Create your models here.
class Location(models.Model):
    email = models.EmailField()
    geoname_id = models.IntegerField(default=None)
    city_name = models.CharField(max_length=100, default="")
    latitude = models.FloatField()
    longitude = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)