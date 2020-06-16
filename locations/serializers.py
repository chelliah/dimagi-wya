from rest_framework import serializers
from .models import Location

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('email', 'latitude', 'longitude', 'updated_at', 'geoname_id', 'city_name')