const { Comment, Reply, Advice } = require("../models"); //모델 데이터를 가져오고
const { Op } = require("sequelize");
const Report = require("../schemas/report");

class CommentRepository {
  //신고 가능 게시글이 늘어날 때마다 최상단이랑 이곳에 모델을 추가해 주면 된다.
  Comment = new Comment();
  Reply = new Reply();
  Advice = new Advice();

  author = async (targetId, targetName) => {
    let TargetName = targetName.replace(/^[a-z]/, (char) => char.toUpperCase());
    const data = await eval(TargetName).findByPk(eval(targetId));
    return data;
  };

  redup = async (reporterId, suspectId, targetId, targetName) => {
    const data = {
      reporterId: Number(reporterId),
      suspectId: Number(suspectId),
      targetId: Number(targetId),
      targetName: targetName,
    };
    const result = await Report.find({
      ids: data,
    });

    return result;
  };

  report = async (reporterId, suspectId, targetId, targetName, why, target) => {
    const date = new Date();
    const reportId = date.valueOf();
    const createdAt = date;
    const updatedAt = date;

    const result = await Report.create({
      reportId,
      ids: {
        reporterId: Number(reporterId),
        suspectId: Number(suspectId),
        targetId: Number(targetId),
        targetName: targetName,
      },
      why,
      content: target.dataValues,
      createdAt,
      updatedAt,
    });
    return result;
  };
}

module.exports = CommentRepository;
