import React from 'react'
import {Button} from 'react-bootstrap'

class User extends React.Component {
   render() {
      return (
         <div>
            <h3>Personalized User Dashboard</h3>

            <Button color="success" href="/chat">Talk to other players</Button>
         </div>
      )
   }
}

export default User
