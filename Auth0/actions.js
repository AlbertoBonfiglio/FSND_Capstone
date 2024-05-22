/**
* Handler that will be called during the execution of a PostUserRegistration flow.
* adds the roles the user is assigned to to the tokens
*
* @param {Event} event - Details about the context and user that has registered.
* @param {api} api - Methods and utilities to help change the behavior after a signup.
* 
* Use the Authorization extension api to add roles
* then add a flag to the custom claims so the SPA will refresh the token and 
* receive the updated claims
*/

exports.onExecutePostLogin = async (event, api) => {
  const fetch = require("node-fetch");
  const axios = require("axios").default;

  const _getToken = async (event) => {
    const url = `https://${event.secrets.domain}/oauth/token`;
    var options = {
      method: 'POST',
      url: url,
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: event.secrets.clientId,
        client_secret: event.secrets.clientSecret,
        audience: 'urn:auth0-authz-api' //event.secrets.audience
      })
    };
    const result = await axios.request(options);
    return result.data.access_token;
  }

  // Not used anymore as the api accepts the role name (e.g. 'user')
  const _getRoleId = async (event, token, role) => {
    const url = `https://${event.secrets.extensionUrl}/api/roles`;
    const options = {
        method: 'get',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        } 
     }
    let _data = [];
    const res = await fetch(url,  options);
    if (res.ok) {
      _data = await res.json();
      return _data.roles.filter((item) => item.name === role)[0]._id; 
    }
    return null;  
  } 

  const _patchUser = async (event, token, roleId) => {
      const url = `https://${event.secrets.extensionUrl}/api/users/${event.user.user_id}/roles`;
      const meta = { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };
      const headers = new Headers(meta);   
      const options = {
        method: 'PATCH',
        headers: headers,
        body:  `["${roleId}"]`,
      }
      const response = await fetch(url,  options);
      if (response.ok) {
        return 'success'
      }
      return 'failure'
   }

 
  try {
    let forceRefresh = false;
    const data = event.user.app_metadata.authorization ?? null;
    
    // Check if the user has roles assigned
    if (data && data.roles && (data.roles.length > 0) ) {
      // everything checks, Move along. There are not the droids you're looking for
    } else {
      const token = await _getToken(event);
      const patch = await _patchUser(event, token, 'user');
      api.idToken.setCustomClaim('defaultRolePatch', patch);
      api.accessToken.setCustomClaim('defaultRolePatch', patch);
    
      forceRefresh = true;
    }

    api.idToken.setCustomClaim('user_profile',data);
    api.accessToken.setCustomClaim('user_profile',data);
    api.idToken.setCustomClaim(`forceRefresh`, forceRefresh); 
    api.accessToken.setCustomClaim(`forceRefresh`, forceRefresh);
} catch (e) {
    console.log(e);
  }
};