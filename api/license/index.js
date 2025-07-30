// Export all license handlers
export { createLicenseCRUDHandler, POST as licensePOST, GET as licenseGET } from './license-crud';
export { createActivateHandler, POST as activatePOST } from './activate';
export { createDeactivateHandler, DELETE as deactivateDELETE } from './deactivate';
export { createValidateHandler, POST as validatePOST } from './validate';
export { createInfoHandler, GET as infoGET } from './info';
export { createRecoverHandler, POST as recoverPOST } from './recover';