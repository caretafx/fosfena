/* Fosfena · gerador de tokens do LiveKit (Cloudflare Worker, plano gratuito).
   O segredo NUNCA fica no site: ele mora nas variáveis do Worker.
   Variáveis (Settings → Variables and Secrets):
     LIVEKIT_API_KEY     = a API Key do projeto (ex.: APIxxxx)
     LIVEKIT_API_SECRET  = o API Secret (marcar como Secret/Encrypt)
   Uso: GET https://<seu-worker>.workers.dev/?room=sala-de-estudo&name=user1  →  {"token":"..."} */
const ROOMS = ['sala-de-estudo', 'revisao-de-wip', 'bate-papo', 'live'];
const LK_HTTP = 'https://fosfena-0k1hsnkn.livekit.cloud';  // mesmo projeto do wss://, em https
const ORIGINS = ['https://caretafx.github.io', 'http://localhost:8765'];

const b64url = b => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const enc = s => new TextEncoder().encode(s);

async function sign(payload, secret){
  const head = b64url(enc(JSON.stringify({alg:'HS256', typ:'JWT'})));
  const body = b64url(enc(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey('raw', enc(secret), {name:'HMAC', hash:'SHA-256'}, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc(head + '.' + body));
  return head + '.' + body + '.' + b64url(sig);
}

/* Quem está em cada sala (para mostrar embaixo dos canais, como no Discord).
   GET ?list=1  ->  {"rooms":{"sala-de-estudo":["Ana","Beto"], ...}}. Guarda a resposta por 4 s. */
async function listRooms(env, cors){
  const cache = caches.default, key = new Request('https://cache.fosfena/list');
  const hit = await cache.match(key);
  if (hit) return new Response(hit.body, {headers: cors});
  const now = Math.floor(Date.now()/1000);
  const rooms = {};
  await Promise.all(ROOMS.map(async room => {
    const jwt = await sign({ iss: env.LIVEKIT_API_KEY, sub: 'lista', nbf: now - 10, exp: now + 60, video: { room, roomAdmin: true } }, env.LIVEKIT_API_SECRET);
    try {
      const r = await fetch(LK_HTTP + '/twirp/livekit.RoomService/ListParticipants', { method:'POST', headers:{ 'Authorization':'Bearer '+jwt, 'Content-Type':'application/json' }, body: JSON.stringify({room}) });
      const j = r.ok ? await r.json() : {};
      rooms[room] = (j.participants||[]).map(p => p.name || p.identity);
    } catch(e) { rooms[room] = []; }
  }));
  const body = JSON.stringify({rooms});
  await cache.put(key, new Response(body, {headers:{'Cache-Control':'max-age=4','Content-Type':'application/json'}}));
  return new Response(body, {headers: cors});
}

export default {
  async fetch(req, env){
    const origin = req.headers.get('Origin') || '';
    const cors = { 'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : ORIGINS[0], 'Vary':'Origin', 'Content-Type':'application/json' };
    if (req.method === 'OPTIONS') return new Response(null, {headers: cors});
    const u = new URL(req.url);
    if (u.searchParams.get('list') === '1') return listRooms(env, cors);
    const room = u.searchParams.get('room') || '';
    const name = (u.searchParams.get('name') || 'aluno').slice(0, 40);
    const host = u.searchParams.get('host') === '1';  // só a sala "live" usa: quem transmite
    if (!ROOMS.includes(room)) return new Response(JSON.stringify({error:'sala inválida'}), {status:400, headers:cors});
    if (!env.LIVEKIT_API_KEY || !env.LIVEKIT_API_SECRET) return new Response(JSON.stringify({error:'faltam as variáveis do LiveKit'}), {status:500, headers:cors});
    const now = Math.floor(Date.now()/1000);
    const identity = name + '-' + crypto.randomUUID().slice(0, 6);
    const canPublish = room !== 'live' || host;
    const token = await sign({
      iss: env.LIVEKIT_API_KEY, sub: identity, name, nbf: now - 10, exp: now + 60*60*4,
      video: { room, roomJoin: true, canPublish, canSubscribe: true, canPublishData: true }
    }, env.LIVEKIT_API_SECRET);
    return new Response(JSON.stringify({token, identity}), {headers: cors});
  }
};
