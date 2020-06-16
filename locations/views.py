from .models import Location
import datetime

from .serializers import LocationSerializer
from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class LocationListCreate(
    mixins.ListModelMixin, 
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
    ):
    # permission_classes = (IsAuthenticated, )
    serializer_class = LocationSerializer
    queryset = Location.objects.all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    

    def post(self, request, *args, **kwargs):
        data = dict(request.data)
        print('email', data.get('email'))
        
        if Location.objects.filter(email=data.get('email')).exists():
            record = Location.objects.filter(email=data.get('email')).first()
            print('update', record)
            record.updated_at = datetime.datetime.now()
            record.city_name = data.get('city_name')
            record.latitude = data.get('latitude')
            record.longitude = data.get('longitude')
            record.geoname_id = data.get('geoname_id')
            record.save()
            return self.get(request)
        return self.create(request)
