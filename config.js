const url = 'https://api-gw-tg.memefi.club/graphql';


function getHeaders(headers = {}) {

    return { 
      'Host': 'api-gw-tg.memefi.club',
      'Accept': '*/*',
      ...headers,
      'Sec-Fetch-Site': 'same-site',
      'Accept-Language': 'en-GB,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Sec-Fetch-Mode': 'cors',
      'Content-Type': 'application/json',
      'Origin': 'https://tg-app.memefi.club',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
      'Referer': 'https://tg-app.memefi.club/',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'empty'
      };
}

module.exports = { url, getHeaders }
