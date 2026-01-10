import { __dirname } from '../server.js';
import loadTemplate from './loadTemplate.js';
import renderTemplate from './renderTemplate.js';
import { getArticle } from '../data/getData.js';
import { getHomeData } from '../data/getData.js';

export default async function handler(request, response) {
		const	resolveUrl = new URL(request.url, `http://${request.headers.host}`);
    const { method } = request;

		console.log("id: --> ", resolveUrl.searchParams.get('id')); 

		let	isHanded = await guestRoutesHandler(resolveUrl, method, response);
		if (!isHanded)
			isHanded = adminRoutesHandler(resolveUrl, method, response);
		if (!isHanded) {
			response.end('404 Not Found'); 
			console.error('404 Not Found');
		}
}

async	function	guestRoutesHandler(resolveUrl, method, response) {
	let	isHandled = false;

	if (method === 'GET' && resolveUrl.pathname === '/') {
		let	template = await loadTemplate('home');
		if(template !== null)
		{
				const dataObj = await getHomeData();
				template = await renderTemplate(template, dataObj);
				// console.log(template);
				response.write(template);
				response.end();

		}
		else
		{
			response.writeHead(500, {
				'content-type': 'text/html'
			});
			response.end('Home Internal Server Error');
		}
		isHandled = true;
	}
	else if ( method === 'GET'
				&&  resolveUrl.pathname === '/article'
				&&  resolveUrl.searchParams.has('id')
				&& 	resolveUrl.searchParams.size === 1 )
	{
		let	template = await loadTemplate('articles');
		if (template !== null) 
		{
				const	articleId = resolveUrl.searchParams.get('id');
				const	article = await getArticle(articleId);
				
				if (!Number.isSafeInteger(Number(articleId)) || Object.keys(article).length === 0) {
					response.writeHead(404, { 'Content-Type': 'text/html' });
					response.end('Article Not Found');
				} else {
					template = await renderTemplate(template, article);
					response.writeHead(200, { 'Content-Type': 'text/html' });
					response.end(template);
				}
		}
		else {
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