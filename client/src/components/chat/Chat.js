import React, { Component } from "react";

  class Chat extends Component {
    render() {
      return (
        <div>
          <ul id="messages"></ul>
          <form action="">
              <input id="m" autoComplete="off" /><button>Send</button>
          </form>
        </div>
      );
    }
  }

  export default Chat;

// import React from "react";

// export default function NotFound() {
//   return (
//     <div>
//       <h1 className="display-4">Page Not Found</h1>
//       <p>Sorry, this page does not exist</p>
//     </div>
//   );
// }