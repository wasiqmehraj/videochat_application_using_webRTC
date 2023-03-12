let peerConnection;
let localStream;
let remoteStream;

var alice_offer;
var bob_answer;


// Setting up the stun servers//
let servers = {
    iceServers:[
        {
            urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        }
    ]
}

const websocket = new WebSocket("ws://192.168.1.42:3010")
const textbox = document.getElementById("log-area");
textbox.innerHTML += "LOG MESSAGES OF BOB>>>>>>>>\n";
// const alice_box = document.getElementById("alice-offer");
// const bob_box = document.getElementById("bob-answer");

websocket.onopen = function(event) {
    textbox.innerHTML +='BOB is connected to server.\n';
    // Only to notify that connection is established.
    // Connection is fully established and ready to send data
};

let init = async () => {
    //Navigator.mediaDevices read-only property returns a MediaDevices object, which provides access to connected media input devices like cameras and microphones, as well as screen sharing.//
    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    
    //The Document method getElementById() returns an Element object representing the element whose id property matches the specified string.//
    // Since element IDs are required to be unique if specified, they're a useful way to get access to a specific element quickly.//
    document.getElementById('local-video').srcObject = localStream
    
}

websocket.onmessage = (event) =>{
    textbox.innerHTML += 'onmessage triggered!\n'
    // textbox.innerHTML += (JSON.parse(event.data)).data
    alice_offer = (JSON.parse(event.data)).data
    // alice_box.innerHTML += alice_offer
}

let generateAnswer = async () =>{
    textbox.innerHTML += 'Inside generateAnswer\n'
    peerConnection = new RTCPeerConnection(servers)
    
    remoteStream = new MediaStream() //Put whatever you get from the other peer in remoteStream
    document.getElementById('remote-video').srcObject = remoteStream // and mark it as a yousa object in html document

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
            alice_offer = JSON.stringify(peerConnection.localDescription)
        }
    }

    let offer = alice_offer
    //get hold of the pasted alice-offer text box and put it in offer variable
    if(!offer) return alert('Failed to get alice-offer.')

    offer = JSON.parse(offer)
    await peerConnection.setRemoteDescription(offer)
    let answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    
    bob_answer = JSON.stringify(answer)
    // bob_box.innerHTML += bob_answer
    
}

init()

function sendData(data){
    websocket.send(JSON.stringify(data))
    textbox.innerHTML += 'server<----sent SDP to------BOB'
};

function sendAnswer(){
    sendData({
        type: "bob-answer",
        offer: bob_answer
    })
    
}
let learnCurrentConnectionState = async () => {
    textbox.innerHTML += '\n===============================================\n'
    textbox.innerHTML += 'peerConnection.connectionState: '
    textbox.innerHTML +=  peerConnection.connectionState
    textbox.innerHTML += '\n===============================================\n'
}

document.getElementById('learn-state').addEventListener('click', learnCurrentConnectionState)
document.getElementById('generate-answer').addEventListener('click', generateAnswer)
document.getElementById('send-answer').addEventListener('click', sendAnswer)