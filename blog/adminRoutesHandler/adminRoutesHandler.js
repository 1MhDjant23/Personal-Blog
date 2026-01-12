
function	adminRoutesHandler(resolveUrl, method, response) {
	let	isHandled = false;
	
	if (method === 'GET' && resolveUrl.pathname === '/admin') {
    


		response.write('GET /admin');
		console.log('GET /admin');
		isHandled = true;
	}
	else if (method === 'GET' && resolveUrl.pathname === '/admin/add') {
		response.write('GET /admin/add');
		console.log('GET /admin/add');
		isHandled = true;
	}
	else if (method === 'POST' && resolveUrl.pathname === '/admin/add') {
		response.write('POST /admin/add');
		console.log('POST /admin/add');
		isHandled = true;
	}
	else if (method === 'GET' && resolveUrl.pathname === '/admin/edit') {
		response.write('GET /admin/edit');
		console.log('GET /admin/edit');
		isHandled = true;
	}
	else if (method === 'POST' && resolveUrl.pathname === '/admin/edit') {
		response.write('POST /admin/edit');
		console.log('POST /admin/edit');
		isHandled = true;
	}
	else if (method === 'POST' && resolveUrl.pathname === '/admin/delete') {
		response.write('POST /admin/delete');
		console.log('POST /admin/delete');
		isHandled = true;
	}
	return isHandled;
}

export { adminRoutesHandler };