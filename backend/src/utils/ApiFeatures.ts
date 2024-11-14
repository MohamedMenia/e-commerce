class ApiFeatures {
  public query: any;
  public queryStr: any;
  constructor(query: any, queryStr: any) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter(): this {
    let queryString = JSON.stringify(this.queryStr);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let queryOBJ: any;
    try {
      queryOBJ = JSON.parse(queryString);
    } catch (error) {
      throw new Error("Invalid query string");
    }

    const excludeFields = ["sort", "limit", "page"];
    excludeFields.forEach((field) => delete queryOBJ[field]);
    if (this.queryStr.category) {
      queryOBJ.category = { $in: this.queryStr.category };
    }

    this.query = this.query.find(queryOBJ);
    return this;
  }

  sort(): this {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate(): this {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  getTotalPages(): Promise<number> {
    const limit = this.queryStr.limit * 1 || 10;
    return this.query.model
      .countDocuments(this.query.getQuery())
      .then((totalDocuments: number) => Math.ceil(totalDocuments / limit));
  }

  search(): this {
    if (this.queryStr.keyword) {
      this.query = this.query.find({
        $text: { $search: this.queryStr.keyword },
      });
    }
    return this;
  }
}

export default ApiFeatures;
