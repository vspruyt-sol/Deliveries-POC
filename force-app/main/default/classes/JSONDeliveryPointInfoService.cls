public with sharing class JSONDeliveryPointInfoService implements IDeliveryPointInfoService {
    private final static String HTTP_METHOD_GET = 'GET';
    private final static String DELIVERY_POINT_NAMED_CREDENTIAL = 'callout:Delivery_Photo_Credential';

    private final static Integer STATUS_CODE_SUCCESS = 200;

    public DeliveryPointInfo getDeliveryPointInfoByPhotoId(String deliveryPointPhotoId)
    {
        DeliveryPointInfo deliverPointInfo;

        Http http = new Http();
        HttpRequest httpRequest = new HttpRequest();
        httpRequest.setEndpoint(String.format('{0}/{1}', new List<String>{ DELIVERY_POINT_NAMED_CREDENTIAL, deliveryPointPhotoId }));
        httpRequest.setMethod(HTTP_METHOD_GET);

        HttpResponse httpResponse = http.send(httpRequest);

        if (httpResponse.getStatusCode() == STATUS_CODE_SUCCESS) {
            deliverPointInfo = (DeliveryPointInfo) JSON.deserialize(httpResponse.getBody(), DeliveryPointInfo.class);
        }

        return deliverPointInfo;
    }
}
