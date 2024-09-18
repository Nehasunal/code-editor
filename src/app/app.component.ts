import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'code-editor-fe';
  private socket: any;
  code: string = '';  // This will hold the code in the editor
  roomName: string = '';  // Holds the room name
  roomJoined: boolean = false;  // Tracks if the room has been joined

  ngOnInit(): void {
    // Connect to the Socket.IO server
    this.socket = io('http://localhost:9000');

    // Listen for real-time code changes
    this.socket.on('codeChange', (codeUpdate: string) => {
      console.log('Code updated:', codeUpdate);
      this.code = codeUpdate;  // Update the code in the editor
    });

    // Listen for room join confirmation
    this.socket.on('joinedRoom', (room: string) => {
      console.log(`Joined room: ${room}`);
      this.roomJoined = true;  // Set the flag to true to show the editor
    });
  }

  // Emit code changes when the user types
  onCodeChange(event: any) {
    this.code = event.target.value;
    if (this.roomName) {
      this.socket.emit('codeChange', { room: this.roomName, codeUpdate: this.code });
    }
  }

  // Handle joining a room
  joinRoom() {
    if (this.roomName) {
      this.socket.emit('joinRoom', this.roomName);
    }
  }
}
