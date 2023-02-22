import https from 'https';
import FormData from 'form-data';

/**
 * Makes Http calls on specified urls.
 */
export class HttpClient {

    /**
     * Used to log to the console.
     */
    private _console: Console;

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
     * Sends a post request to the specified url with the specified data.
     * @param url The url to send a post request to.
     * @param form The data to put in the post.
     */
    sendPostForm(url: string, form: FormData) {
        this.sendPostFormHandleResponse(url, form, function (chunk) {
            console.log('Response: ' + chunk)
        })
    }

    /**
     * Sends a post request to the specified url with the specified data.
     * @param url The url to send a post request to.
     * @param form The data to put in the post.
     * @param response The post response handler function.
     */
    sendPostFormHandleResponse(url: string, form: FormData, response: (chunk: any) => void) {
        const aUrl = new URL(url)

        var post_options = {
            host: aUrl.host,
            port: aUrl.port,
            path: aUrl.pathname,
            method: 'POST',
            headers: form.getHeaders()
        };

        // Set up the request
        var post_req = https.request(post_options, function (res) {
            res.setEncoding('utf8')
            res.on('data', response)
        });

        // post the data
        form.pipe(post_req)
    }

    /**
     * Sends a get request to the specified url.
     * @param url The url of the get request.
     */
    sendGet(url: string) {
        this.sendGetHandleResponse(url, function (chunk) {
            console.log('Response: ' + chunk);
        })
    }

    /**
     * Sends a get request to the specified url.
     * @param url The url of the get request.
     * @param response The get response handler function.
     */
    sendGetHandleResponse(url: string, response: (chunk: any) => void) {
        const aUrl = new URL(url);
        var options = {
            host: aUrl.host,
            port: aUrl.port,
            path: aUrl.pathname + '?' + aUrl.searchParams,
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        };

        // Set up the request
        var get_req = https.request(options, function (res) {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', (chunk: string): void => {data += chunk;});
            res.on('end', (): void =>{response(data);});
        });

        // get the data
        get_req.end();
    }

}