const dns = require('dns').promises;

/**
 * 設定自訂 DNS 伺服器
 * @param {string[]} servers DNS 伺服器列表
 */
function setDNSServers(servers) {
  dns.setServers(servers);
  console.log(`✅ 已設定 DNS 伺服器: ${servers.join(', ')}`);
}

/**
 * 獲取當前 DNS 伺服器
 * @returns {string[]}
 */
function getDNSServers() {
  return dns.getServers();
}

/**
 * 反轉 IP 地址 (用於 DNSBL)
 * @param {string} ip 
 * @returns {string}
 */
function reverseIP(ip) {
  if (!ip) return '';
  return ip.split('.').reverse().join('.');
}

/**
 * Spamhaus ZEN 查詢 (IP)
 * @param {string} ip 
 * @returns {Promise<{listed: boolean, code?: string, lists?: string[]}>}
 */
async function checkSpamhausZEN(ip) {
  if (!ip || !/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
    throw new Error('Invalid IPv4 address');
  }

  const query = `${reverseIP(ip)}.zen.spamhaus.org`;

  try {
    const addresses = await dns.resolve4(query);
    const code = addresses[0]; // 通常回傳 127.0.0.x

    const listMap = {
      '127.0.0.2': 'SBL',
      '127.0.0.3': 'SBL/CSS',
      '127.0.0.4': 'XBL',
      '127.0.0.6': 'XBL',
      '127.0.0.7': 'XBL',
      '127.0.0.9': 'SBL',
      '127.0.0.10': 'PBL',
      '127.0.0.11': 'PBL',
    };

    return {
      listed: true,
      code,
      lists: listMap[code] ? [listMap[code]] : ['Unknown']
    };
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      return { listed: false };
    }
    throw err;
  }
}

/**
 * SURBL Multi 查詢 (域名或 IP)
 * @param {string} value 域名或 IP
 * @returns {Promise<{listed: boolean, code?: string, score?: number, lists?: string[]}>}
 */
async function checkSurblMulti(value) {
  if (!value) throw new Error('Value is required');

  let query;

  // 如果是 IP，轉成 reversed IP
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) {
    query = `${reverseIP(value)}.multi.surbl.org`;
  } else {
    // 域名直接使用（SURBL 支援 subdomain）
    query = `${value}.multi.surbl.org`;
  }

  try {
    const addresses = await dns.resolve4(query);
    const code = addresses[0]; // 如 127.0.0.x

    // SURBL Multi bitmask 解碼
    const octet = parseInt(code.split('.').pop(), 10);
    const lists = [];

    if (octet & 1) lists.push('TEST');           // 測試點
    if (octet & 2) lists.push('ABUSE');          // 濫用
    if (octet & 4) lists.push('PH');             // Phishing
    if (octet & 8) lists.push('MW');             // Malware
    if (octet & 16) lists.push('CR');            // Cracked / Compromised
    if (octet & 32) lists.push('CT');            // ...
    if (octet & 64) lists.push('DM');            // ...

    return {
      listed: true,
      code,
      score: octet,
      lists
    };
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      return { listed: false };
    }
    throw err;
  }
}

/**
 * 查詢 SURBL Multi 清單
 */
async function checkBoth(ipOrDomain) {
  console.log(`🔍 正在查詢: ${ipOrDomain}`);

  const surblResult = await checkSurblMulti(ipOrDomain);

  return {
    input: ipOrDomain,
    surblMulti: surblResult
  };
}

// ==================== 使用範例 ====================

async function main() {
  setDNSServers(['8.8.8.8', '8.8.4.4']);

  console.log(await checkBoth('readav.com'));
  console.log(await checkBoth('mirai.re'));
  console.log(await checkBoth('jomeil.com'));
  console.log(await checkBoth('nixaur.com'));

}

main().catch(console.error);