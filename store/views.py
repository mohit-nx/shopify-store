from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Orders, Batch, OrderItems
from .serializers import BatchSerializer, OrderSerializer
from datetime import date, datetime
from django.forms.models import model_to_dict
from django.core.exceptions import ObjectDoesNotExist
from myStore.settings import SHOPIFY_STORE_FRONT_URL
import requests

class BatchViewset(viewsets.GenericViewSet,
  mixins.CreateModelMixin,
  mixins.ListModelMixin,
  mixins.RetrieveModelMixin,
  mixins.UpdateModelMixin):

  queryset = Batch.objects.all()
  serializer_class=BatchSerializer
  
  def create(self, request):
    try:
      request_data = request.data
      new_batch = BatchSerializer(data=request_data)
      new_batch.is_valid()
      new_batch.save()
      
      unassigned_orders = Orders.objects.filter(batch=None)
      unassigned_orders.update(batch=new_batch.data['id'])
      
      return Response(new_batch.data)
    except Exception as e:
      print("::::", e)
      return Response({ 'error': True}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      
    
class OrderViewset(viewsets.ViewSet):
  def list(self, request):
    orders = Orders.objects.all()
    order_list = orders.values()
    
    for order in order_list:
      items = OrderItems.objects.filter(order=order['id']).values()
      order['items'] = items
    return Response({ 'orders': order_list })
  
  @action(methods=["get"], detail=False, url_path=r"batch/(?P<batch_id>[\w-]*)")
  def batch(self, request, batch_id):
    orders = Orders.objects.filter(batch=batch_id)
    order_list = orders.values()
    
    for order in order_list:
      items = OrderItems.objects.filter(order=order['id']).values()
      order['items'] = items
    return Response({ 'orders': order_list })
  
  @action(methods=["post"], detail=False, url_path=r"fulfill/(?P<id>[\w-]*)")
  def fulfill(self, request, id):
    try:
      print(">>>>", f"{SHOPIFY_STORE_FRONT_URL}orders/{id}/fulfillments.json")
      # respose = requests.post(f"{SHOPIFY_STORE_FRONT_URL}orders/{id}/fulfillments.json", {
      #   "fulfillment": {
      #   "location_id": 905684977,
      #   "tracking_number": None,
      #   "line_items": [
      #     {
      #       "id": 466157049
      #     },
      #     {
      #       "id": 518995019
      #     },
      #     {
      #       "id": 703073504
      #     }
      #   ]
      # }
      # },headers={"Content-Type": "application/json"})
      # print("::::", respose.status_code, respose.__dict__)
      # if respose.status_code != 201:
      #   raise Exception('Could not fulfil order')
      order = Orders.objects.get(id=id)
      order.updated_on = datetime.now()
      order.fulfilled = True
      order.save()
      print(":::>>>>>")
      return Response({ 'data': 'Success' })
    except Exception as e:
      print(":::", e)
      return Response({ 'error': True}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
  @action(methods=["post"], detail=False)
  def order_received(self, request, *args, **kwargs):
    try:
      request_data = request.data
      current_date = date.today()
      
      active_batch = Batch.objects.filter(fulfilled=False, start_date__lte = current_date, end_date__gte = current_date)
      
      created_on = datetime.fromisoformat(request_data['created_at'])
      updated_on = datetime.fromisoformat(request_data['updated_at'])
      
      order_payload = {
        'id': request_data['id'],
        'price': float(request_data['total_line_items_price']),
        'created_on': created_on,
        'updated_on': updated_on
      }
      
      
      
      order_serializer = OrderSerializer(data=order_payload)
      order_serializer.is_valid(raise_exception=True)
      
      if len(active_batch) > 0:
        order_payload['batch'] = active_batch[0]
      new_order = Orders(**order_payload)
      new_order.save()
      
      order_items = [{'id': item['id'], 'title': item['title'], 'quantity': item['quantity'], 'order': new_order } for item in request_data['line_items']]
      for order in order_items:
        order_item = OrderItems(**order)
        order_item.save()
        
      
      return Response({ "data": order_serializer.validated_data })
    except Exception as e:
      print(":::", e)
      return Response({ 'error': True}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)