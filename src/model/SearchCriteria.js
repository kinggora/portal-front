export default class SearchCriteria {
  boardId;
  boardType;
  categoryId;
  searchWord;
  startDate;
  endDate;
  page;

  constructor(object) {
    this.boardId = object.boardId;
    this.page = object.page ? object.page : 1;
    this.boardType = object.boardType;
    this.categoryId = object.categoryId
      ? parseInt(object.categoryId)
      : object.categoryId;
    this.searchWord = object.searchWord;
    this.startDate = object.startDate;
    this.endDate = object.endDate;
  }

  setBoardType(boardType) {
    this.boardType = boardType;
  }

  setBoardId(boardId) {
    this.boardId = boardId;
  }

  setPage(page) {
    this.page = page;
  }

  setSearchEvent(input) {
    this.page = 1;
    this.categoryId = input.categoryId;
    if (input.searchWord) {
      this.searchWord = input.searchWord.trim();
    }
    this.startDate = input.startDate;
    this.endDate = input.endDate;
  }

  getRequestParam() {
    let criteria = {};
    criteria.boardType = this.boardType;
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
    if (this.page) {
      criteria.page = this.page;
    } else {
      criteria.page = 1;
    }
    return criteria;
  }

  getQueryParam() {
    return {
      boardId: this.boardId,
      ...this.getRequestParam(),
    };
  }
}
