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
// const alice_box = document.getElementById("alice-offer");
// const bob_box = document.getElementById('bob-answer')
textbox.innerHTML += "LOG MESSAGES OF ALICE>>>>>>>>\n";

websocket.onopen = function(event) {
    textbox.innerHTML +='Alice is connected to server.\n';
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

let generateOffer = async () =>{
    peerConnection = new RTCPeerConnection(servers)
    textbox.innerHTML +='\n Inside generate offer..\n';
    //The RTCPeerConnection interface represents a WebRTC connection between the local computer and a remote peer.
    //It provides methods to connect to a remote peer, maintain and monitor the connection, and close the connection once it's no longer needed.
    
    remoteStream = new MediaStream() //Put whatever you get from the other peer in remoteStream
    document.getElementById('remote-video').srcObject = remoteStream // and mark it as a yousa object in html document

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    })// add your local track to the peer connection, to send it to other peer.

    peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) =>{
            remoteStream.addTrack(track)
        })
    } // Add remote connection's track on the remoteStream 


     peerConnection.onicecandidate = async (event) => { 
        // The ice candidates are added over to the peerConnection.
        if(event.candidate){//If we successfully got a candiate, we display it to alice-offer
            alice_offer = JSON.stringify(peerConnection.localDescription)
        }
     }

    let offer = await peerConnection.createOffer()
    //Initiates the creation of an SDP offer for the purpose of starting a new WebRTC connection to a remote peer.

    await peerConnection.setLocalDescription(offer)

    
    // Connection already set up ----> renegotiation is underway.
    // Description specifies the properties of the local end of the connection, including the media format.
    // The method takes a single parameter—the session description—and it returns a Promise which is fulfilled once the description has been changed, asynchronously.
    alice_offer = JSON.stringify(offer)
    // Throws the offer in the text box called 'alice-offer' in string format.
    // alice_box.innerHTML += alice_offer
}

websocket.onmessage = (event) =>{
    bob_answer = JSON.parse(event.data).offer
    // bob_box.innerHTML += bob_answer
    textbox.innerHTML += 'Alice<----sent SDP to------Server\n'
}
let inputAnswer = async () => {
    textbox.innerHTML += 'inputAnswer function called..'
    let answer = bob_answer
    if(!answer) return alert('Get the answer from Bob first!!')

    answer = JSON.parse(answer)
    
    if(!peerConnection.currentRemoteDescription){
        peerConnection.setRemoteDescription(answer)
    }        
}

function sendOffer(){
    sendData({
        type: "alice-offer",
        offer: alice_offer
    })
    // textbox.innerHTML += alice_offer
}

// function sleep(milliseconds) {
//     const date = Date.now();
//     let currentDate = null;
//     do {
//       currentDate = Date.now();
//     } while (currentDate - date < milliseconds);
//   }

let learnCurrentConnectionState = async () => {
    textbox.innerHTML += '\n===============================================\n'
    textbox.innerHTML += 'peerConnection.connectionState: '
    textbox.innerHTML +=  peerConnection.connectionState 
    textbox.innerHTML += '\n===============================================\n'
}



// let generateAndSend = async() => {
//     generateOffer().then (function(){
//         sleep(2000)
//         sendOffer()
//     })    
// }

document.getElementById('generate-offer').addEventListener('click', generateOffer)
document.getElementById('send-offer').addEventListener('click', sendOffer)
// document.getElementById('generate-and-send').addEventListener('click', generateAndSend)
document.getElementById('input-answer').addEventListener('click', inputAnswer)
document.getElementById('learn-state').addEventListener('click', learnCurrentConnectionState)

function sendData(data){
    websocket.send(JSON.stringify(data))
    textbox.innerHTML += 'Alice----sent SDP to------>Server\n'
};

init()
