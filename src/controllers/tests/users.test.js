const { login } = require("../users");
const { User } = require("../../models/users");

describe("Login controller test", () => {
  it("login with right email and password", async () => {
    const req = { body: { email: "vlad@gmail.com", password: "vlad" } };
    const next = jest.fn();
    const json = jest.fn();
    const res = { json };

    jest.spyOn(User, "findOne").mockImplementation(() => ({
      email: "vlad@gmail.com",
      password: "$2b$10$EijGJxWnLTvw9Zk3ZPZ/kuF5Qber2EXWSLBpYuVj93v9x00I2S2y6",
      subscription: "business",
      _id: "622b8c408477b7ede3f44da2",
    }));
    jest.spyOn(User, "findOneAndUpdate").mockImplementation(() => null);

    await login(req, res, next);

    const resBody = json.mock.calls[0][0];

    expect(resBody.user).toEqual({
      email: "vlad@gmail.com",
      subscription: "business",
    });
  });
});
