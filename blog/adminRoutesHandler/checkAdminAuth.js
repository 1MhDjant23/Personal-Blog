import { getAdminData } from "../data/getData.js";
// import bcrypt from 'bcrypt';

async function isAdminAuth(request) {
  const { headers } = request;
  const cookies = new URLSearchParams(headers['cookie']);
  const adminData = await getAdminData();

  if ( adminData === null
    || adminData['username'] !== cookies.get('username')
    || adminData['token'] !== cookies.get('le_token'))
  {
    return false;
  }
  return true;
}

export { isAdminAuth };
