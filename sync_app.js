import { v2 as webdav } from 'webdav-server';
import fs from 'fs';

export function app() {
    fs.readFile("config.json", {encoding: 'utf-8'}, function(configReadError, data) {
        if (configReadError) throw configReadError;
    
        const userManager = new webdav.SimpleUserManager();
        const credentials = JSON.parse(data);

        const privilegeManager = new webdav.SimplePathPrivilegeManager();

        credentials.forEach((userCredentials) => {
            const user = userManager.addUser(userCredentials.username, userCredentials.password, true)
            privilegeManager.setRights(user, '/', ['all']);
            console.log(user);
        });
    
        const server = new webdav.WebDAVServer({
            port: 1900,
            httpAuthentication: new webdav.HTTPBasicAuthentication(userManager),
            privilegeManager: privilegeManager,
            requireAuthentification: true,
        });
    
    
        server.beforeRequest((ctx, next) => {
            ctx.prefixUri = function () {
                const scheme = (this.headers.host === 'localhost') ? 'http' : 'https';
                    return scheme + '://' + this.headers.host.replace('/', '') + (this.rootPath ? this.rootPath : '');
                };
            next();
        });
    
        server.afterRequest((arg, next) => {
            // Display the method, the URI, the returned status code and the returned message
            console.log(arg.request.method, arg.requested.uri, '>', arg.response.statusCode, arg.response.statusMessage);
            // If available, display the body of the response
            next();
        });
    
    
        server.setFileSystem('/', new webdav.PhysicalFileSystem('sync'), (success) => {
            server.start(() => console.log('webdav server ready'));
        }); 
    });
}