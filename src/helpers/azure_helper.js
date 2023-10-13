import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";
                                        
// get tenant ID using email in POST request
const getTenantId = data => post(url.GET_TENANT_ID, data);

export {
    getTenantId
};