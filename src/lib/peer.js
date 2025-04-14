// lib/peer.js
import Peer from 'simple-peer'

export const createPeer = (initiator, stream, onSignal, onStream) => {
  const peer = new Peer({
    initiator,
    trickle: false,
    stream,
  })

  peer.on('signal', onSignal)
  peer.on('stream', onStream)

  return peer
}
