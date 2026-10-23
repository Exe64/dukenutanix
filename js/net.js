'use strict';
/*
 * Peer to peer link between two copies of the game, over a WebRTC data channel.
 * No server: the host's offer and the guest's answer are complete session
 * descriptions (every ICE candidate gathered up front) that the players exchange
 * as text codes, by copy and paste. The public STUN server only helps each side
 * find its own address; there is no TURN relay, so some strict NATs cannot connect.
 */
const Net = (() => {
  const ICE = [{ urls: 'stun:stun.l.google.com:19302' }];
  let pc = null, ch = null, role = null;
  const handlers = { msg: null, open: null, close: null };
  const pack = (desc) => btoa(unescape(encodeURIComponent(JSON.stringify({ type: desc.type, sdp: desc.sdp }))));
  const unpack = (code) => JSON.parse(decodeURIComponent(escape(atob(code.replace(/\s+/g, '')))));

  // resolves once ICE gathering is complete (at most 3 s), so the code holds every candidate
  const gathered = () => new Promise((resolve) => {
    const my = pc;
    if (my.iceGatheringState === 'complete') { resolve(); return; }
    const t = setTimeout(resolve, 3000);
    my.addEventListener('icegatheringstatechange', () => { if (my.iceGatheringState === 'complete') { clearTimeout(t); resolve(); } });
  });
  // a lost connection (the other side closed the game, the network dropped) ends the session
  // ('disconnected' often recovers within seconds: it only ends the session if it lasts)
  let lostT = null;
  function lost() { const was = role; close(); if (was && handlers.close) handlers.close(); }
  function watch() {
    const my = pc;
    pc.onconnectionstatechange = () => {
      if (pc !== my) return;
      clearTimeout(lostT);
      if (my.connectionState === 'failed') lost();
      else if (my.connectionState === 'disconnected') lostT = setTimeout(() => { if (pc === my) lost(); }, 8000);
    };
  }
  function bind(channel) {
    ch = channel;
    ch.onopen = () => handlers.open && handlers.open();
    ch.onmessage = (e) => handlers.msg && handlers.msg(JSON.parse(e.data));
    ch.onclose = () => { const was = role; close(); if (was && handlers.close) handlers.close(); };
  }

  // host: creates the session, returns the offer code to send to the guest
  async function host() {
    close();
    role = 'host';
    const my = pc = new RTCPeerConnection({ iceServers: ICE });
    watch();
    bind(pc.createDataChannel('game'));
    await my.setLocalDescription(await my.createOffer());
    await gathered();
    if (pc !== my) throw new Error('cancelled');   // CANCEL or another session meanwhile
    return pack(my.localDescription);
  }
  // host: the guest's answer code completes the connection
  async function accept(code) { if (!pc) throw new Error('no session'); await pc.setRemoteDescription(unpack(code)); }
  // guest: takes the host's offer code, returns the answer code to send back
  async function join(code) {
    const offer = unpack(code);   // a malformed code throws here, before anything is set up
    close();
    role = 'guest';
    const my = pc = new RTCPeerConnection({ iceServers: ICE });
    watch();
    pc.ondatachannel = (e) => { if (pc === my) bind(e.channel); };
    try {
      await my.setRemoteDescription(offer);
      await my.setLocalDescription(await my.createAnswer());
    } catch (e) {
      if (pc === my) close();
      throw e;
    }
    await gathered();
    if (pc !== my) throw new Error('cancelled');
    return pack(my.localDescription);
  }
  function send(m) { if (ch && ch.readyState === 'open') ch.send(JSON.stringify(m)); }
  function close() {
    role = null;
    const p = pc;
    pc = null; ch = null;
    if (p) p.close();
  }
  // leaving the page closes the channel cleanly, so the other side knows at once; a page
  // restored from the back/forward cache then learns that its session is over
  let hiddenRole = null;
  addEventListener('pagehide', () => { hiddenRole = role; close(); });
  addEventListener('pageshow', (e) => { if (e.persisted && hiddenRole && handlers.close) handlers.close(); hiddenRole = null; });

  return {
    host, accept, join, send, close,
    get role() { return role; },
    get open() { return !!ch && ch.readyState === 'open'; },
    on(event, f) { handlers[event] = f; },
  };
})();
