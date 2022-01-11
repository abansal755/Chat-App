# Models

User

    username: string
    password: string
    requests: array of object ids of users

Friendship

    user1: object id of user1
    user2: object id of user2

Message

    sender: object id of user
    timestamp: date
    text: string

DirectMessage

    user1: object id of user1
    user2: object id of user2
    messages: array of object ids of messages

Room

    users: array of object id of users
    messages: array of object ids of messages
    title: string
    admin: object id of user

# Routes

GET | /api/users | get user info
--- | --- | ---
POST | /api/users | register new user
POST | /api/users/login | login
POST | /api/users/logout | logout
GET | /api/friends | get friends info
GET | /api/requests	| get requests info
POST | /api/requests | send a request to user with username
POST | /api/requests/:id/respond | respond to a request sent by user with id
GET | /api/directmessages | get dms info
POST | /api/directmessages | create a dm
GET | /api/directmessages/:id | get all messages of a specific dm
POST | /api/directmessages/:id | sends a message to a specific dm
GET | /api/rooms | get rooms info
POST | /api/rooms | create a room
GET | /api/rooms/:id | get room info
GET | /api/rooms/:id/messages | get all messages of a specific room
POST | /api/rooms/:id/messages | sends a message to a specific room
PATCH | /api/rooms/:id/users | add users