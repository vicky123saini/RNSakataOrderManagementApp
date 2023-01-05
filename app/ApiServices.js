import * as env from "../env";
import * as Auth from './Auth';

export const LoginService = async (body) => {
    return GetDateFromServer({
        uri:`BMCRM/BMCRMService.svc/ValidateUser`, 
        method:"POST",
        body:body
    });
}

export const ForgotPasswordService = async (body) => {
    return GetDateFromServer({
        uri:`BMCRM/BMCRMService.svc/ForgotPassword`, 
        method:"POST",
        body:body
    });
}

export const ChangePasswordService = async (body) => {
    return GetDateFromServer({
        uri:`BMCRM/BMCRMService.svc/ChangePassword`, 
        method:"POST",
        body:body
    });
}

export const ViewProfileService = async (body) => {
    return GetDateFromServer({
        uri:`/BMCRM/BMCRMService.svc/GetEmployeeDetails`, 
        method:"POST",
        body:body
    });
}

export const OrderListingService = async (body) => {
    return GetDateFromServer({
        uri:`BMSales/BMSalesService.svc/GetSO`, 
        method:"POST",
        body:body
    });
}

export const OrderDetailsService = async (body) => {
    return GetDateFromServer({
        uri:`BMSales/BMSalesService.svc/GetSOID`, 
        method:"POST",
        body:body
    });
}

export const CreateOrderService = async (body) => {
    return GetDateFromServer({
        uri:`BMSales/BMSalesService.svc/INUPSO`, 
        method:"POST",
        body:body
    });
}

export const CancelOrderService = async (body) => {
    return GetDateFromServer({
        uri:`ApprovalProcess/ApprovalProcess.svc/DocumentCancelled`, 
        method:"POST",
        body:body
    });
}

export const ItemVariantGroupListService = async (body) => {
    return GetDateFromServer({
        uri:`/BMInventory/BMInventoryService.svc/GETPOIM`, 
        method:"POST",
        body:body
    });
}

export const ItemVariantListService = async (body) => {
    return GetDateFromServer({
        uri:`BMInventory/BMInventoryService.svc/GetItemVariant`, 
        method:"POST",
        body:body
    });
}

export const AddItemService = async (body) => {
    return GetDateFromServer({
        uri:`BMSales/BMSalesService.svc/INUPSOD`, 
        method:"POST",
        body:body
    });
}

export const DeleteItemService = async (body) => {
    return GetDateFromServer({
        uri:`BMSales/BMSalesService.svc/DelSOLI`, 
        method:"POST",
        body:body
    });
}

export const AddNoteService = async (body) => {
    return GetDateFromServer({
        uri:`ApprovalProcess/ApprovalProcess.svc/SaveNote`, 
        method:"POST",
        body:body
    });
}

export const ViewNoteService = async (body) => {
    return GetDateFromServer({
        uri:`ApprovalProcess/ApprovalProcess.svc/GetDocumentNoteFileHistory`, 
        method:"POST",
        body:body
    });
}

export const SaleTypeService = async (body) => {
    return GetDateFromServer({
        uri:`BMInventory/BMInventoryService.svc/GetAssDOC`, 
        method:"POST",
        body:body
    });
}

export const ReferenceTypeService = async (body) => {
    return GetDateFromServer({
        uri:`BMInventory/BMInventoryService.svc/GetDEFMV`, 
        method:"POST",
        body:body
    });
}

export const SalesExecutiveService = async (body) => {
    return GetDateFromServer({
        uri:`BMInventory/BMInventoryService.svc/GetEMP`, 
        method:"POST",
        body:body
    });
}

export const DispatchBranchService = async (body) => {
    return GetDateFromServer({
        uri:`BMInventory/BMInventoryService.svc/GetLo`, 
        method:"POST",
        body:body
    });
}

export const CustomerNameService = async (body) => {
    return GetDateFromServer({
        uri:`BMInventory/BMInventoryService.svc/GetCusto`, 
        method:"POST",
        body:body
    });
}

export const ContactPersonService = async (body) => {
    return GetDateFromServer({
        uri:`PO/BMPO.svc/GetContactPerson`, 
        method:"POST",
        body:body
    });
}

export const ContactPersonAddresService = async (body) => {
    return GetDateFromServer({
        uri:'/PO/BMPO.svc/GetContactPersonAddress',
        method:"POST",
        body:body
    });
}

export const ShipingMethodService = async (body) => {
    return GetDateFromServer({
        uri:`BMInventory/BMInventoryService.svc/GetTD`, 
        method:"POST",
        body:body
    });
}

export const ShippingCompanyService = async (body) => {
    return GetDateFromServer({
        uri:`BMInventory/BMInventoryService.svc/GetSUP`, 
        method:"POST",
        body:body
    });
}

export const PriorityTypeService = async (body) => {
    return GetDateFromServer({
        uri:`BMCRM/BMCRMService.svc/GetCMC`, 
        method:"POST",
        body:body
    });
}

export const PaymentMethodService = async (body) => {
    return GetDateFromServer({
        uri:`BMCRM/BMCRMService.svc/GetCMC`, 
        method:"POST",
        body:body
    });
}

export const CRVService = async (body) => {
    return GetDateFromServer({
        uri:`BMCRM/BMCRMService.svc/GetCRV`, 
        method:"POST",
        body:body
    });
}

export const CropsService = async (body) => {
    return GetDateFromServer({
        uri:`BMInventory/BMInventoryService.svc/GetDOCIG`, 
        method:"POST",
        body:body
    });
}

export const GetIUOMService = async (body) => {
    return GetDateFromServer({
        uri:`BMInventory/BMInventoryService.svc/GetIUOM`, 
        method:"POST",
        body:body
    });
}

export const GetItemMNUService = async (body) => {
    return GetDateFromServer({
        uri:`BMInventory/BMInventoryService.svc/GetItemMNU`, 
        method:"POST",
        body:body
    });
}

export const GetIPTService = async (body) => {
    return GetDateFromServer({
        uri:`BMInventory/BMInventoryService.svc/GetIPT`, 
        method:"POST",
        body:body
    });
}

export const GetIPUService = async (body) => {
    return GetDateFromServer({
        uri:`BMInventory/BMInventoryService.svc/GetIPU`, 
        method:"POST",
        body:body
    });
}

export const GETIPService = async (body) => {
    return GetDateFromServer({
        uri:`BMInventory/BMInventoryService.svc/GETIP`, 
        method:"POST",
        body:body
    });
}

export const FinalizeModifyDocumentService = async (body) => {
    return GetDateFromServer({
        uri:`ApprovalProcess/ApprovalProcess.svc/FinalizeModifyDocument`, 
        method:"POST",
        body:body
    });
}

export const GetEmployeeRolefunctionService = async (body) => {
    return GetDateFromServer({
        uri:`BMTeamManage/BMTeamManageService.svc/GetTeamList`, 
        method:"POST",
        body:body
    });
}

export const GetContactPersonAddressService = async (body) => {
    return GetDateFromServer({
        uri:`PO/BMPO.svc/GetContactPersonAddress`, 
        method:"POST",
        body:body
    });
}

export const GetSupplierAddressService = async (body) => {
    return GetDateFromServer({
        uri:`PO/BMPO.svc/GetSupplierAddress`, 
        method:"POST",
        body:body
    });
}

export const GetAccountStatementService = async (body) => {
    return GetDateFromServer({
        uri:`BMReports/BMReportsService.svc/GetAccountStatement`, 
        method:"POST",
        body:body
    });
}

export const GetDealerListService = async (body) => {
    return GetDateFromServer({
        //uri:`BMCRM/BMCRMService.svc/GetDealerList`, 
        uri:`BMCRM/BMCRMService.svc/GetDealerList_V_2`,
        method:"POST",
        body:body
    });
}

const GetDateFromServer = async ({uri, method, body}) => {
    const AccessToken = await Auth.AccessToken(); 
    let BaseUrl=env.BASE_URL;
    if(AccessToken!=null && AccessToken.ServiceRoot!=null){
        BaseUrl=AccessToken.ServiceRoot;
    }
     

    
    var headers=env.headers;
    const promise = new Promise(async (resolve, reject) => {
        try {
            var request={
                method: method,
                headers: headers,
            }
            if(method=="POST"){
                request.body=JSON.stringify(body)
            }
            fetch(`${BaseUrl}${uri}`, request)
            .then((response) => response.json())
            .then((json) => resolve(json))
            .catch((error) => {
                
                reject(error); 
            })

        } catch (msg) { 
            
            reject(msg); 
        }
    });
    return promise;
}