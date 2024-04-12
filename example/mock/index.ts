import { Mock, delay } from "../../lib/index";

const mock = new Mock();

mock.get(
  "/api/test",
  (req) => {
    return {
      code: 0,
      query: req.query,
      data: {},
    };
  },
  {
    headers: {
      "custom-type": "~o_o~",
    },
  }
);

mock.post("/api/user/info", (req, res) => {
  res.setHeader("custom-type", "~~~o_o~~~");
  return {
    code: 0,
    body: req.body,
    data: {},
  };
});

mock.post("/api/form/data", (req) => {
  return {
    code: 0,
    body: req.body,
    data: {},
  };
});

mock.get("/api/ignore/test", () => {
  return {
    code: 0,
    data: {
      name: "ignore",
    },
  };
});

mock.post(
  "/api/disabled",
  () => {
    return {
      code: 0,
      data: {
        name: "disabled",
      },
    };
  },
  {
    disabled: true,
  }
);

mock.post("/oapi/oi", (req) => {
  return {
    code: 0,
    body: req.body,
    data: {
      name: "oapi",
    },
  };
});

mock.post("/napi/ni", (req) => {
  return {
    code: 0,
    body: req.body,
    data: {
      name: "oapi",
    },
  };
});

mock.post(
  "/api/timout",
  async () => {
    await delay(1000);
    return {
      code: 0,
      data: {
        name: "timout",
      },
    };
  },
  {
    timeout: 500,
  }
);

export default mock;
