from django.db import models
# Create your models here.
  
class Batch(models.Model):
  id=models.AutoField(primary_key=True)
  start_date=models.DateField(blank=False)
  end_date=models.DateField(blank=False)
  name=models.CharField(max_length=255, blank=False)
  fulfilled=models.BooleanField(default=False)
  note=models.CharField(max_length=1000,blank=True)
  
class Orders(models.Model):
  id=models.IntegerField(primary_key=True)
  fulfilled=models.BooleanField(default=False)
  price=models.FloatField(default=0.0)
  batch=models.ForeignKey(Batch, blank=True, null=True, on_delete=models.SET_NULL)
  created_on=models.DateTimeField(blank=False)
  updated_on=models.DateTimeField(blank=False)

class OrderItems(models.Model):
  id=models.IntegerField(primary_key=True)
  title=models.CharField(max_length=255, blank=False)
  quantity=models.IntegerField(blank=False)
  order=models.ForeignKey(Orders, on_delete=models.CASCADE)