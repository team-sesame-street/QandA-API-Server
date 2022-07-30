const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;

describe("GET request to answers", () => {
  let error, response;

  before(function(done) {
    request.get("/qa/questions/777/answers").end((err, res) => {
      error = err, response = res;
      done();
    })
  })

  it('returns a status code of 200', () => {
    expect(response.status).to.eql(200);

  });
  it('returns answers for the question in the path', () => {
    expect(response.body.question).to.eql('777');

  })
  it('returns results array of answers', () => {
    expect(response.body.results).to.exist;
  })
});

describe("GET request to questions", () => {
  let error, response;

  before(function(done) {
    request.get("/qa/questions/?product_id=777").end((err, res) => {
      error = err, response = res;
      done();
    })
  })

  it('returns a status code of 200', () => {
    expect(response.status).to.eql(200);

  });
  it('returns questions for the queried product id', () => {
    expect(response.body.product_id).to.eql('777');

  })
  it('returns results array of questions', () => {
    expect(response.body.results).to.exist;
  })
});

describe("POST request to questions", () => {
  let error, response;
  let body = {
    "body": 'test statement',
    "name": 'askertestname',
    "email": 'askeremail@test.com',
    "product_id": 778
  }
  before(function(done) {
    request.post("/qa/questions/?product_id=777").send(body).end((err, res) => {
      error = err, response = res;
      done();
    })
  })

  it('returns a status code of 201', () => {
    expect(response.status).to.eql(201);

  });
});

describe("POST request to answers", () => {
  let error, response;
  let body = {
    "body": 'test answer',
    "name": 'answerertestname',
    "email": 'answereremail@test.com',
    "photos": ['url1', 'url2', 'url3']
  }
  before(function(done) {
    request.post("/qa/questions/3518968/answers").send(body).end((err, res) => {
      error = err, response = res;
      done();
    })
  })

  it('returns a status code of 201', () => {
    expect(response.status).to.eql(201);
  });
});

describe("PUT request for helpful question", () => {
  let error, response;
  before(function(done) {
    request.put("/qa/questions/3518968/helpful").end((err, res) => {
      error = err, response = res;
      done();
    })
  })
  it('returns a status code of 204', () => {
    expect(response.status).to.eql(204);
  });
})

describe("PUT request for report question", () => {
  let error, response;
  before(function(done) {
    request.put("/qa/questions/3518968/report").end((err, res) => {
      error = err, response = res;
      done();
    })
  })
  it('returns a status code of 204', () => {
    expect(response.status).to.eql(204);
  });
})

describe("PUT request for helpful answer", () => {
  let error, response;
  before(function(done) {
    request.put("/qa/answers/6879308/helpful").end((err, res) => {
      error = err, response = res;
      done();
    })
  })
  it('returns a status code of 204', () => {
    expect(response.status).to.eql(204);
  });
})

describe("PUT request for report answer", () => {
  let error, response;
  before(function(done) {
    request.put("/qa/answers/6879308/report").end((err, res) => {
      error = err, response = res;
      done();
    })
  })
  it('returns a status code of 204', () => {
    expect(response.status).to.eql(204);
  });
})