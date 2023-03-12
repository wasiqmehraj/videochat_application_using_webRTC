Description:

This Github repository contains code that implements a video chat application using the WebRTC API. Unlike traditional WebRTC applications, this implementation does not require a signaling server. Instead, users need to manually copy the generated offer from Alice to Bob to establish the connection.

The video chat application uses WebRTC's peer-to-peer communication capabilities to establish a direct connection between two clients. The application is built using JavaScript and uses the WebRTC API to manage the video chat session.

To use the video chat application, users need to disable all firewalls on their devices before establishing the connection. Once the firewalls are disabled, users can initiate the video chat session by generating an offer on Alice's end. The offer is then copied and sent to Bob, who uses it to generate an answer. This process establishes the peer-to-peer connection, allowing for real-time video communication between the two users.

The code in this repository is well-documented and organized, making it easy to understand and modify. It can be customized to meet specific requirements and integrated into existing web applications.

Overall, this repository provides a powerful and flexible solution for implementing a WebRTC-based video chat application that does not require a signaling server. 
