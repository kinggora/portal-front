export default class SearchCriteria {
  //page;
  boardId;
  categoryId;
  searchWord;
  startDate;
  endDate;

  constructor(object) {
    //this.page = query.page;
    this.categoryId = object.categoryId
      ? parseInt(object.categoryId)
      : object.categoryId;
    this.searchWord = object.searchWord;
    this.startDate = object.startDate;
    this.endDate = object.endDate;
  }

  // setPage(page) {
  //   this.page = page;
  // }

  setBoardId(boardId) {
    this.boardId = boardId;
  }

  getRequestParam() {
    let criteria = {};
    // if (this.page) {
    //   criteria.page = this.page;
    // }
    if (this.boardId) {
      criteria.boardId = this.boardId;
    }
    if (this.categoryId) {
      criteria.categoryId = this.categoryId;
    }
    if (this.searchWord) {
      criteria.searchWord = this.searchWord;
    }
    if (this.startDate) {
      criteria.startDate = this.startDate;
    }
    if (this.endDate) {
      criteria.endDate = this.endDate;
    }
    return criteria;
  }
}
