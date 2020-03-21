public with sharing class AccountDeliveryPointInfoController {

    @AuraEnabled
    public static DeliveryPointInfo getDeliveryPointInfoByPhotoId(String deliveryPointPhotoId) {
        //Could write unit tests, don't think this is necessary for the exercises purpose
        //Could implement amount of retries, maybe not necessary for the excercises purpose
        try {
            Service_Implementation__mdt implementationService = ImplementationService.getInstance().getServiceImplementation();
            IDeliveryPointInfoService deliveryPointService =  (IDeliveryPointInfoService) DependencyInjector.instantiate(implementationService.Delivery_Point_Service_Classname__c);
            DeliveryPointInfo deliveryPointInfo;

            deliveryPointInfo = deliveryPointService.getDeliveryPointInfoByPhotoId(deliveryPointPhotoId);

            return deliveryPointInfo;
        } catch (Exception exceptionInstance) {
            throw new AuraHandledException(exceptionInstance.getMessage());
        }
    }
}
