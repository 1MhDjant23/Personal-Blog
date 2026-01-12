import fs from 'node:fs/promises';
import path from 'node:path';
import { __dirname } from '../server.js';
import { adminRoutesHandler } from '../adminRoutesHandler/adminRoutesHandler.js';
import loadTemplate from './loadTemplate.js';
import renderTemplate from './renderTemplate.js';
import { getAdminData, getArticle, getHomeData } from '../data/getData.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { isAdminAuth } from '../adminRoutesHandler/checkAdminAuth.js';
import setCookies from './setCookies.js';

export default async function handler(request, response) {

		const	resolveUrl = new URL(request.url, `http://${request.headers.host}`);
    const { method } = request;

		// console.log("id: --> ", resolveUrl.searchParams.get('id')); 
		
		
		
		let	isHanded = await guestRoutesHandler(resolveUrl, method, request, response);
		if (!isHanded)
		isHanded = adminRoutesHandler(resolveUrl, method, response);
	if (!isHanded) {
		response.end('404 Not Found'); 
		console.error('404 Not Found');
	}
}







async	function	guestRoutesHandler(resolveUrl, method, request, response) {
	let		isHandled = false;
	const	{ headers } = request;

	if (method === 'GET' && resolveUrl.pathname === '/') {
		let	template = await loadTemplate('home');
		if(template !== null)
		{
				const dataObj = await getHomeData();
				template = await renderTemplate(template, dataObj);
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
	else if (method === 'GET' && resolveUrl.pathname === '/login') {
		let	template = await loadTemplate('login');
	
		if (template !== null) {
			response.end(template);
		} else {
			response.writeHead(500, {
				'content-type': 'text/html'
			});
			response.end('Internal Server Error');
		}
		isHandled = true;
	}
	else if (method === 'POST' && resolveUrl.pathname === '/login') {
		isHandled = true;
		if (headers['cookie'] === undefined) /** user undefined when no cookies receivd */
		{
			let	body = '';
		
			request.on('data', (chunck) => body += chunck );

			request.on('end', async () => {
				const loginInfo = new URLSearchParams(body); /** to parse it like query; as key-value */
				if (loginInfo.has('username') && loginInfo.has('password'))
				{
					const	adminData = await getAdminData();
					if (adminData === null) /** no admin exist in DB, so here i add the admin to DB */
					{
						const filePath = path.resolve(__dirname, 'data', 'admin.json');
						try {
							const	leToken = crypto.randomBytes(32).toString('hex');
							const	round = 10; /** how many times the bcrypt algorithm processes the password internally. */
							const hashedPassword = await bcrypt.hash(loginInfo.get('password'), round);
							const adminInfo = { "token": leToken, "username": loginInfo.get('username'), "password": hashedPassword };
							await fs.writeFile(filePath, JSON.stringify(adminInfo, null, 4), 'utf-8');
							
							console.log(`User LogedIn: ${loginInfo.get('username')}`);
							setCookies(leToken, loginInfo.get('username'), response);
							response.end('Logged Successfuly');
							return ;
						} catch (error) {
							console.log(error);
							response.writeHead(500, { 'Content-Type': 'text/html' });
							response.end('Internal Server Error');
							return ;
						}
					}
					else /** admin Exist in DB, but the browser dosen't send Cookies, just form info */ 
					{
						console.log('<<<<<<<< No Cookies, But Admin exist in DataBase >>>>>>>>');
						if ( adminData['username'] === loginInfo.get('username')
							&& bcrypt.compare(loginInfo.get('password'), adminData['password']))
						{
							setCookies(adminData['token'], adminData['username'], response);
							response.end(`Welcome ${adminData['username']} from your Personal Blog Post`);
							return ;
						} 
						else {
							response.writeHead(401, { 'Content-Type': 'text/plain' });
							response.end('Login failed: Invalid username or password');
							return ;
						}
					}
				}
				else { /** to set later */ }
			})

		}
		else
		{
			isAdminAuth(request)
				.then( (isMatch) => {
					if (!isMatch) {
						response.writeHead(401, { 'Location': '/login' });
						response.end()
					} else {
						response.writeHead(200, { 'Location': '/admin' })
						response.end();
					}
				} )
		}
	}
	return isHandled;
}