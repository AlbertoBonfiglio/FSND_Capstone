/**
* Handler that will be called during the execution of a PostUserRegistration flow.
* adds the roles the user is assigned to to the tokens
*
* for consistency both roles and permissions are returned in a custom claim namespace/<claim>
* 
* @param {Event} event - Details about the context and user that has registered.
* @param {api} api - Methods and utilities to help change the behavior after a signup.
*/
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'tankrover_api';
  try {
    const ManagementClient = require("auth0").ManagementClient;

    const management = new ManagementClient({
      domain: event.secrets.domain,
      clientId: event.secrets.clientId,
      clientSecret: event.secrets.clientSecret,
      //scope: "read:roles create:roles update:roles",
    });
    const params =  { id : event.user.user_id };
    
    // Check if the user does not have  a role assigned
    if (event.authorization && (!event.authorization.roles || event.authorization.roles.length === 0)) {
      // adds the default user role
      const data = { "roles" : ["rol_xekrmU83P8wHxdNW"] };
      await management.users.assignRoles(params, data);
      
      // force loads the permissions
      const _perms = await management.users.getPermissions(params);
      const perms = _perms.data.map((item) => item.permission_name);

      api.idToken.setCustomClaim(`${namespace}/roles`, ['tankrover_user']);
      api.accessToken.setCustomClaim(`${namespace}/roles`, ['tankrover_user']);

      api.idToken.setCustomClaim(`${namespace}/user_permissions`, perms);
      api.accessToken.setCustomClaim(`${namespace}/user_permissions`, perms);
      
    } else if (event.authorization) {
        const _perms = await management.users.getPermissions(params);
        const perms = _perms.data.map((item) => item.permission_name);
        
        api.idToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
        api.accessToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);

        api.idToken.setCustomClaim(`${namespace}/user_permissions`, perms);
        api.accessToken.setCustomClaim(`${namespace}/user_permissions`, perms);
    }
  } catch (e) {
    console.log(e);
  }
  
};