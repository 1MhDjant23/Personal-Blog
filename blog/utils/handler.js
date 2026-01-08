import { __dirname } from '../server.js';
import url from 'node:url';
import loadTemplate from './loadTemplate.js';
import renderTemplate from './renderTemplate.js';
import { getArticle } from '../data/getData.js';

export default async function handler(request, response) {
    const {url: reqUrl, method} = request;
    const parsedUrl = url.parse(reqUrl, true);

    const pathname = parsedUrl.pathname;
		let	isHanded = await guestRoutesHandler(pathname, method, response);
		if (!isHanded)
			isHanded = adminRoutesHandler(pathname, method, response);
		if (!isHanded) {
			response.end('404 Not Found');
			console.error('404 Not Found');
		}

		console.log(`DIR: ${__dirname}`);
    console.log(`URL: ${reqUrl}`);
    console.log(`PATH: ${parsedUrl.pathname}`);
    console.log(`METHOD: ${method}`);
}

async	function	guestRoutesHandler(path, method, response) {
	let	isHandled = false;

	if (method === 'GET' && path === '/') {
		const	template = await loadTemplate('' ,'home.html');
		if(template !== null) {
			renderTemplate(template, {});
			console.log('GET / no null');
			// console.log(template);
			/**
			 * renderTameplate logic here.
			*/
			response.write(template);
			response.end();
		} else {
			console.log('GET error');
			response.writeHead(500, {
				'content-type': 'text/html'
			});
			response.write(template);
		}
		isHandled = true;
	}
	else if (method === 'GET' && path === '/article')
	{
		let	template = await loadTemplate('', 'articles');
		if (template !== null) {
			// const	data = await loadTemplate('data', 'articles');
			//  data = JSON.parse(data);
			const	articles = await getArticle();
			template = renderTemplate(template, articles[1]);
			response.write(template);
			response.end();
		} else {
			response.writeHead(500, {
				'content-type': 'text/html'
			});
			response.end('Internal Server Error');
		}
		isHandled = true;
	}
	return isHandled;
}

function	adminRoutesHandler(path, method, response) {
	let	isHandled = false;

	if (method === 'GET' && path === '/admin') {
		response.write('GET /admin');
		console.log('GET /admin');
		isHandled = true;
	}
	else if (method === 'GET' && path === '/admin/add') {
		response.write('GET /admin/add');
		console.log('GET /admin/add');
		isHandled = true;
	}
	else if (method === 'POST' && path === '/admin/add') {
		response.write('POST /admin/add');
		console.log('POST /admin/add');
		isHandled = true;
	}
	else if (method === 'GET' && path === '/admin/edit') {
		response.write('GET /admin/edit');
		console.log('GET /admin/edit');
		isHandled = true;
	}
	else if (method === 'POST' && path === '/admin/edit') {
		response.write('POST /admin/edit');
		console.log('POST /admin/edit');
		isHandled = true;
	}
	else if (method === 'POST' && path === '/admin/delete') {
		response.write('POST /admin/delete');
		console.log('POST /admin/delete');
		isHandled = true;
	}
	return isHandled;
}