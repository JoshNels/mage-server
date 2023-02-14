import https from 'https';

/**
 * Makes Http calls on specified urls.
 */
export class HttpClient {

    /**
     * Used to log to the console.
     */
    _console: Console;

    /**
     * Constructor.
     * @param console Used to log to the console.
     */
    constructor(console: Console) {
        this._console = console;
    }

    /**
     * Sends a post request to the specified url with the specified data.
     * @param url The url to send a post request to.
     * @param formData The data to put in the post.
     */
    sendPost(url: string, formData: string) {
        this.sendPostHandleResponse(url, formData, function (chunk) {
            console.log('Response: ' + chunk);
        })
    }

    /**
     * Sends a post request to the specified url with the specified data.
     * @param url The url to send a post request to.
     * @param formData The data to put in the post.
     * @param response The post response handler function.
     */
    sendPostHandleResponse(url: string, formData: string, response: (chunk: any) => void) {
        const aUrl = new URL(url);
        var post_options = {
            host: aUrl.host,
            port: aUrl.port,
            path: aUrl.pathname,
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'content-length': Buffer.byteLength(formData),
                'accept': 'application/json'
            }
        };

        // Set up the request
        var post_req = https.request(post_options, function (res) {
            res.setEncoding('utf8');
            res.on('data', response);
        });

        // post the data
        post_req.write(formData);
        post_req.end();
    }

    /**
     * Sends a get request to the specified url.
     * @param url The url of the get request.
     */
    sendGet(url: string) {
        const aUrl = new URL(url);
        var post_options = {
            host: aUrl.host,
            port: aUrl.port,
            path: aUrl.pathname,
            method: 'GET',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'accept': 'application/json'
            }
        };

        // Set up the request
        var get_req = https.request(post_options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
        });

        // post the data
        get_req.end();
    }
}