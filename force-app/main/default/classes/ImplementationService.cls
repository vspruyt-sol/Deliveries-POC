public with sharing class ImplementationService {
    private final static String DEFAULT_API_NAME = 'Default';

    private static ImplementationService instance;
    private static Service_Implementation__mdt sharingImplementation;

    private ImplementationService(){
        //Could do some sort of describe to always include all classnames when more services are added
        sharingImplementation = [SELECT Delivery_Point_Service_Classname__c FROM Service_Implementation__mdt WHERE QualifiedApiName = :DEFAULT_API_NAME];
    }

    public Service_Implementation__mdt getServiceImplementation(){
        return sharingImplementation;
    }

    public static ImplementationService getInstance()
    {
        if(instance != null)
        {
            return instance;
        }
        else {
            return new ImplementationService();
        }
    }
}
