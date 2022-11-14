const JsonWebTokenError = require("jsonwebtoken/lib/JsonWebTokenError");
const authMiddleware = require("../middlewares/authMiddleware");

describe('미들웨어',()=>{

    const res = {
        status:jest.fn(()=>res),
        send:jest.fn()
    }
    const next = jest.fn()

    test("토큰타입이 Bearer가 아닌경우 에러 메세지 응답",() =>{
        const req = {
            headers: {authorization:"Bearer undefined" ,refreshtoken:"token"}
        }
    })
})