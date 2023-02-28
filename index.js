// TypeScript
import { v2 as webdav } from 'webdav-server'

const server = new webdav.WebDAVServer({
    port: 1900
});
 
server.afterRequest((arg, next) => {
    // Display the method, the URI, the returned status code and the returned message
    console.log('>>', arg.request.method, arg.requested.uri, '>', arg.response.statusCode, arg.response.statusMessage);
    // If available, display the body of the response
    console.log(arg.responseBody);
    next();
});
 
server.start(() => console.log('READY'));