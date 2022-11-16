const ChoiceService = require("../services/choice.service");

class ChoiceController {
  choiceService = new ChoiceService();

  createchoice = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }
      const { title, choice1Name, choice2Name, endTime } = req.body;

      if (!title || !choice1Name || !choice2Name || !endTime) {
        res.status(400).send({ errorMessage: "입력 내용을 확인해 주십시오" });
        return;
      }
      const createchoice = await this.choiceService.createchoice(
        userKey,
        title,
        choice1Name,
        choice2Name,
        endTime
      );
      res
        .status(201)
        .send({ message: "투표 등록이 완료되었습니다.", data: createchoice });
    } catch (err) {
      next(err);
    }
  };

  //모든 게시글 조회(1~10)
  allchoice = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      const { page } = req.query;
      const allchoice = await this.choiceService.findAllchoice(userKey);

      const low = page * 10;
      const high = low + 9;

      let choice = new Array();
      let a = 0;
      for (let i = low; i <= high; i++) {
        if (allchoice[i] == null) {
          break;
        }
        end[a] = allchoice[i];
        a++;
      }
      a = 0;

      res.status(200).json({ choice });
    } catch (err) {
      next(err);
    }
  };

  //마이페이지 게시글 조회
  mychoice = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }
      const mychoice = await this.choiceService.findMychoice(userKey);
      res.status(200).json({ data: mychoice });
    } catch (err) {
      next(err);
    }
  };

  deletechoice = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      const { choiceId } = req.params;
      if (!choiceId) throw new Error("없는 게시글 입니다.");
      if (userKey == 0) {
        return res.status(400).send({ message: "권한이 없습니다." });
      }
      const deletechoice = await this.choiceService.deletechoice(
        userKey,
        choiceId
      );

      let msg;
      if (deletechoice) {
        msg = "삭제 성공";
      } else {
        res.status(400).json({ message: "없는 데이터 입니다." });
      }
      res.status(200).json({ data: msg });
    } catch (err) {
      next(err);
    }
  };

  choice = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }
      const { choiceId } = req.params;
      const { choiceNum } = req.body;
      let choice;
      if (!choiceId) throw new Error("없는 게시글 입니다.");
      if (choiceNum === 1 || choiceNum === 2) {
        choice = await this.choiceService.choice(userKey, choiceId, choiceNum);
      } else {
        throw new Error("잘못된 접근 입니다.");
      }

      if (choice.count) {
        res
          .status(200)
          .json({ message: choiceNum + "번에 투표 성공", data: choice });
      } else {
        res.status(200).json({ message: "투표 취소", data: choice });
      }
      return choice;
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ChoiceController;
