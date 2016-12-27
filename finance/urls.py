from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()

router.register(r'account' , AccountViewSet , base_name ='account')
router.register(r'costCenter' , CostCenterViewSet , base_name ='costCenter')
router.register(r'transaction' , TransactionViewSet , base_name ='transaction')
router.register(r'expenseSheet' , ExpenseSheetViewSet , base_name ='expenseSheet')
router.register(r'invoice' , InvoiceViewSet , base_name ='invoice')

urlpatterns = [
    url(r'^', include(router.urls)),
]