from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()

router.register(r'account' , AccountViewSet , base_name ='account')
router.register(r'costCenter' , CostCenterViewSet , base_name ='costCenter')
router.register(r'transaction' , TransactionViewSet , base_name ='transaction')
router.register(r'expenseSheet' , ExpenseSheetViewSet , base_name ='expenseSheet')
router.register(r'invoice' , InvoiceViewSet , base_name ='invoice')
router.register(r'inflow' , InflowViewSet , base_name ='inflow')
router.register(r'loan' , LoanViewSet , base_name ='loan')
router.register(r'outflow' , OutflowViewSet , base_name ='Outflow')
router.register(r'asset' , AssetViewSet , base_name ='Asset')
router.register(r'rawmaterial' , RawmaterialViewSet , base_name =' Rawmaterial')
urlpatterns = [
    url(r'^', include(router.urls)),
]
