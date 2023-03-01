import { v2 as webdav } from 'webdav-server';
import fs from 'fs';

fs.readFile("config.json", {encoding: 'utf-8'}, function(configReadError, data) {
    if (configReadError) throw configReadError;

    const userManager = new webdav.SimpleUserManager();
    const credentials = JSON.parse(data);
    const user = userManager.addUser(credentials.username, credentials.password, true)
    const privilegeManager = new webdav.SimplePathPrivilegeManager();

    privilegeManager.setRights(user, '/sync', ['all']);

    const server = new webdav.WebDAVServer({
        port: 1900,
        httpAuthentication: new webdav.HTTPBasicAuthentication(userManager),
        privilegeManager: privilegeManager,
        requireAuthentification: true
    });

    server.afterRequest((arg, next) => {
        // Display the method, the URI, the returned status code and the returned message
        console.log('>>', arg.request.method, arg.requested.uri, '>', arg.response.statusCode, arg.response.statusMessage);
        // If available, display the body of the response
        console.log(arg.responseBody);
        next();
    });
    
    server.setFileSystem('/sync', new webdav.PhysicalFileSystem('sync'), (success) => {
        server.start(() => console.log('READY'));
    });
    
});
