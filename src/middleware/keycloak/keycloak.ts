import session from 'express-session';
import Keycloak from 'keycloak-connect';

//Keycloak middleware
export const memoryStore = new session.MemoryStore();
let keycloak = new Keycloak({ store: memoryStore }, {
    "realm": "staging",
    "auth-server-url": "https://auth.wuersch.cloud/auth/",
    "ssl-required": "external",
    "bearer-only": true,
    "resource": "suva-ppk",
    "confidential-port": 0
});

//Mocking Keycloak for Testing
if (process.env.NODE_ENV === 'test') {
    console.log('Mocking Keycloak');
    keycloak.protect = () => {
        return (req, res, next) => {
            next();
        }
    }
}


export default keycloak;