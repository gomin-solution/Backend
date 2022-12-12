const SocketIO = require("socket.io");
const { Note, NoteRoom, User } = require("./models");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
const UserController = require("./controllers/user.controller");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

module.exports = (server) => {
  // 서버 연결, path는 프론트와 일치시켜준다.
  const io = SocketIO(server, { path: "/socket.io" });

  //* 웹소켓 연결 시
  io.on("connection", (socket) => {
    const req = socket.request; // 웹소켓과는 달리 req객체를 따로 뽑아야함

    //* ip 정보 얻기
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("새로운 클라이언트 접속!", ip, socket.id, req.ip);
    // socket.id 는 소켓 연결된 고유한 클라이언트 식별자라고 보면된다. 채팅방의 입장한 고유한 사람

    //* 연결 종료 시
    socket.on("disconnect", () => {
      clearInterval(socket.interval);
    });

    //* 에러 시
    socket.on("error", (error) => {
      console.error(error);
    });

    //메인페이지 연결시
    socket.on("main_connect", (userKey) => {
      socket.join(userKey);
    });

    //* 룸 입장
    socket.on("enter_room", (data) => {
      socket.join(data.roomId);
      RoomId = data.roomId;
    });

    //룸 떠나기
    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
    });

    /**메세지 저장후 전달 */
    socket.on("chat_message", async (data) => {
      let { note, roomId, userKey } = data;

      const date = dayjs().tz().format("YYYY/MM/DD HH:mm");
      // const chatTime = new Date(today).setHours(new Date(today).getHours() - 9);

      //DB에 메세지 저장
      await Note.create({
        roomId: roomId,
        userKey: userKey,
        note: note,
      });
      const findRoom = await NoteRoom.findByPk(roomId);
      let sendUser;
      findRoom.user1 == userKey
        ? (sendUser = findRoom.user2)
        : (sendUser = findRoom.user1);
      const msg = {
        userKey: userKey,
        note: note,
        date: date,
      };
      const sendUserData = await User.findOne({
        where: { userKey: sendUser },
        attributes: ["deviceToken"],
      });
      io.to(roomId).emit("message", msg);

      const message = {
        token: sendUserData.deviceToken,
        data: {
          title: "고민접기",
          body: "쪽지가 도착했습니다!",
          link: `rooms/${roomId}`,
        },
      };

      admin
        .messaging()
        .send(message)
        .catch(function (error) {
          console.trace(error);
        });
    });
  });
};
