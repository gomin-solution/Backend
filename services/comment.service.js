const CommentRepository = require("../repositories/comment.repository"); //리포지토리의 내용을 가져와야한다.

class CommentService {
  commentRepository = new CommentRepository();

  //덧글 달기
  createComment = async (userKey, adviceId, comment) => {
    const createComment = await this.commentRepository.createComment(
      userKey,
      adviceId,
      comment
    );
    return createComment;
  };

  //덧글 수정하기
  updateComment = async (userKey, commentId, comment) => {
    const createComment = await this.commentRepository.updateComment(
      userKey,
      commentId,
      comment
    );
    return createComment;
  };

  //덧글 삭제하기
  deleteComment = async (commentId, userKey) => {
    const createComment = await this.commentRepository.deleteComment(
      commentId,
      userKey
    );
    return createComment;
  };

  //덧글 좋아요 또는 취소
  updateCommentLike = async (userKey, commentId) => {
    const dup = await this.commentRepository.reportCommentAuthor(commentId);

    if (dup === userKey) return -1;

    const isCommentLike = await this.commentRepository.isCommentLike(
      userKey,
      commentId
    );
    if (isCommentLike) {
      const cancel = await this.commentRepository.cancelCommentLike(
        userKey,
        commentId
      );
      return cancel;
    } else {
      const like = await this.commentRepository.createCommentLike(
        userKey,
        commentId
      );
      return like;
    }
  };

  //덧글 좋아요 갯수
  countComment = async (commentId) => {
    const count = await this.commentRepository.countComment(commentId);
    return count;
  };

  //덧글 신고하기
  reportComment = async (userKey, commentId, why) => {
    //코멘트 아이디를 기반으로 작성자 아이디를 가져오고
    //신고자 ID, 작성자 ID, 신고게시글유형(덧글인지 뭔지), 신고 대상 ID를 저장
    let type = "comment";
    const author = await this.commentRepository.reportCommentAuthor(commentId);
    if (author === userKey) {
      return;
    }

    //중복 확인
    const redup = await this.commentRepository.reportRedup(
      userKey,
      author,
      commentId,
      type
    );

    if (redup[0]) {
      const dupmes = false;
      return dupmes;
    }

    //신고 됌
    const report = await this.commentRepository.reportComment(
      userKey,
      author,
      commentId,
      type,
      why
    );

    return report;
  };

  //대댓글 기능
  reComment = async (userKey, commentId, re, route) => {
    //해당commentId와 route를 가진 대댓글 데이터를 가져오자
    const reInfo = await this.commentRepository.infoReply(commentId, route);

    //대댓글이 아예 없는 경우
    if (!reInfo) {
      route = "[0]";
      let count = 1;
      const fin = await this.commentRepository.createReply(
        userKey,
        commentId,
        route,
        count,
        re
      );
      return fin;
    }
    if (!route) {
      console.log(reInfo);
      let temp = reInfo.length;
      route = "[" + temp + "]";
      let count = 1;
      const fin = await this.commentRepository.createReply(
        userKey,
        commentId,
        route,
        count,
        re
      );
      return fin;
    }

    //대댓글이 꼬리를 물고 계속 생겨야하는 경우, 아래의 코드를 실행한다.
    //스트링으로 가져온 route를 배열로 변환하자
    let route_Array = JSON.parse(route); //입력한 값
    //그렇게 변환된 배열의 길이를 따로 저장한다.
    //이때, 만약 route가 null이면 length는 0 으로 한다.
    let leng = route ? route_Array.length : 0; //입력한 값의 길이
    let targetLength = leng + 1;
    //그리고 leng와 동일한 길이를 가진 데이터를 리포로부터 가져온다.
    //단, 리포에 저장된건 배열 형태를한 스트링이다.
    let target = await this.commentRepository.replyByLength(
      commentId,
      targetLength
    );

    //그래서, 그렇게 가져온 데이터를 나열했을 때,
    //각 배열들을 for문을 돌려서 검증하자
    let array = new Array();
    let result = new Array();
    if (route_Array) {
      for (let k = 0; k < target.length; k++) {
        let a = JSON.parse(target[k].route);
        for (let i = 0; i < route_Array.length; i++) {
          if (route_Array[i] === a[i]) {
            array.push(a[i]);
          } else {
            array = [];
            continue;
          }
        }
        if (array[0] || array[0] === 0) {
          result.push(array);
        }
        array = [];
      }
    }

    //자, 그렇게 완성된 배열의 마지막 값을 가져오자.
    //그리고 그 값에 +1을 한 것이, 이번에 새로 완성된 마지막 배열의 숫자다.
    //let temp = new Array();

    if (route_Array) {
      route_Array.push(result.length);
    } else {
      const topReply = await this.commentRepository.topReply(commentId);

      route_Array = [topReply.length];
    }

    let data = JSON.stringify(route_Array);
    //자, 그 배열을 택스트로 변환하고
    //리플을 새로 만든다.
    //참고로 카운트에 들어갈 값도 만든다.
    let newCount = route_Array.length;

    const newReply = await this.commentRepository.createReply(
      userKey,
      commentId,
      data,
      newCount,
      re
    );

    return newReply;
  };

  getReComment = async (commentId) => {
    const data = await this.commentRepository.getReComment(commentId);

    for (let i = 0; i < data.length; i++) {
      data[i].route = JSON.parse(data[i].route);
    }

    data.sort(function compare(a, b) {
      if (a.route > b.route) return 1;
      else if (a.route < b.route) return -1;
      else return 0;
    });

    let final = data.sort();

    return final;
  };

  putRe = async (replyId, userKey, re) => {
    const check = await this.commentRepository.checkRe(replyId);
    if (check.comment === "삭제된 덧글입니다.") {
      return;
    }
    const data = await this.commentRepository.putRe(replyId, userKey, re);
    return data;
  };

  deleteRe = async (replyId, userKey) => {
    const check = await this.commentRepository.checkRe(replyId);
    if (check.comment === "삭제된 덧글입니다.") {
      return;
    }
    const data = await this.commentRepository.deleteRe(replyId, userKey);
    return data;
  };
}

module.exports = CommentService;
