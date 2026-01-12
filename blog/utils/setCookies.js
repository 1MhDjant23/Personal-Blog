

export default  function setCookies(token, username, res) {
  res.setHeader('Set-Cookie', [
    `le_token=${token}; HttpOnly`,
    `username=${username}; HttpOnly`
  ]);
  res.writeHead(302, { Location: 'article?id=1' });
}

