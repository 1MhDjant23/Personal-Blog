
export default function handler(request, response) {
    const {url, method} = request;

    console.log(`URL: ${url}`);
    console.log(`METHOD: ${method}`);
    response.end('You get it');
}