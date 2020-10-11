from rest_framework import  serializers
from .models import Batch, Orders

class BatchSerializer(serializers.ModelSerializer):
  id = serializers.IntegerField(read_only=True)
  start_date = serializers.DateField(required=True)
  end_date = serializers.DateField(required=True)
  name = serializers.CharField(required=True)
  fulfilled = serializers.BooleanField(required=False)
  note = serializers.CharField(required=False)
  
  class Meta:
    model = Batch
    fields = ('id', 'start_date', 'end_date', 'name', 'fulfilled', 'note')
    
class OrderSerializer(serializers.ModelSerializer):
  id = serializers.IntegerField(required=True)
  price = serializers.FloatField(required=True)
  fulfilled = serializers.BooleanField(required=False)
  created_on = serializers.DateTimeField(required=True)
  updated_on = serializers.DateTimeField(required=True)
  batch = serializers.IntegerField(required=False)
  class Meta:
    model = Orders
    fields = ('id', 'price', 'created_on', 'updated_on', 'fulfilled', 'batch')