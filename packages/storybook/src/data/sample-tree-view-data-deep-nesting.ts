import type { TraceSpan } from "@evilmartians/agent-prism-types";

export const sampleTreeViewDataDeepNesting: TraceSpan[] = [
  {
    id: "1",
    title: "main",
    startTime: new Date("2023-01-01T00:00:00Z"),
    endTime: new Date("2023-01-01T00:06:12Z"),
    tokenUsage: { total: { tokens: 1000, cost: 1234 } },
    type: "chain_operation",
    raw: [
      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
    ],
    attributes: [
      {
        key: "llm.prompt_template.template",
        value: { stringValue: "Create a summary based on: {summary}" },
      },
      {
        key: "llm.prompt_template.variables",
        value: { stringValue: "summary,style,length" },
      },
      { key: "template.tokens", value: { intValue: "25" } },
      { key: "output.format", value: { stringValue: "markdown" } },
      { key: "quality.check", value: { boolValue: true } },
    ],
    status: "success",
    children: [
      {
        id: "1-1",
        title: "ChatCompletions",
        startTime: new Date("2023-01-01T00:00:10Z"),
        endTime: new Date("2023-01-01T00:05:00Z"),
        tokenUsage: { total: { tokens: 500, cost: 150 } },
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        attributes: [
          {
            key: "llm.prompt_template.template",
            value: { stringValue: "Create a summary based on: {summary}" },
          },
          {
            key: "llm.prompt_template.variables",
            value: { stringValue: "summary,style,length" },
          },
          { key: "template.tokens", value: { intValue: "25" } },
          { key: "output.format", value: { stringValue: "markdown" } },
          { key: "quality.check", value: { boolValue: true } },
        ],
        type: "llm_call",
        status: "success",
        children: [
          {
            id: "1-1-1",
            title: "ChatCompletion",
            startTime: new Date("2023-01-01T00:00:15Z"),
            endTime: new Date("2023-01-01T00:00:45Z"),
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            attributes: [
              {
                key: "llm.prompt_template.template",
                value: { stringValue: "Create a summary based on: {summary}" },
              },
              {
                key: "llm.prompt_template.variables",
                value: { stringValue: "summary,style,length" },
              },
              { key: "template.tokens", value: { intValue: "25" } },
              { key: "output.format", value: { stringValue: "markdown" } },
              { key: "quality.check", value: { boolValue: true } },
            ],
            tokenUsage: { total: { tokens: 250, cost: 75 } },
            status: "pending",
            type: "llm_call",
            children: [
              {
                id: "1-1-1-1",
                title: "ChatCompletion",
                startTime: new Date("2023-01-01T00:00:16Z"),
                endTime: new Date("2023-01-01T00:00:30Z"),
                tokenUsage: { total: { tokens: 125, cost: 37 } },
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                attributes: [
                  {
                    key: "llm.prompt_template.template",
                    value: {
                      stringValue: "Create a summary based on: {summary}",
                    },
                  },
                  {
                    key: "llm.prompt_template.variables",
                    value: { stringValue: "summary,style,length" },
                  },
                  { key: "template.tokens", value: { intValue: "25" } },
                  { key: "output.format", value: { stringValue: "markdown" } },
                  { key: "quality.check", value: { boolValue: true } },
                ],
                status: "success",
                type: "llm_call",
                children: [
                  {
                    id: "1-1-1-1-1",
                    title: "ChatCompletion",
                    startTime: new Date("2023-01-01T00:00:17Z"),
                    endTime: new Date("2023-01-01T00:00:25Z"),
                    tokenUsage: { total: { tokens: 62, cost: 18 } },
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    attributes: [
                      {
                        key: "llm.prompt_template.template",
                        value: {
                          stringValue: "Create a summary based on: {summary}",
                        },
                      },
                      {
                        key: "llm.prompt_template.variables",
                        value: { stringValue: "summary,style,length" },
                      },
                      { key: "template.tokens", value: { intValue: "25" } },
                      {
                        key: "output.format",
                        value: { stringValue: "markdown" },
                      },
                      { key: "quality.check", value: { boolValue: true } },
                    ],
                    status: "success",
                    type: "llm_call",
                    children: [
                      {
                        id: "1-1-1-1-1-1",
                        title: "ChatCompletion",
                        startTime: new Date("2023-01-01T00:00:18Z"),
                        endTime: new Date("2023-01-01T00:00:22Z"),
                        tokenUsage: { total: { tokens: 31, cost: 9 } },
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        attributes: [
                          {
                            key: "llm.prompt_template.template",
                            value: {
                              stringValue:
                                "Create a summary based on: {summary}",
                            },
                          },
                          {
                            key: "llm.prompt_template.variables",
                            value: { stringValue: "summary,style,length" },
                          },
                          { key: "template.tokens", value: { intValue: "25" } },
                          {
                            key: "output.format",
                            value: { stringValue: "markdown" },
                          },
                          { key: "quality.check", value: { boolValue: true } },
                        ],
                        status: "success",
                        type: "llm_call",
                        children: [
                          {
                            id: "1-1-1-1-1-1-1",
                            title: "ChatCompletion",
                            startTime: new Date("2023-01-01T00:00:19Z"),
                            endTime: new Date("2023-01-01T00:00:21Z"),
                            tokenUsage: { total: { tokens: 15, cost: 4 } },
                            raw: [
                              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                            ],
                            attributes: [
                              {
                                key: "llm.prompt_template.template",
                                value: {
                                  stringValue:
                                    "Create a summary based on: {summary}",
                                },
                              },
                              {
                                key: "llm.prompt_template.variables",
                                value: { stringValue: "summary,style,length" },
                              },
                              {
                                key: "template.tokens",
                                value: { intValue: "25" },
                              },
                              {
                                key: "output.format",
                                value: { stringValue: "markdown" },
                              },
                              {
                                key: "quality.check",
                                value: { boolValue: true },
                              },
                            ],
                            status: "success",
                            type: "llm_call",
                            children: [
                              {
                                id: "1-1-1-1-1-1-1-1",
                                title: "ChatCompletion",
                                startTime: new Date("2023-01-01T00:00:19Z"),
                                endTime: new Date("2023-01-01T00:00:21Z"),
                                tokenUsage: { total: { tokens: 15, cost: 4 } },
                                raw: [
                                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                ],
                                attributes: [
                                  {
                                    key: "llm.prompt_template.template",
                                    value: {
                                      stringValue:
                                        "Create a summary based on: {summary}",
                                    },
                                  },
                                  {
                                    key: "llm.prompt_template.variables",
                                    value: {
                                      stringValue: "summary,style,length",
                                    },
                                  },
                                  {
                                    key: "template.tokens",
                                    value: { intValue: "25" },
                                  },
                                  {
                                    key: "output.format",
                                    value: { stringValue: "markdown" },
                                  },
                                  {
                                    key: "quality.check",
                                    value: { boolValue: true },
                                  },
                                ],
                                status: "success",
                                type: "llm_call",
                                children: [
                                  {
                                    id: "1-1-1-1-1-1-1-1-1",
                                    title: "ChatCompletion",
                                    startTime: new Date("2023-01-01T00:00:19Z"),
                                    endTime: new Date("2023-01-01T00:00:21Z"),
                                    raw: [
                                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                    ],
                                    attributes: [
                                      {
                                        key: "llm.prompt_template.template",
                                        value: {
                                          stringValue:
                                            "Create a summary based on: {summary}",
                                        },
                                      },
                                      {
                                        key: "llm.prompt_template.variables",
                                        value: {
                                          stringValue: "summary,style,length",
                                        },
                                      },
                                      {
                                        key: "template.tokens",
                                        value: { intValue: "25" },
                                      },
                                      {
                                        key: "output.format",
                                        value: { stringValue: "markdown" },
                                      },
                                      {
                                        key: "quality.check",
                                        value: { boolValue: true },
                                      },
                                    ],
                                    tokenUsage: {
                                      total: { tokens: 15, cost: 4 },
                                    },
                                    status: "success",
                                    type: "llm_call",
                                    children: [
                                      {
                                        id: "1-1-1-1-1-1-1-1-1-1",
                                        title: "ChatCompletion",
                                        startTime: new Date(
                                          "2023-01-01T00:00:19Z",
                                        ),
                                        endTime: new Date(
                                          "2023-01-01T00:00:21Z",
                                        ),
                                        tokenUsage: {
                                          total: { tokens: 15, cost: 4 },
                                        },
                                        raw: [
                                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                        ],
                                        attributes: [
                                          {
                                            key: "llm.prompt_template.template",
                                            value: {
                                              stringValue:
                                                "Create a summary based on: {summary}",
                                            },
                                          },
                                          {
                                            key: "llm.prompt_template.variables",
                                            value: {
                                              stringValue:
                                                "summary,style,length",
                                            },
                                          },
                                          {
                                            key: "template.tokens",
                                            value: { intValue: "25" },
                                          },
                                          {
                                            key: "output.format",
                                            value: { stringValue: "markdown" },
                                          },
                                          {
                                            key: "quality.check",
                                            value: { boolValue: true },
                                          },
                                        ],
                                        status: "success",
                                        type: "llm_call",
                                        children: [
                                          {
                                            id: "1-1-1-1-1-1-1-1-1-1-1",
                                            title: "ChatCompletion",
                                            startTime: new Date(
                                              "2023-01-01T00:00:19Z",
                                            ),
                                            endTime: new Date(
                                              "2023-01-01T00:00:21Z",
                                            ),
                                            tokenUsage: {
                                              total: { tokens: 15, cost: 4 },
                                            },
                                            raw: [
                                              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                            ],
                                            attributes: [
                                              {
                                                key: "llm.prompt_template.template",
                                                value: {
                                                  stringValue:
                                                    "Create a summary based on: {summary}",
                                                },
                                              },
                                              {
                                                key: "llm.prompt_template.variables",
                                                value: {
                                                  stringValue:
                                                    "summary,style,length",
                                                },
                                              },
                                              {
                                                key: "template.tokens",
                                                value: { intValue: "25" },
                                              },
                                              {
                                                key: "output.format",
                                                value: {
                                                  stringValue: "markdown",
                                                },
                                              },
                                              {
                                                key: "quality.check",
                                                value: { boolValue: true },
                                              },
                                            ],
                                            status: "success",
                                            type: "llm_call",
                                            children: [
                                              {
                                                id: "1-1-1-1-1-1-1-1-1-1-1-1",
                                                title: "ChatCompletion",
                                                startTime: new Date(
                                                  "2023-01-01T00:00:19Z",
                                                ),
                                                endTime: new Date(
                                                  "2023-01-01T00:00:21Z",
                                                ),
                                                tokenUsage: {
                                                  total: {
                                                    tokens: 15,
                                                    cost: 4,
                                                  },
                                                },
                                                raw: [
                                                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                                ],
                                                attributes: [
                                                  {
                                                    key: "llm.prompt_template.template",
                                                    value: {
                                                      stringValue:
                                                        "Create a summary based on: {summary}",
                                                    },
                                                  },
                                                  {
                                                    key: "llm.prompt_template.variables",
                                                    value: {
                                                      stringValue:
                                                        "summary,style,length",
                                                    },
                                                  },
                                                  {
                                                    key: "template.tokens",
                                                    value: { intValue: "25" },
                                                  },
                                                  {
                                                    key: "output.format",
                                                    value: {
                                                      stringValue: "markdown",
                                                    },
                                                  },
                                                  {
                                                    key: "quality.check",
                                                    value: { boolValue: true },
                                                  },
                                                ],
                                                status: "success",
                                                type: "llm_call",
                                                children: [
                                                  {
                                                    id: "1-1-1-1-1-1-1-1-1-1-1-1-1",
                                                    title: "ChatCompletion",
                                                    startTime: new Date(
                                                      "2023-01-01T00:00:19Z",
                                                    ),
                                                    endTime: new Date(
                                                      "2023-01-01T00:00:21Z",
                                                    ),
                                                    tokenUsage: {
                                                      total: {
                                                        tokens: 15,
                                                        cost: 4,
                                                      },
                                                    },
                                                    raw: [
                                                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                                    ],
                                                    attributes: [
                                                      {
                                                        key: "llm.prompt_template.template",
                                                        value: {
                                                          stringValue:
                                                            "Create a summary based on: {summary}",
                                                        },
                                                      },
                                                      {
                                                        key: "llm.prompt_template.variables",
                                                        value: {
                                                          stringValue:
                                                            "summary,style,length",
                                                        },
                                                      },
                                                      {
                                                        key: "template.tokens",
                                                        value: {
                                                          intValue: "25",
                                                        },
                                                      },
                                                      {
                                                        key: "output.format",
                                                        value: {
                                                          stringValue:
                                                            "markdown",
                                                        },
                                                      },
                                                      {
                                                        key: "quality.check",
                                                        value: {
                                                          boolValue: true,
                                                        },
                                                      },
                                                    ],
                                                    status: "success",
                                                    type: "llm_call",
                                                    children: [
                                                      {
                                                        id: "1-1-1-1-1-1-1-1-1-1-1-1-1-1",
                                                        title: "ChatCompletion",
                                                        startTime: new Date(
                                                          "2023-01-01T00:00:19Z",
                                                        ),
                                                        endTime: new Date(
                                                          "2023-01-01T00:00:21Z",
                                                        ),
                                                        raw: [
                                                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                                        ],
                                                        attributes: [
                                                          {
                                                            key: "llm.prompt_template.template",
                                                            value: {
                                                              stringValue:
                                                                "Create a summary based on: {summary}",
                                                            },
                                                          },
                                                          {
                                                            key: "llm.prompt_template.variables",
                                                            value: {
                                                              stringValue:
                                                                "summary,style,length",
                                                            },
                                                          },
                                                          {
                                                            key: "template.tokens",
                                                            value: {
                                                              intValue: "25",
                                                            },
                                                          },
                                                          {
                                                            key: "output.format",
                                                            value: {
                                                              stringValue:
                                                                "markdown",
                                                            },
                                                          },
                                                          {
                                                            key: "quality.check",
                                                            value: {
                                                              boolValue: true,
                                                            },
                                                          },
                                                        ],
                                                        tokenUsage: {
                                                          total: {
                                                            tokens: 15,
                                                            cost: 4,
                                                          },
                                                        },
                                                        status: "success",
                                                        type: "llm_call",
                                                        children: [
                                                          {
                                                            id: "1-1-1-1-1-1-1-1-1-1-1-1-1-1-1",
                                                            title:
                                                              "ChatCompletion",
                                                            startTime: new Date(
                                                              "2023-01-01T00:00:19Z",
                                                            ),
                                                            endTime: new Date(
                                                              "2023-01-01T00:00:21Z",
                                                            ),
                                                            tokenUsage: {
                                                              total: {
                                                                tokens: 15,
                                                                cost: 4,
                                                              },
                                                            },
                                                            status: "success",
                                                            type: "llm_call",
                                                            raw: [
                                                              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                                            ],
                                                            attributes: [
                                                              {
                                                                key: "llm.prompt_template.template",
                                                                value: {
                                                                  stringValue:
                                                                    "Create a summary based on: {summary}",
                                                                },
                                                              },
                                                              {
                                                                key: "llm.prompt_template.variables",
                                                                value: {
                                                                  stringValue:
                                                                    "summary,style,length",
                                                                },
                                                              },
                                                              {
                                                                key: "template.tokens",
                                                                value: {
                                                                  intValue:
                                                                    "25",
                                                                },
                                                              },
                                                              {
                                                                key: "output.format",
                                                                value: {
                                                                  stringValue:
                                                                    "markdown",
                                                                },
                                                              },
                                                              {
                                                                key: "quality.check",
                                                                value: {
                                                                  boolValue: true,
                                                                },
                                                              },
                                                            ],
                                                            children: [
                                                              {
                                                                id: "1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1",
                                                                title:
                                                                  "ChatCompletion",
                                                                startTime:
                                                                  new Date(
                                                                    "2023-01-01T00:00:19Z",
                                                                  ),
                                                                endTime:
                                                                  new Date(
                                                                    "2023-01-01T00:00:21Z",
                                                                  ),
                                                                tokenUsage: {
                                                                  total: {
                                                                    tokens: 15,
                                                                    cost: 4,
                                                                  },
                                                                },
                                                                status:
                                                                  "success",
                                                                type: "llm_call",
                                                                children: [],
                                                                raw: [
                                                                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                                                ],
                                                                attributes: [
                                                                  {
                                                                    key: "llm.prompt_template.template",
                                                                    value: {
                                                                      stringValue:
                                                                        "Create a summary based on: {summary}",
                                                                    },
                                                                  },
                                                                  {
                                                                    key: "llm.prompt_template.variables",
                                                                    value: {
                                                                      stringValue:
                                                                        "summary,style,length",
                                                                    },
                                                                  },
                                                                  {
                                                                    key: "template.tokens",
                                                                    value: {
                                                                      intValue:
                                                                        "25",
                                                                    },
                                                                  },
                                                                  {
                                                                    key: "output.format",
                                                                    value: {
                                                                      stringValue:
                                                                        "markdown",
                                                                    },
                                                                  },
                                                                  {
                                                                    key: "quality.check",
                                                                    value: {
                                                                      boolValue: true,
                                                                    },
                                                                  },
                                                                ],
                                                              },
                                                            ],
                                                          },
                                                        ],
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "1-1-2",
            title: "ChatCompletion",
            startTime: new Date("2023-01-01T00:00:45Z"),
            endTime: new Date("2023-01-01T00:01:30Z"),
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            attributes: [
              {
                key: "llm.prompt_template.template",
                value: { stringValue: "Create a summary based on: {summary}" },
              },
              {
                key: "llm.prompt_template.variables",
                value: { stringValue: "summary,style,length" },
              },
              { key: "template.tokens", value: { intValue: "25" } },
              { key: "output.format", value: { stringValue: "markdown" } },
              { key: "quality.check", value: { boolValue: true } },
            ],
            tokenUsage: { total: { tokens: 250, cost: 75 } },
            status: "error",
            type: "llm_call",
            children: [
              {
                id: "1-1-2-1",
                title: "ChatCompletion",
                startTime: new Date("2023-01-01T00:00:46Z"),
                endTime: new Date("2023-01-01T00:01:00Z"),
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                attributes: [
                  {
                    key: "llm.prompt_template.template",
                    value: {
                      stringValue: "Create a summary based on: {summary}",
                    },
                  },
                  {
                    key: "llm.prompt_template.variables",
                    value: { stringValue: "summary,style,length" },
                  },
                  { key: "template.tokens", value: { intValue: "25" } },
                  { key: "output.format", value: { stringValue: "markdown" } },
                  { key: "quality.check", value: { boolValue: true } },
                ],
                tokenUsage: { total: { tokens: 125, cost: 37 } },
                status: "error",
                type: "llm_call",
                children: [
                  {
                    id: "1-1-2-1-1",
                    title: "ChatCompletion",
                    startTime: new Date("2023-01-01T00:00:47Z"),
                    endTime: new Date("2023-01-01T00:00:55Z"),
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    attributes: [
                      {
                        key: "llm.prompt_template.template",
                        value: {
                          stringValue: "Create a summary based on: {summary}",
                        },
                      },
                      {
                        key: "llm.prompt_template.variables",
                        value: { stringValue: "summary,style,length" },
                      },
                      { key: "template.tokens", value: { intValue: "25" } },
                      {
                        key: "output.format",
                        value: { stringValue: "markdown" },
                      },
                      { key: "quality.check", value: { boolValue: true } },
                    ],
                    tokenUsage: { total: { tokens: 62, cost: 18 } },
                    status: "error",
                    type: "llm_call",
                    children: [
                      {
                        id: "1-1-2-1-1-1",
                        title: "ChatCompletion",
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        attributes: [
                          {
                            key: "llm.prompt_template.template",
                            value: {
                              stringValue:
                                "Create a summary based on: {summary}",
                            },
                          },
                          {
                            key: "llm.prompt_template.variables",
                            value: { stringValue: "summary,style,length" },
                          },
                          { key: "template.tokens", value: { intValue: "25" } },
                          {
                            key: "output.format",
                            value: { stringValue: "markdown" },
                          },
                          { key: "quality.check", value: { boolValue: true } },
                        ],
                        startTime: new Date("2023-01-01T00:00:48Z"),
                        endTime: new Date("2023-01-01T00:00:52Z"),
                        tokenUsage: { total: { tokens: 31, cost: 9 } },
                        status: "error",
                        type: "llm_call",
                        children: [
                          {
                            id: "1-1-2-1-1-1-1",
                            title: "ChatCompletion",
                            raw: [
                              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                            ],
                            attributes: [
                              {
                                key: "llm.prompt_template.template",
                                value: {
                                  stringValue:
                                    "Create a summary based on: {summary}",
                                },
                              },
                              {
                                key: "llm.prompt_template.variables",
                                value: { stringValue: "summary,style,length" },
                              },
                              {
                                key: "template.tokens",
                                value: { intValue: "25" },
                              },
                              {
                                key: "output.format",
                                value: { stringValue: "markdown" },
                              },
                              {
                                key: "quality.check",
                                value: { boolValue: true },
                              },
                            ],
                            startTime: new Date("2023-01-01T00:00:49Z"),
                            endTime: new Date("2023-01-01T00:00:51Z"),
                            tokenUsage: { total: { tokens: 15, cost: 4 } },
                            status: "error",
                            type: "llm_call",
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "1-2",
        title: "RunnableSequence",
        startTime: new Date("2023-01-01T00:01:00Z"),
        endTime: new Date("2023-01-01T00:05:00Z"),
        tokenUsage: { total: { tokens: 200, cost: 80 } },
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        attributes: [
          {
            key: "llm.prompt_template.template",
            value: { stringValue: "Create a summary based on: {summary}" },
          },
          {
            key: "llm.prompt_template.variables",
            value: { stringValue: "summary,style,length" },
          },
          { key: "template.tokens", value: { intValue: "25" } },
          { key: "output.format", value: { stringValue: "markdown" } },
          { key: "quality.check", value: { boolValue: true } },
        ],
        status: "success",
        type: "chain_operation",
        children: [
          {
            id: "1-2-1",
            title: "RunnableSequence",
            startTime: new Date("2023-01-01T00:01:05Z"),
            endTime: new Date("2023-01-01T00:03:00Z"),
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            attributes: [
              {
                key: "llm.prompt_template.template",
                value: { stringValue: "Create a summary based on: {summary}" },
              },
              {
                key: "llm.prompt_template.variables",
                value: { stringValue: "summary,style,length" },
              },
              { key: "template.tokens", value: { intValue: "25" } },
              { key: "output.format", value: { stringValue: "markdown" } },
              { key: "quality.check", value: { boolValue: true } },
            ],
            tokenUsage: { total: { tokens: 100, cost: 40 } },
            status: "success",
            type: "chain_operation",
            children: [
              {
                id: "1-2-1-1",
                title: "RunnableSequence",
                startTime: new Date("2023-01-01T00:01:10Z"),
                endTime: new Date("2023-01-01T00:02:00Z"),
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                attributes: [
                  {
                    key: "llm.prompt_template.template",
                    value: {
                      stringValue: "Create a summary based on: {summary}",
                    },
                  },
                  {
                    key: "llm.prompt_template.variables",
                    value: { stringValue: "summary,style,length" },
                  },
                  { key: "template.tokens", value: { intValue: "25" } },
                  { key: "output.format", value: { stringValue: "markdown" } },
                  { key: "quality.check", value: { boolValue: true } },
                ],
                tokenUsage: { total: { tokens: 50, cost: 20 } },
                status: "success",
                type: "chain_operation",
                children: [
                  {
                    id: "1-2-1-1-1",
                    title: "RunnableSequence",
                    startTime: new Date("2023-01-01T00:01:15Z"),
                    endTime: new Date("2023-01-01T00:01:45Z"),
                    tokenUsage: { total: { tokens: 25, cost: 10 } },
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    attributes: [
                      {
                        key: "llm.prompt_template.template",
                        value: {
                          stringValue: "Create a summary based on: {summary}",
                        },
                      },
                      {
                        key: "llm.prompt_template.variables",
                        value: { stringValue: "summary,style,length" },
                      },
                      { key: "template.tokens", value: { intValue: "25" } },
                      {
                        key: "output.format",
                        value: { stringValue: "markdown" },
                      },
                      { key: "quality.check", value: { boolValue: true } },
                    ],
                    status: "success",
                    type: "chain_operation",
                    children: [
                      {
                        id: "1-2-1-1-1-1",
                        title: "RunnableSequence",
                        startTime: new Date("2023-01-01T00:01:20Z"),
                        endTime: new Date("2023-01-01T00:01:35Z"),
                        tokenUsage: { total: { tokens: 12, cost: 5 } },
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        attributes: [
                          {
                            key: "llm.prompt_template.template",
                            value: {
                              stringValue:
                                "Create a summary based on: {summary}",
                            },
                          },
                          {
                            key: "llm.prompt_template.variables",
                            value: { stringValue: "summary,style,length" },
                          },
                          { key: "template.tokens", value: { intValue: "25" } },
                          {
                            key: "output.format",
                            value: { stringValue: "markdown" },
                          },
                          { key: "quality.check", value: { boolValue: true } },
                        ],
                        status: "success",
                        type: "chain_operation",
                        children: [
                          {
                            id: "1-2-1-1-1-1-1",
                            title: "RunnableSequence",
                            raw: [
                              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                            ],
                            attributes: [
                              {
                                key: "llm.prompt_template.template",
                                value: {
                                  stringValue:
                                    "Create a summary based on: {summary}",
                                },
                              },
                              {
                                key: "llm.prompt_template.variables",
                                value: { stringValue: "summary,style,length" },
                              },
                              {
                                key: "template.tokens",
                                value: { intValue: "25" },
                              },
                              {
                                key: "output.format",
                                value: { stringValue: "markdown" },
                              },
                              {
                                key: "quality.check",
                                value: { boolValue: true },
                              },
                            ],
                            startTime: new Date("2023-01-01T00:01:25Z"),
                            endTime: new Date("2023-01-01T00:01:30Z"),
                            tokenUsage: { total: { tokens: 6, cost: 2 } },
                            status: "success",
                            type: "chain_operation",
                            children: [],
                          },
                        ],
                      },
                      {
                        id: "1-2-1-1-1-2",
                        title: "RunnableSequence",
                        startTime: new Date("2023-01-01T00:01:20Z"),
                        endTime: new Date("2023-01-01T00:01:35Z"),
                        tokenUsage: { total: { tokens: 12, cost: 5 } },
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        attributes: [
                          {
                            key: "llm.prompt_template.template",
                            value: {
                              stringValue:
                                "Create a summary based on: {summary}",
                            },
                          },
                          {
                            key: "llm.prompt_template.variables",
                            value: { stringValue: "summary,style,length" },
                          },
                          { key: "template.tokens", value: { intValue: "25" } },
                          {
                            key: "output.format",
                            value: { stringValue: "markdown" },
                          },
                          { key: "quality.check", value: { boolValue: true } },
                        ],
                        status: "success",
                        type: "chain_operation",
                        children: [
                          {
                            id: "1-2-1-1-1-2-1",
                            title: "RunnableSequence",
                            startTime: new Date("2023-01-01T00:01:25Z"),
                            endTime: new Date("2023-01-01T00:01:30Z"),
                            raw: [
                              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                            ],
                            attributes: [
                              {
                                key: "llm.prompt_template.template",
                                value: {
                                  stringValue:
                                    "Create a summary based on: {summary}",
                                },
                              },
                              {
                                key: "llm.prompt_template.variables",
                                value: { stringValue: "summary,style,length" },
                              },
                              {
                                key: "template.tokens",
                                value: { intValue: "25" },
                              },
                              {
                                key: "output.format",
                                value: { stringValue: "markdown" },
                              },
                              {
                                key: "quality.check",
                                value: { boolValue: true },
                              },
                            ],
                            tokenUsage: { total: { tokens: 6, cost: 2 } },
                            status: "success",
                            type: "chain_operation",
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "1-2-2",
            title: "RunnableSequence",
            startTime: new Date("2023-01-01T00:01:05Z"),
            endTime: new Date("2023-01-01T00:03:00Z"),
            tokenUsage: { total: { tokens: 100, cost: 40 } },
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            attributes: [
              {
                key: "llm.prompt_template.template",
                value: { stringValue: "Create a summary based on: {summary}" },
              },
              {
                key: "llm.prompt_template.variables",
                value: { stringValue: "summary,style,length" },
              },
              { key: "template.tokens", value: { intValue: "25" } },
              { key: "output.format", value: { stringValue: "markdown" } },
              { key: "quality.check", value: { boolValue: true } },
            ],
            status: "success",
            type: "chain_operation",
          },
        ],
      },
      {
        id: "1-3",
        title: "agent_search",
        startTime: new Date("2023-01-01T00:01:30Z"),
        endTime: new Date("2023-01-01T00:02:00Z"),
        tokenUsage: { total: { tokens: 100, cost: 25 } },
        status: "success",
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        attributes: [
          {
            key: "llm.prompt_template.template",
            value: { stringValue: "Create a summary based on: {summary}" },
          },
          {
            key: "llm.prompt_template.variables",
            value: { stringValue: "summary,style,length" },
          },
          { key: "template.tokens", value: { intValue: "25" } },
          { key: "output.format", value: { stringValue: "markdown" } },
          { key: "quality.check", value: { boolValue: true } },
        ],
        type: "tool_execution",
        children: [
          {
            id: "1-3-1",
            title: "agent_search",
            startTime: new Date("2023-01-01T00:01:31Z"),
            endTime: new Date("2023-01-01T00:01:45Z"),
            tokenUsage: { total: { tokens: 50, cost: 12 } },
            status: "success",
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            attributes: [
              {
                key: "llm.prompt_template.template",
                value: { stringValue: "Create a summary based on: {summary}" },
              },
              {
                key: "llm.prompt_template.variables",
                value: { stringValue: "summary,style,length" },
              },
              { key: "template.tokens", value: { intValue: "25" } },
              { key: "output.format", value: { stringValue: "markdown" } },
              { key: "quality.check", value: { boolValue: true } },
            ],
            type: "tool_execution",
            children: [
              {
                id: "1-3-1-1",
                title: "agent_search",
                startTime: new Date("2023-01-01T00:01:32Z"),
                endTime: new Date("2023-01-01T00:01:40Z"),
                tokenUsage: { total: { tokens: 25, cost: 6 } },
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                attributes: [
                  {
                    key: "llm.prompt_template.template",
                    value: {
                      stringValue: "Create a summary based on: {summary}",
                    },
                  },
                  {
                    key: "llm.prompt_template.variables",
                    value: { stringValue: "summary,style,length" },
                  },
                  { key: "template.tokens", value: { intValue: "25" } },
                  { key: "output.format", value: { stringValue: "markdown" } },
                  { key: "quality.check", value: { boolValue: true } },
                ],
                status: "success",
                type: "tool_execution",
                children: [
                  {
                    id: "1-3-1-1-1",
                    title: "agent_search",
                    startTime: new Date("2023-01-01T00:01:33Z"),
                    endTime: new Date("2023-01-01T00:01:37Z"),
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    attributes: [
                      {
                        key: "llm.prompt_template.template",
                        value: {
                          stringValue: "Create a summary based on: {summary}",
                        },
                      },
                      {
                        key: "llm.prompt_template.variables",
                        value: { stringValue: "summary,style,length" },
                      },
                      { key: "template.tokens", value: { intValue: "25" } },
                      {
                        key: "output.format",
                        value: { stringValue: "markdown" },
                      },
                      { key: "quality.check", value: { boolValue: true } },
                    ],
                    tokenUsage: { total: { tokens: 12, cost: 3 } },
                    status: "success",
                    type: "tool_execution",
                    children: [
                      {
                        id: "1-3-1-1-1-1",
                        title: "agent_search",
                        startTime: new Date("2023-01-01T00:01:34Z"),
                        endTime: new Date("2023-01-01T00:01:36Z"),
                        tokenUsage: { total: { tokens: 6, cost: 1 } },
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        attributes: [
                          {
                            key: "llm.prompt_template.template",
                            value: {
                              stringValue:
                                "Create a summary based on: {summary}",
                            },
                          },
                          {
                            key: "llm.prompt_template.variables",
                            value: { stringValue: "summary,style,length" },
                          },
                          { key: "template.tokens", value: { intValue: "25" } },
                          {
                            key: "output.format",
                            value: { stringValue: "markdown" },
                          },
                          { key: "quality.check", value: { boolValue: true } },
                        ],
                        status: "success",
                        type: "tool_execution",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "1-4",
        title: "RunnableSequence",
        startTime: new Date("2023-01-01T00:02:00Z"),
        endTime: new Date("2023-01-01T00:05:00Z"),
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        attributes: [
          {
            key: "llm.prompt_template.template",
            value: { stringValue: "Create a summary based on: {summary}" },
          },
          {
            key: "llm.prompt_template.variables",
            value: { stringValue: "summary,style,length" },
          },
          { key: "template.tokens", value: { intValue: "25" } },
          { key: "output.format", value: { stringValue: "markdown" } },
          { key: "quality.check", value: { boolValue: true } },
        ],
        status: "pending",
        tokenUsage: { total: { tokens: 300, cost: 90 } },
        type: "chain_operation",
        children: [
          {
            id: "1-4-1",
            title: "RunnableAssign",
            startTime: new Date("2023-01-01T00:02:05Z"),
            endTime: new Date("2023-01-01T00:02:10Z"),
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            attributes: [
              {
                key: "llm.prompt_template.template",
                value: { stringValue: "Create a summary based on: {summary}" },
              },
              {
                key: "llm.prompt_template.variables",
                value: { stringValue: "summary,style,length" },
              },
              { key: "template.tokens", value: { intValue: "25" } },
              { key: "output.format", value: { stringValue: "markdown" } },
              { key: "quality.check", value: { boolValue: true } },
            ],
            tokenUsage: { total: { tokens: 50, cost: 15 } },
            status: "error",
            type: "chain_operation",
            children: [
              {
                id: "1-4-1-1",
                title: "RunnableAssign",
                startTime: new Date("2023-01-01T00:02:06Z"),
                endTime: new Date("2023-01-01T00:02:09Z"),
                tokenUsage: { total: { tokens: 25, cost: 7 } },
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                attributes: [
                  {
                    key: "llm.prompt_template.template",
                    value: {
                      stringValue: "Create a summary based on: {summary}",
                    },
                  },
                  {
                    key: "llm.prompt_template.variables",
                    value: { stringValue: "summary,style,length" },
                  },
                  { key: "template.tokens", value: { intValue: "25" } },
                  { key: "output.format", value: { stringValue: "markdown" } },
                  { key: "quality.check", value: { boolValue: true } },
                ],
                status: "error",
                type: "chain_operation",
                children: [
                  {
                    id: "1-4-1-1-1",
                    title: "RunnableAssign",
                    startTime: new Date("2023-01-01T00:02:07Z"),
                    endTime: new Date("2023-01-01T00:02:08Z"),
                    tokenUsage: { total: { tokens: 12, cost: 3 } },
                    status: "error",
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    attributes: [
                      {
                        key: "llm.prompt_template.template",
                        value: {
                          stringValue: "Create a summary based on: {summary}",
                        },
                      },
                      {
                        key: "llm.prompt_template.variables",
                        value: { stringValue: "summary,style,length" },
                      },
                      { key: "template.tokens", value: { intValue: "25" } },
                      {
                        key: "output.format",
                        value: { stringValue: "markdown" },
                      },
                      { key: "quality.check", value: { boolValue: true } },
                    ],
                    type: "chain_operation",
                    children: [
                      {
                        id: "1-4-1-1-1-1",
                        title: "RunnableAssign",
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        attributes: [
                          {
                            key: "llm.prompt_template.template",
                            value: {
                              stringValue:
                                "Create a summary based on: {summary}",
                            },
                          },
                          {
                            key: "llm.prompt_template.variables",
                            value: { stringValue: "summary,style,length" },
                          },
                          { key: "template.tokens", value: { intValue: "25" } },
                          {
                            key: "output.format",
                            value: { stringValue: "markdown" },
                          },
                          { key: "quality.check", value: { boolValue: true } },
                        ],
                        startTime: new Date("2023-01-01T00:02:07Z"),
                        endTime: new Date("2023-01-01T00:02:08Z"),
                        tokenUsage: { total: { tokens: 6, cost: 1 } },
                        status: "error",
                        type: "chain_operation",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "1-4-2",
            title: "ChatPromptTemplate",
            startTime: new Date("2023-01-01T00:02:10Z"),
            endTime: new Date("2023-01-01T00:02:15Z"),
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            attributes: [
              {
                key: "llm.prompt_template.template",
                value: { stringValue: "Create a summary based on: {summary}" },
              },
              {
                key: "llm.prompt_template.variables",
                value: { stringValue: "summary,style,length" },
              },
              { key: "template.tokens", value: { intValue: "25" } },
              { key: "output.format", value: { stringValue: "markdown" } },
              { key: "quality.check", value: { boolValue: true } },
            ],
            tokenUsage: { total: { tokens: 100, cost: 5 } },
            status: "error",
            type: "llm_call",
            children: [
              {
                id: "1-4-2-1",
                title: "ChatPromptTemplate",
                startTime: new Date("2023-01-01T00:02:11Z"),
                endTime: new Date("2023-01-01T00:02:14Z"),
                tokenUsage: { total: { tokens: 50, cost: 2 } },
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                attributes: [
                  {
                    key: "llm.prompt_template.template",
                    value: {
                      stringValue: "Create a summary based on: {summary}",
                    },
                  },
                  {
                    key: "llm.prompt_template.variables",
                    value: { stringValue: "summary,style,length" },
                  },
                  { key: "template.tokens", value: { intValue: "25" } },
                  { key: "output.format", value: { stringValue: "markdown" } },
                  { key: "quality.check", value: { boolValue: true } },
                ],
                status: "error",
                type: "llm_call",
                children: [
                  {
                    id: "1-4-2-1-1",
                    title: "ChatPromptTemplate",
                    startTime: new Date("2023-01-01T00:02:12Z"),
                    endTime: new Date("2023-01-01T00:02:13Z"),
                    tokenUsage: { total: { tokens: 25, cost: 1 } },
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    attributes: [
                      {
                        key: "llm.prompt_template.template",
                        value: {
                          stringValue: "Create a summary based on: {summary}",
                        },
                      },
                      {
                        key: "llm.prompt_template.variables",
                        value: { stringValue: "summary,style,length" },
                      },
                      { key: "template.tokens", value: { intValue: "25" } },
                      {
                        key: "output.format",
                        value: { stringValue: "markdown" },
                      },
                      { key: "quality.check", value: { boolValue: true } },
                    ],
                    status: "error",
                    type: "llm_call",
                    children: [
                      {
                        id: "1-4-2-1-1-1",
                        title: "ChatPromptTemplate",
                        startTime: new Date("2023-01-01T00:02:12Z"),
                        endTime: new Date("2023-01-01T00:02:13Z"),
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        attributes: [
                          {
                            key: "llm.prompt_template.template",
                            value: {
                              stringValue:
                                "Create a summary based on: {summary}",
                            },
                          },
                          {
                            key: "llm.prompt_template.variables",
                            value: { stringValue: "summary,style,length" },
                          },
                          { key: "template.tokens", value: { intValue: "25" } },
                          {
                            key: "output.format",
                            value: { stringValue: "markdown" },
                          },
                          { key: "quality.check", value: { boolValue: true } },
                        ],
                        tokenUsage: { total: { tokens: 12, cost: 0 } },
                        status: "error",
                        type: "llm_call",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "1-5",
        title: "agent_extract",
        startTime: new Date("2023-01-01T00:02:15Z"),
        endTime: new Date("2023-01-01T00:02:20Z"),
        status: "pending",
        tokenUsage: { total: { tokens: 150, cost: 20 } },
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        attributes: [
          {
            key: "llm.prompt_template.template",
            value: { stringValue: "Create a summary based on: {summary}" },
          },
          {
            key: "llm.prompt_template.variables",
            value: { stringValue: "summary,style,length" },
          },
          { key: "template.tokens", value: { intValue: "25" } },
          { key: "output.format", value: { stringValue: "markdown" } },
          { key: "quality.check", value: { boolValue: true } },
        ],
        type: "tool_execution",
        children: [
          {
            id: "1-5-1",
            title: "agent_extract",
            startTime: new Date("2023-01-01T00:02:16Z"),
            endTime: new Date("2023-01-01T00:02:19Z"),
            status: "pending",
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            attributes: [
              {
                key: "llm.prompt_template.template",
                value: { stringValue: "Create a summary based on: {summary}" },
              },
              {
                key: "llm.prompt_template.variables",
                value: { stringValue: "summary,style,length" },
              },
              { key: "template.tokens", value: { intValue: "25" } },
              { key: "output.format", value: { stringValue: "markdown" } },
              { key: "quality.check", value: { boolValue: true } },
            ],
            tokenUsage: { total: { tokens: 75, cost: 10 } },
            type: "tool_execution",
            children: [
              {
                id: "1-5-1-1",
                title: "agent_extract",
                startTime: new Date("2023-01-01T00:02:17Z"),
                endTime: new Date("2023-01-01T00:02:18Z"),
                status: "pending",
                tokenUsage: { total: { tokens: 37, cost: 5 } },
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                attributes: [
                  {
                    key: "llm.prompt_template.template",
                    value: {
                      stringValue: "Create a summary based on: {summary}",
                    },
                  },
                  {
                    key: "llm.prompt_template.variables",
                    value: { stringValue: "summary,style,length" },
                  },
                  { key: "template.tokens", value: { intValue: "25" } },
                  { key: "output.format", value: { stringValue: "markdown" } },
                  { key: "quality.check", value: { boolValue: true } },
                ],
                type: "tool_execution",
                children: [
                  {
                    id: "1-5-1-1-1",
                    title: "agent_extract",
                    startTime: new Date("2023-01-01T00:02:17Z"),
                    endTime: new Date("2023-01-01T00:02:18Z"),
                    status: "pending",
                    tokenUsage: { total: { tokens: 18, cost: 2 } },
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    attributes: [
                      {
                        key: "llm.prompt_template.template",
                        value: {
                          stringValue: "Create a summary based on: {summary}",
                        },
                      },
                      {
                        key: "llm.prompt_template.variables",
                        value: { stringValue: "summary,style,length" },
                      },
                      { key: "template.tokens", value: { intValue: "25" } },
                      {
                        key: "output.format",
                        value: { stringValue: "markdown" },
                      },
                      { key: "quality.check", value: { boolValue: true } },
                    ],
                    type: "tool_execution",
                    children: [
                      {
                        id: "1-5-1-1-1-1",
                        title: "agent_extract",
                        startTime: new Date("2023-01-01T00:02:17Z"),
                        endTime: new Date("2023-01-01T00:02:18Z"),
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        attributes: [
                          {
                            key: "llm.prompt_template.template",
                            value: {
                              stringValue:
                                "Create a summary based on: {summary}",
                            },
                          },
                          {
                            key: "llm.prompt_template.variables",
                            value: { stringValue: "summary,style,length" },
                          },
                          { key: "template.tokens", value: { intValue: "25" } },
                          {
                            key: "output.format",
                            value: { stringValue: "markdown" },
                          },
                          { key: "quality.check", value: { boolValue: true } },
                        ],
                        status: "pending",
                        tokenUsage: { total: { tokens: 9, cost: 1 } },
                        type: "tool_execution",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "1-6",
        title: "RunnableAssign",
        startTime: new Date("2023-01-01T00:02:20Z"),
        endTime: new Date("2023-01-01T00:02:25Z"),
        tokenUsage: { total: { tokens: 50, cost: 15 } },
        status: "success",
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        attributes: [
          {
            key: "llm.prompt_template.template",
            value: { stringValue: "Create a summary based on: {summary}" },
          },
          {
            key: "llm.prompt_template.variables",
            value: { stringValue: "summary,style,length" },
          },
          { key: "template.tokens", value: { intValue: "25" } },
          { key: "output.format", value: { stringValue: "markdown" } },
          { key: "quality.check", value: { boolValue: true } },
        ],
        type: "chain_operation",
        children: [
          {
            id: "1-6-1",
            title: "RunnableAssign",
            startTime: new Date("2023-01-01T00:02:21Z"),
            endTime: new Date("2023-01-01T00:02:24Z"),
            tokenUsage: { total: { tokens: 25, cost: 7 } },
            status: "success",
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            attributes: [
              {
                key: "llm.prompt_template.template",
                value: { stringValue: "Create a summary based on: {summary}" },
              },
              {
                key: "llm.prompt_template.variables",
                value: { stringValue: "summary,style,length" },
              },
              { key: "template.tokens", value: { intValue: "25" } },
              { key: "output.format", value: { stringValue: "markdown" } },
              { key: "quality.check", value: { boolValue: true } },
            ],
            type: "chain_operation",
            children: [
              {
                id: "1-6-1-1",
                title: "RunnableAssign",
                startTime: new Date("2023-01-01T00:02:22Z"),
                endTime: new Date("2023-01-01T00:02:23Z"),
                tokenUsage: { total: { tokens: 12, cost: 3 } },
                status: "success",
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                attributes: [
                  {
                    key: "llm.prompt_template.template",
                    value: {
                      stringValue: "Create a summary based on: {summary}",
                    },
                  },
                  {
                    key: "llm.prompt_template.variables",
                    value: { stringValue: "summary,style,length" },
                  },
                  { key: "template.tokens", value: { intValue: "25" } },
                  { key: "output.format", value: { stringValue: "markdown" } },
                  { key: "quality.check", value: { boolValue: true } },
                ],
                type: "chain_operation",
                children: [
                  {
                    id: "1-6-1-1-1",
                    title: "RunnableAssign",
                    startTime: new Date("2023-01-01T00:02:22Z"),
                    endTime: new Date("2023-01-01T00:02:23Z"),
                    tokenUsage: { total: { tokens: 6, cost: 1 } },
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    attributes: [
                      {
                        key: "llm.prompt_template.template",
                        value: {
                          stringValue: "Create a summary based on: {summary}",
                        },
                      },
                      {
                        key: "llm.prompt_template.variables",
                        value: { stringValue: "summary,style,length" },
                      },
                      { key: "template.tokens", value: { intValue: "25" } },
                      {
                        key: "output.format",
                        value: { stringValue: "markdown" },
                      },
                      { key: "quality.check", value: { boolValue: true } },
                    ],
                    status: "success",
                    type: "chain_operation",
                    children: [
                      {
                        id: "1-6-1-1-1-1",
                        title: "RunnableAssign",
                        startTime: new Date("2023-01-01T00:02:22Z"),
                        endTime: new Date("2023-01-01T00:02:23Z"),
                        tokenUsage: { total: { tokens: 3, cost: 0 } },
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        attributes: [
                          {
                            key: "llm.prompt_template.template",
                            value: {
                              stringValue:
                                "Create a summary based on: {summary}",
                            },
                          },
                          {
                            key: "llm.prompt_template.variables",
                            value: { stringValue: "summary,style,length" },
                          },
                          { key: "template.tokens", value: { intValue: "25" } },
                          {
                            key: "output.format",
                            value: { stringValue: "markdown" },
                          },
                          { key: "quality.check", value: { boolValue: true } },
                        ],
                        status: "success",
                        type: "chain_operation",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "1-7",
        title: "ChatPromptTemplate",
        startTime: new Date("2023-01-01T00:02:25Z"),
        endTime: new Date("2023-01-01T00:02:30Z"),
        tokenUsage: { total: { tokens: 100, cost: 5 } },
        status: "success",
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        attributes: [
          {
            key: "llm.prompt_template.template",
            value: { stringValue: "Create a summary based on: {summary}" },
          },
          {
            key: "llm.prompt_template.variables",
            value: { stringValue: "summary,style,length" },
          },
          { key: "template.tokens", value: { intValue: "25" } },
          { key: "output.format", value: { stringValue: "markdown" } },
          { key: "quality.check", value: { boolValue: true } },
        ],
        type: "llm_call",
        children: [
          {
            id: "1-7-1",
            title: "ChatPromptTemplate",
            startTime: new Date("2023-01-01T00:02:26Z"),
            endTime: new Date("2023-01-01T00:02:29Z"),
            tokenUsage: { total: { tokens: 50, cost: 2 } },
            status: "success",
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            attributes: [
              {
                key: "llm.prompt_template.template",
                value: { stringValue: "Create a summary based on: {summary}" },
              },
              {
                key: "llm.prompt_template.variables",
                value: { stringValue: "summary,style,length" },
              },
              { key: "template.tokens", value: { intValue: "25" } },
              { key: "output.format", value: { stringValue: "markdown" } },
              { key: "quality.check", value: { boolValue: true } },
            ],
            type: "llm_call",
            children: [
              {
                id: "1-7-1-1",
                title: "ChatPromptTemplate",
                startTime: new Date("2023-01-01T00:02:27Z"),
                endTime: new Date("2023-01-01T00:02:28Z"),
                tokenUsage: { total: { tokens: 25, cost: 1 } },
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                attributes: [
                  {
                    key: "llm.prompt_template.template",
                    value: {
                      stringValue: "Create a summary based on: {summary}",
                    },
                  },
                  {
                    key: "llm.prompt_template.variables",
                    value: { stringValue: "summary,style,length" },
                  },
                  { key: "template.tokens", value: { intValue: "25" } },
                  { key: "output.format", value: { stringValue: "markdown" } },
                  { key: "quality.check", value: { boolValue: true } },
                ],
                status: "success",
                type: "llm_call",
                children: [
                  {
                    id: "1-7-1-1-1",
                    title: "ChatPromptTemplate",
                    startTime: new Date("2023-01-01T00:02:27Z"),
                    endTime: new Date("2023-01-01T00:02:28Z"),
                    tokenUsage: { total: { tokens: 12, cost: 0 } },
                    status: "success",
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    attributes: [
                      {
                        key: "llm.prompt_template.template",
                        value: {
                          stringValue: "Create a summary based on: {summary}",
                        },
                      },
                      {
                        key: "llm.prompt_template.variables",
                        value: { stringValue: "summary,style,length" },
                      },
                      { key: "template.tokens", value: { intValue: "25" } },
                      {
                        key: "output.format",
                        value: { stringValue: "markdown" },
                      },
                      { key: "quality.check", value: { boolValue: true } },
                    ],
                    type: "llm_call",
                    children: [
                      {
                        id: "1-7-1-1-1-1",
                        title: "ChatPromptTemplate",
                        startTime: new Date("2023-01-01T00:02:27Z"),
                        endTime: new Date("2023-01-01T00:02:28Z"),
                        tokenUsage: { total: { tokens: 6, cost: 0 } },
                        status: "success",
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        attributes: [
                          {
                            key: "llm.prompt_template.template",
                            value: {
                              stringValue:
                                "Create a summary based on: {summary}",
                            },
                          },
                          {
                            key: "llm.prompt_template.variables",
                            value: { stringValue: "summary,style,length" },
                          },
                          { key: "template.tokens", value: { intValue: "25" } },
                          {
                            key: "output.format",
                            value: { stringValue: "markdown" },
                          },
                          { key: "quality.check", value: { boolValue: true } },
                        ],
                        type: "llm_call",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
