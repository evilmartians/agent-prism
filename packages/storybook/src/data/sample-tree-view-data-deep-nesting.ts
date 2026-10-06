import type { TraceSpan } from "@evilmartians/agent-prism-types";

export const sampleTreeViewDataDeepNesting: TraceSpan[] = [
  {
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
    children: [
      {
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
        children: [
          {
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
            children: [
              {
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
                children: [
                  {
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
                    children: [
                      {
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
                        children: [
                          {
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
                            children: [
                              {
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
                                children: [
                                  {
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
                                    children: [
                                      {
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
                                        children: [
                                          {
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
                                            children: [
                                              {
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
                                                children: [
                                                  {
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
                                                    children: [
                                                      {
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
                                                        children: [
                                                          {
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
                                                                children: [],
                                                                endTime:
                                                                  new Date(
                                                                    "2023-01-01T00:00:21Z",
                                                                  ),
                                                                id: "1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1",
                                                                raw: [
                                                                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                                                ],
                                                                startTime:
                                                                  new Date(
                                                                    "2023-01-01T00:00:19Z",
                                                                  ),
                                                                status:
                                                                  "success",
                                                                title:
                                                                  "ChatCompletion",
                                                                tokenUsage: {
                                                                  total: {
                                                                    cost: 4,
                                                                    tokens: 15,
                                                                  },
                                                                },
                                                                type: "llm_call",
                                                              },
                                                            ],
                                                            endTime: new Date(
                                                              "2023-01-01T00:00:21Z",
                                                            ),
                                                            id: "1-1-1-1-1-1-1-1-1-1-1-1-1-1-1",
                                                            raw: [
                                                              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                                            ],
                                                            startTime: new Date(
                                                              "2023-01-01T00:00:19Z",
                                                            ),
                                                            status: "success",
                                                            title:
                                                              "ChatCompletion",
                                                            tokenUsage: {
                                                              total: {
                                                                cost: 4,
                                                                tokens: 15,
                                                              },
                                                            },
                                                            type: "llm_call",
                                                          },
                                                        ],
                                                        endTime: new Date(
                                                          "2023-01-01T00:00:21Z",
                                                        ),
                                                        id: "1-1-1-1-1-1-1-1-1-1-1-1-1-1",
                                                        raw: [
                                                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                                        ],
                                                        startTime: new Date(
                                                          "2023-01-01T00:00:19Z",
                                                        ),
                                                        status: "success",
                                                        title: "ChatCompletion",
                                                        tokenUsage: {
                                                          total: {
                                                            cost: 4,
                                                            tokens: 15,
                                                          },
                                                        },
                                                        type: "llm_call",
                                                      },
                                                    ],
                                                    endTime: new Date(
                                                      "2023-01-01T00:00:21Z",
                                                    ),
                                                    id: "1-1-1-1-1-1-1-1-1-1-1-1-1",
                                                    raw: [
                                                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                                    ],
                                                    startTime: new Date(
                                                      "2023-01-01T00:00:19Z",
                                                    ),
                                                    status: "success",
                                                    title: "ChatCompletion",
                                                    tokenUsage: {
                                                      total: {
                                                        cost: 4,
                                                        tokens: 15,
                                                      },
                                                    },
                                                    type: "llm_call",
                                                  },
                                                ],
                                                endTime: new Date(
                                                  "2023-01-01T00:00:21Z",
                                                ),
                                                id: "1-1-1-1-1-1-1-1-1-1-1-1",
                                                raw: [
                                                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                                ],
                                                startTime: new Date(
                                                  "2023-01-01T00:00:19Z",
                                                ),
                                                status: "success",
                                                title: "ChatCompletion",
                                                tokenUsage: {
                                                  total: {
                                                    cost: 4,
                                                    tokens: 15,
                                                  },
                                                },
                                                type: "llm_call",
                                              },
                                            ],
                                            endTime: new Date(
                                              "2023-01-01T00:00:21Z",
                                            ),
                                            id: "1-1-1-1-1-1-1-1-1-1-1",
                                            raw: [
                                              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                            ],
                                            startTime: new Date(
                                              "2023-01-01T00:00:19Z",
                                            ),
                                            status: "success",
                                            title: "ChatCompletion",
                                            tokenUsage: {
                                              total: { cost: 4, tokens: 15 },
                                            },
                                            type: "llm_call",
                                          },
                                        ],
                                        endTime: new Date(
                                          "2023-01-01T00:00:21Z",
                                        ),
                                        id: "1-1-1-1-1-1-1-1-1-1",
                                        raw: [
                                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                        ],
                                        startTime: new Date(
                                          "2023-01-01T00:00:19Z",
                                        ),
                                        status: "success",
                                        title: "ChatCompletion",
                                        tokenUsage: {
                                          total: { cost: 4, tokens: 15 },
                                        },
                                        type: "llm_call",
                                      },
                                    ],
                                    endTime: new Date("2023-01-01T00:00:21Z"),
                                    id: "1-1-1-1-1-1-1-1-1",
                                    raw: [
                                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                    ],
                                    startTime: new Date("2023-01-01T00:00:19Z"),
                                    status: "success",
                                    title: "ChatCompletion",
                                    tokenUsage: {
                                      total: { cost: 4, tokens: 15 },
                                    },
                                    type: "llm_call",
                                  },
                                ],
                                endTime: new Date("2023-01-01T00:00:21Z"),
                                id: "1-1-1-1-1-1-1-1",
                                raw: [
                                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                                ],
                                startTime: new Date("2023-01-01T00:00:19Z"),
                                status: "success",
                                title: "ChatCompletion",
                                tokenUsage: { total: { cost: 4, tokens: 15 } },
                                type: "llm_call",
                              },
                            ],
                            endTime: new Date("2023-01-01T00:00:21Z"),
                            id: "1-1-1-1-1-1-1",
                            raw: [
                              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                            ],
                            startTime: new Date("2023-01-01T00:00:19Z"),
                            status: "success",
                            title: "ChatCompletion",
                            tokenUsage: { total: { cost: 4, tokens: 15 } },
                            type: "llm_call",
                          },
                        ],
                        endTime: new Date("2023-01-01T00:00:22Z"),
                        id: "1-1-1-1-1-1",
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        startTime: new Date("2023-01-01T00:00:18Z"),
                        status: "success",
                        title: "ChatCompletion",
                        tokenUsage: { total: { cost: 9, tokens: 31 } },
                        type: "llm_call",
                      },
                    ],
                    endTime: new Date("2023-01-01T00:00:25Z"),
                    id: "1-1-1-1-1",
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    startTime: new Date("2023-01-01T00:00:17Z"),
                    status: "success",
                    title: "ChatCompletion",
                    tokenUsage: { total: { cost: 18, tokens: 62 } },
                    type: "llm_call",
                  },
                ],
                endTime: new Date("2023-01-01T00:00:30Z"),
                id: "1-1-1-1",
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                startTime: new Date("2023-01-01T00:00:16Z"),
                status: "success",
                title: "ChatCompletion",
                tokenUsage: { total: { cost: 37, tokens: 125 } },
                type: "llm_call",
              },
            ],
            endTime: new Date("2023-01-01T00:00:45Z"),
            id: "1-1-1",
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            startTime: new Date("2023-01-01T00:00:15Z"),
            status: "pending",
            title: "ChatCompletion",
            tokenUsage: { total: { cost: 75, tokens: 250 } },
            type: "llm_call",
          },
          {
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
            children: [
              {
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
                children: [
                  {
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
                    children: [
                      {
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
                        children: [
                          {
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
                            children: [],
                            endTime: new Date("2023-01-01T00:00:51Z"),
                            id: "1-1-2-1-1-1-1",
                            raw: [
                              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                            ],
                            startTime: new Date("2023-01-01T00:00:49Z"),
                            status: "error",
                            title: "ChatCompletion",
                            tokenUsage: { total: { cost: 4, tokens: 15 } },
                            type: "llm_call",
                          },
                        ],
                        endTime: new Date("2023-01-01T00:00:52Z"),
                        id: "1-1-2-1-1-1",
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        startTime: new Date("2023-01-01T00:00:48Z"),
                        status: "error",
                        title: "ChatCompletion",
                        tokenUsage: { total: { cost: 9, tokens: 31 } },
                        type: "llm_call",
                      },
                    ],
                    endTime: new Date("2023-01-01T00:00:55Z"),
                    id: "1-1-2-1-1",
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    startTime: new Date("2023-01-01T00:00:47Z"),
                    status: "error",
                    title: "ChatCompletion",
                    tokenUsage: { total: { cost: 18, tokens: 62 } },
                    type: "llm_call",
                  },
                ],
                endTime: new Date("2023-01-01T00:01:00Z"),
                id: "1-1-2-1",
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                startTime: new Date("2023-01-01T00:00:46Z"),
                status: "error",
                title: "ChatCompletion",
                tokenUsage: { total: { cost: 37, tokens: 125 } },
                type: "llm_call",
              },
            ],
            endTime: new Date("2023-01-01T00:01:30Z"),
            id: "1-1-2",
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            startTime: new Date("2023-01-01T00:00:45Z"),
            status: "error",
            title: "ChatCompletion",
            tokenUsage: { total: { cost: 75, tokens: 250 } },
            type: "llm_call",
          },
        ],
        endTime: new Date("2023-01-01T00:05:00Z"),
        id: "1-1",
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        startTime: new Date("2023-01-01T00:00:10Z"),
        status: "success",
        title: "ChatCompletions",
        tokenUsage: { total: { cost: 150, tokens: 500 } },
        type: "llm_call",
      },
      {
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
        children: [
          {
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
            children: [
              {
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
                children: [
                  {
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
                    children: [
                      {
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
                        children: [
                          {
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
                            children: [],
                            endTime: new Date("2023-01-01T00:01:30Z"),
                            id: "1-2-1-1-1-1-1",
                            raw: [
                              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                            ],
                            startTime: new Date("2023-01-01T00:01:25Z"),
                            status: "success",
                            title: "RunnableSequence",
                            tokenUsage: { total: { cost: 2, tokens: 6 } },
                            type: "chain_operation",
                          },
                        ],
                        endTime: new Date("2023-01-01T00:01:35Z"),
                        id: "1-2-1-1-1-1",
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        startTime: new Date("2023-01-01T00:01:20Z"),
                        status: "success",
                        title: "RunnableSequence",
                        tokenUsage: { total: { cost: 5, tokens: 12 } },
                        type: "chain_operation",
                      },
                      {
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
                        children: [
                          {
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
                            children: [],
                            endTime: new Date("2023-01-01T00:01:30Z"),
                            id: "1-2-1-1-1-2-1",
                            raw: [
                              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                            ],
                            startTime: new Date("2023-01-01T00:01:25Z"),
                            status: "success",
                            title: "RunnableSequence",
                            tokenUsage: { total: { cost: 2, tokens: 6 } },
                            type: "chain_operation",
                          },
                        ],
                        endTime: new Date("2023-01-01T00:01:35Z"),
                        id: "1-2-1-1-1-2",
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        startTime: new Date("2023-01-01T00:01:20Z"),
                        status: "success",
                        title: "RunnableSequence",
                        tokenUsage: { total: { cost: 5, tokens: 12 } },
                        type: "chain_operation",
                      },
                    ],
                    endTime: new Date("2023-01-01T00:01:45Z"),
                    id: "1-2-1-1-1",
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    startTime: new Date("2023-01-01T00:01:15Z"),
                    status: "success",
                    title: "RunnableSequence",
                    tokenUsage: { total: { cost: 10, tokens: 25 } },
                    type: "chain_operation",
                  },
                ],
                endTime: new Date("2023-01-01T00:02:00Z"),
                id: "1-2-1-1",
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                startTime: new Date("2023-01-01T00:01:10Z"),
                status: "success",
                title: "RunnableSequence",
                tokenUsage: { total: { cost: 20, tokens: 50 } },
                type: "chain_operation",
              },
            ],
            endTime: new Date("2023-01-01T00:03:00Z"),
            id: "1-2-1",
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            startTime: new Date("2023-01-01T00:01:05Z"),
            status: "success",
            title: "RunnableSequence",
            tokenUsage: { total: { cost: 40, tokens: 100 } },
            type: "chain_operation",
          },
          {
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
            endTime: new Date("2023-01-01T00:03:00Z"),
            id: "1-2-2",
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            startTime: new Date("2023-01-01T00:01:05Z"),
            status: "success",
            title: "RunnableSequence",
            tokenUsage: { total: { cost: 40, tokens: 100 } },
            type: "chain_operation",
          },
        ],
        endTime: new Date("2023-01-01T00:05:00Z"),
        id: "1-2",
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        startTime: new Date("2023-01-01T00:01:00Z"),
        status: "success",
        title: "RunnableSequence",
        tokenUsage: { total: { cost: 80, tokens: 200 } },
        type: "chain_operation",
      },
      {
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
        children: [
          {
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
            children: [
              {
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
                children: [
                  {
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
                    children: [
                      {
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
                        children: [],
                        endTime: new Date("2023-01-01T00:01:36Z"),
                        id: "1-3-1-1-1-1",
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        startTime: new Date("2023-01-01T00:01:34Z"),
                        status: "success",
                        title: "agent_search",
                        tokenUsage: { total: { cost: 1, tokens: 6 } },
                        type: "tool_execution",
                      },
                    ],
                    endTime: new Date("2023-01-01T00:01:37Z"),
                    id: "1-3-1-1-1",
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    startTime: new Date("2023-01-01T00:01:33Z"),
                    status: "success",
                    title: "agent_search",
                    tokenUsage: { total: { cost: 3, tokens: 12 } },
                    type: "tool_execution",
                  },
                ],
                endTime: new Date("2023-01-01T00:01:40Z"),
                id: "1-3-1-1",
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                startTime: new Date("2023-01-01T00:01:32Z"),
                status: "success",
                title: "agent_search",
                tokenUsage: { total: { cost: 6, tokens: 25 } },
                type: "tool_execution",
              },
            ],
            endTime: new Date("2023-01-01T00:01:45Z"),
            id: "1-3-1",
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            startTime: new Date("2023-01-01T00:01:31Z"),
            status: "success",
            title: "agent_search",
            tokenUsage: { total: { cost: 12, tokens: 50 } },
            type: "tool_execution",
          },
        ],
        endTime: new Date("2023-01-01T00:02:00Z"),
        id: "1-3",
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        startTime: new Date("2023-01-01T00:01:30Z"),
        status: "success",
        title: "agent_search",
        tokenUsage: { total: { cost: 25, tokens: 100 } },
        type: "tool_execution",
      },
      {
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
        children: [
          {
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
            children: [
              {
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
                children: [
                  {
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
                    children: [
                      {
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
                        children: [],
                        endTime: new Date("2023-01-01T00:02:08Z"),
                        id: "1-4-1-1-1-1",
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        startTime: new Date("2023-01-01T00:02:07Z"),
                        status: "error",
                        title: "RunnableAssign",
                        tokenUsage: { total: { cost: 1, tokens: 6 } },
                        type: "chain_operation",
                      },
                    ],
                    endTime: new Date("2023-01-01T00:02:08Z"),
                    id: "1-4-1-1-1",
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    startTime: new Date("2023-01-01T00:02:07Z"),
                    status: "error",
                    title: "RunnableAssign",
                    tokenUsage: { total: { cost: 3, tokens: 12 } },
                    type: "chain_operation",
                  },
                ],
                endTime: new Date("2023-01-01T00:02:09Z"),
                id: "1-4-1-1",
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                startTime: new Date("2023-01-01T00:02:06Z"),
                status: "error",
                title: "RunnableAssign",
                tokenUsage: { total: { cost: 7, tokens: 25 } },
                type: "chain_operation",
              },
            ],
            endTime: new Date("2023-01-01T00:02:10Z"),
            id: "1-4-1",
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            startTime: new Date("2023-01-01T00:02:05Z"),
            status: "error",
            title: "RunnableAssign",
            tokenUsage: { total: { cost: 15, tokens: 50 } },
            type: "chain_operation",
          },
          {
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
            children: [
              {
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
                children: [
                  {
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
                    children: [
                      {
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
                        children: [],
                        endTime: new Date("2023-01-01T00:02:13Z"),
                        id: "1-4-2-1-1-1",
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        startTime: new Date("2023-01-01T00:02:12Z"),
                        status: "error",
                        title: "ChatPromptTemplate",
                        tokenUsage: { total: { cost: 0, tokens: 12 } },
                        type: "llm_call",
                      },
                    ],
                    endTime: new Date("2023-01-01T00:02:13Z"),
                    id: "1-4-2-1-1",
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    startTime: new Date("2023-01-01T00:02:12Z"),
                    status: "error",
                    title: "ChatPromptTemplate",
                    tokenUsage: { total: { cost: 1, tokens: 25 } },
                    type: "llm_call",
                  },
                ],
                endTime: new Date("2023-01-01T00:02:14Z"),
                id: "1-4-2-1",
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                startTime: new Date("2023-01-01T00:02:11Z"),
                status: "error",
                title: "ChatPromptTemplate",
                tokenUsage: { total: { cost: 2, tokens: 50 } },
                type: "llm_call",
              },
            ],
            endTime: new Date("2023-01-01T00:02:15Z"),
            id: "1-4-2",
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            startTime: new Date("2023-01-01T00:02:10Z"),
            status: "error",
            title: "ChatPromptTemplate",
            tokenUsage: { total: { cost: 5, tokens: 100 } },
            type: "llm_call",
          },
        ],
        endTime: new Date("2023-01-01T00:05:00Z"),
        id: "1-4",
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        startTime: new Date("2023-01-01T00:02:00Z"),
        status: "pending",
        title: "RunnableSequence",
        tokenUsage: { total: { cost: 90, tokens: 300 } },
        type: "chain_operation",
      },
      {
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
        children: [
          {
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
            children: [
              {
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
                children: [
                  {
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
                    children: [
                      {
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
                        children: [],
                        endTime: new Date("2023-01-01T00:02:18Z"),
                        id: "1-5-1-1-1-1",
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        startTime: new Date("2023-01-01T00:02:17Z"),
                        status: "pending",
                        title: "agent_extract",
                        tokenUsage: { total: { cost: 1, tokens: 9 } },
                        type: "tool_execution",
                      },
                    ],
                    endTime: new Date("2023-01-01T00:02:18Z"),
                    id: "1-5-1-1-1",
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    startTime: new Date("2023-01-01T00:02:17Z"),
                    status: "pending",
                    title: "agent_extract",
                    tokenUsage: { total: { cost: 2, tokens: 18 } },
                    type: "tool_execution",
                  },
                ],
                endTime: new Date("2023-01-01T00:02:18Z"),
                id: "1-5-1-1",
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                startTime: new Date("2023-01-01T00:02:17Z"),
                status: "pending",
                title: "agent_extract",
                tokenUsage: { total: { cost: 5, tokens: 37 } },
                type: "tool_execution",
              },
            ],
            endTime: new Date("2023-01-01T00:02:19Z"),
            id: "1-5-1",
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            startTime: new Date("2023-01-01T00:02:16Z"),
            status: "pending",
            title: "agent_extract",
            tokenUsage: { total: { cost: 10, tokens: 75 } },
            type: "tool_execution",
          },
        ],
        endTime: new Date("2023-01-01T00:02:20Z"),
        id: "1-5",
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        startTime: new Date("2023-01-01T00:02:15Z"),
        status: "pending",
        title: "agent_extract",
        tokenUsage: { total: { cost: 20, tokens: 150 } },
        type: "tool_execution",
      },
      {
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
        children: [
          {
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
            children: [
              {
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
                children: [
                  {
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
                    children: [
                      {
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
                        children: [],
                        endTime: new Date("2023-01-01T00:02:23Z"),
                        id: "1-6-1-1-1-1",
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        startTime: new Date("2023-01-01T00:02:22Z"),
                        status: "success",
                        title: "RunnableAssign",
                        tokenUsage: { total: { cost: 0, tokens: 3 } },
                        type: "chain_operation",
                      },
                    ],
                    endTime: new Date("2023-01-01T00:02:23Z"),
                    id: "1-6-1-1-1",
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    startTime: new Date("2023-01-01T00:02:22Z"),
                    status: "success",
                    title: "RunnableAssign",
                    tokenUsage: { total: { cost: 1, tokens: 6 } },
                    type: "chain_operation",
                  },
                ],
                endTime: new Date("2023-01-01T00:02:23Z"),
                id: "1-6-1-1",
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                startTime: new Date("2023-01-01T00:02:22Z"),
                status: "success",
                title: "RunnableAssign",
                tokenUsage: { total: { cost: 3, tokens: 12 } },
                type: "chain_operation",
              },
            ],
            endTime: new Date("2023-01-01T00:02:24Z"),
            id: "1-6-1",
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            startTime: new Date("2023-01-01T00:02:21Z"),
            status: "success",
            title: "RunnableAssign",
            tokenUsage: { total: { cost: 7, tokens: 25 } },
            type: "chain_operation",
          },
        ],
        endTime: new Date("2023-01-01T00:02:25Z"),
        id: "1-6",
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        startTime: new Date("2023-01-01T00:02:20Z"),
        status: "success",
        title: "RunnableAssign",
        tokenUsage: { total: { cost: 15, tokens: 50 } },
        type: "chain_operation",
      },
      {
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
        children: [
          {
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
            children: [
              {
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
                children: [
                  {
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
                    children: [
                      {
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
                        children: [],
                        endTime: new Date("2023-01-01T00:02:28Z"),
                        id: "1-7-1-1-1-1",
                        raw: [
                          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                        ],
                        startTime: new Date("2023-01-01T00:02:27Z"),
                        status: "success",
                        title: "ChatPromptTemplate",
                        tokenUsage: { total: { cost: 0, tokens: 6 } },
                        type: "llm_call",
                      },
                    ],
                    endTime: new Date("2023-01-01T00:02:28Z"),
                    id: "1-7-1-1-1",
                    raw: [
                      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                    ],
                    startTime: new Date("2023-01-01T00:02:27Z"),
                    status: "success",
                    title: "ChatPromptTemplate",
                    tokenUsage: { total: { cost: 0, tokens: 12 } },
                    type: "llm_call",
                  },
                ],
                endTime: new Date("2023-01-01T00:02:28Z"),
                id: "1-7-1-1",
                raw: [
                  `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
                ],
                startTime: new Date("2023-01-01T00:02:27Z"),
                status: "success",
                title: "ChatPromptTemplate",
                tokenUsage: { total: { cost: 1, tokens: 25 } },
                type: "llm_call",
              },
            ],
            endTime: new Date("2023-01-01T00:02:29Z"),
            id: "1-7-1",
            raw: [
              `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
            ],
            startTime: new Date("2023-01-01T00:02:26Z"),
            status: "success",
            title: "ChatPromptTemplate",
            tokenUsage: { total: { cost: 2, tokens: 50 } },
            type: "llm_call",
          },
        ],
        endTime: new Date("2023-01-01T00:02:30Z"),
        id: "1-7",
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        startTime: new Date("2023-01-01T00:02:25Z"),
        status: "success",
        title: "ChatPromptTemplate",
        tokenUsage: { total: { cost: 5, tokens: 100 } },
        type: "llm_call",
      },
    ],
    endTime: new Date("2023-01-01T00:06:12Z"),
    id: "1",
    raw: [
      `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
    ],
    startTime: new Date("2023-01-01T00:00:00Z"),
    status: "success",
    title: "main",
    tokenUsage: { total: { cost: 1234, tokens: 1000 } },
    type: "chain_operation",
  },
];
