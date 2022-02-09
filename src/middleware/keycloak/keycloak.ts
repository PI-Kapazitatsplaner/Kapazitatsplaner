import session from 'express-session';
import Keycloak from 'keycloak-connect';

//Keycloak middleware
export const memoryStore = new session.MemoryStore();
let keycloak = new Keycloak({ store: memoryStore });

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