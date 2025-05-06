export interface QuickBooksTokensResponse {
    id_token: string,
    expires_in: number,
    token_type: string,
    access_token: string,
    refresh_token: string,
    x_refresh_token_expires_in: number,
    realmId: string 
}
 
export interface QuickBooksRevokedTokenResponse {
     revoke: boolean;
     message: string,
     token: string,
     status: number
}
 
export interface QuickBooksJwksResponse {
     keys: [ { kid: string }]
}