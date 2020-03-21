import { LightningElement, api, track, wire } from "lwc";
import { getRecord, getFieldValue, updateRecord } from "lightning/uiRecordApi";

import ACCOUNT_ID from "@salesforce/schema/Account.Id";
import ACCOUNT_DELIVERY_POINT_PHOTO_ID from "@salesforce/schema/Account.Delivery_Point_Photo_Id__c";
import ACCOUNT_LAST_DELIVERY_POINT_PHOTO_URL from "@salesforce/schema/Account.Last_Delivery_Point_Photo_URL__c";
import ACCOUNT_LAST_DELIVERY_POINT_PHOTO_TITLE from "@salesforce/schema/Account.Last_Delivery_Point_Photo_Title__c";

import No_Image_Available from "@salesforce/resourceUrl/No_Image_Available";
import No_Title_Available from "@salesforce/label/c.No_Title_Available";

import getDeliveryPointInfoByPhotoId from "@salesforce/apex/AccountDeliveryPointInfoController.getDeliveryPointInfoByPhotoId";

//Could be done with fieldset, for demo purposes this will suffice
const ACCOUNT_FIELDS = [ACCOUNT_ID, ACCOUNT_DELIVERY_POINT_PHOTO_ID, ACCOUNT_LAST_DELIVERY_POINT_PHOTO_URL, ACCOUNT_LAST_DELIVERY_POINT_PHOTO_TITLE];

export default class AccountDeliveryPointInfoCard extends LightningElement {
    isInitialised = false;
    labels = {
        No_Title_Available
    };

    @api recordId;

    @track accountData;
    @track fetchedDeliveryPoint;

    @wire(getRecord, { recordId: "$recordId", fields: ACCOUNT_FIELDS })
    async wiredAccount({ exception, data }) {
        if (data && !this.isInitialised) {
            try {
                this.accountData = data;
                let deliveryPointPhotoId = getFieldValue(data, ACCOUNT_DELIVERY_POINT_PHOTO_ID);

                if (deliveryPointPhotoId) {
                    let deliveryPointInfo = await getDeliveryPointInfoByPhotoId({ deliveryPointPhotoId });
                    this.fetchedDeliveryPoint = deliveryPointInfo;
                    await this.updateAccountWithDeliveryPointInfo(deliveryPointInfo);
                }
                this.isInitialised = true;
            } catch (exceptionInstance) {
                this.handleException(exceptionInstance);
            }
        }
        if (exception) {
            this.handleException(exception);
        }
    }

    get deliveryPointInfoUrl() {
        let url = No_Image_Available;

        if (this.accountData) {
            let lastDeliveryPointPhotoUrl = getFieldValue(this.accountData, ACCOUNT_LAST_DELIVERY_POINT_PHOTO_URL);

            if (this.fetchedDeliveryPoint) {
                url = this.fetchedDeliveryPoint.url;
            } else if (lastDeliveryPointPhotoUrl) {
                url = lastDeliveryPointPhotoUrl;
            }
        }

        return url;
    }

    get deliveryPointInfoTitle() {
        let title = No_Title_Available;

        if (this.accountData) {
            let lastDeliveryPointPhotoTitle = getFieldValue(this.accountData, ACCOUNT_LAST_DELIVERY_POINT_PHOTO_TITLE);

            if (this.fetchedDeliveryPoint) {
                title = this.fetchedDeliveryPoint.title;
            } else if (lastDeliveryPointPhotoTitle) {
                title = lastDeliveryPointPhotoTitle;
            }
        }
        return title;
    }

    async updateAccountWithDeliveryPointInfo(deliveryPointInfo) {
        try {
            const fields = {};
            fields[ACCOUNT_ID.fieldApiName] = this.recordId;
            fields[ACCOUNT_LAST_DELIVERY_POINT_PHOTO_TITLE.fieldApiName] = deliveryPointInfo.title;
            fields[ACCOUNT_LAST_DELIVERY_POINT_PHOTO_URL.fieldApiName] = deliveryPointInfo.url;

            await updateRecord({ fields });
        } catch (exception) {
            this.handleException(exception);
        }
    }

    handleException(exception) {
        //We could do some heavy error parsing here, don't think this is part of the excercise
        console.warn(exception);
    }
}
