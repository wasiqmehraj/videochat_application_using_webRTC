let peerConnection;
let localStream;
let remoteStream;

// Setting up the stun servers//
let servers = {
    iceServers:[
        {
            urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        }
    ]
}
let init = async () => {
    //Navigator.mediaDevices read-only property returns a MediaDevices object, which provides access to connected media input devices like cameras and microphones, as well as screen sharing.//
    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    
    //The Document method getElementById() returns an Element object representing the element whose id property matches the specified string.//
    // Since element IDs are required to be unique if specified, they're a useful way to get access to a specific element quickly.//
    document.getElementById('mesa').srcObject = localStream
    
}

let generateAnswer = async () =>{
    peerConnection = new RTCPeerConnection(servers)
    
    remoteStream = new MediaStream() //Put whatever you get from the other peer in remoteStream
    document.getElementById('yousa').srcObject = remoteStream // and mark it as a yousa object in html document

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    })// add your local track to the peer connection, to send it to other peer.

    peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) =>{
            remoteStream.addTrack(track)
        })
    } // Add remote connection's track on the remoteStream, so that it can play in video player 

    peerConnection.onicecandidate = async (event) => { 
        // The ice candidates are added over to the peerConnection.
        if(event.candidate){//If we successfully got a candiate, we display it to alice-offer
            document.getElementById('alice-offer').value = JSON.stringify(peerConnection.localDescription)
        }
    }

    let offer = document.getElementById('alice-offer').value
    //get hold of the pasted alice-offer text box and put it in offer variable
    if(!offer) return alert('Retrive offer Alice first.')

    offer = JSON.parse(offer)
    await peerConnection.setRemoteDescription(offer)
    let answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    
    
    document.getElementById('bob-answer').value = JSON.stringify(answer)

}

init()


document.getElementById('generate-answer').addEventListener('click', generateAnswer)


