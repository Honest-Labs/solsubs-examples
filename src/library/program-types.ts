export type SubscriptionProgram = {
  version: "0.1.0";
  name: "subscription_program";
  instructions: [
    {
      name: "createPlan";
      accounts: [
        {
          name: "planAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "planTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mintAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "data";
          type: {
            defined: "CreatePlanData";
          };
        }
      ];
    },
    {
      name: "createSubscription";
      accounts: [
        {
          name: "subscriptionAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "planAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "planTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "data";
          type: {
            defined: "CreateSubscriptionData";
          };
        }
      ];
    },
    {
      name: "chargeSubscription";
      accounts: [
        {
          name: "subscriptionAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "planAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "planTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "subscriberTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "ownerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "deployerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "cancelSubscription";
      accounts: [
        {
          name: "subscriptionAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "planAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "uncancelSubscription";
      accounts: [
        {
          name: "subscriptionAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "planAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "closeSubscription";
      accounts: [
        {
          name: "subscriptionAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "planAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "planTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "planOwnerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "deployerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "plan";
      type: {
        kind: "struct";
        fields: [
          {
            name: "code";
            type: "string";
          },
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "price";
            type: "u64";
          },
          {
            name: "tokenMint";
            type: "publicKey";
          },
          {
            name: "termInSeconds";
            type: "u64";
          },
          {
            name: "activeSubscriptions";
            type: "u32";
          }
        ];
      };
    },
    {
      name: "subscription";
      type: {
        kind: "struct";
        fields: [
          {
            name: "planAccount";
            type: "publicKey";
          },
          {
            name: "payerTokenAccount";
            type: "publicKey";
          },
          {
            name: "nextTermDate";
            type: "i64";
          },
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "state";
            type: {
              defined: "SubscriptionState";
            };
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "CreatePlanData";
      type: {
        kind: "struct";
        fields: [
          {
            name: "code";
            type: "string";
          },
          {
            name: "price";
            type: "u64";
          },
          {
            name: "termInSeconds";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "CreateSubscriptionData";
      type: {
        kind: "struct";
        fields: [
          {
            name: "delegationAmount";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "SubscriptionState";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Active";
          },
          {
            name: "PendingCancellation";
          },
          {
            name: "PastDue";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "SubscriptionNotReady";
      msg: "Subscription is not ready to be credited";
    }
  ];
};

export const IDL: SubscriptionProgram = {
  version: "0.1.0",
  name: "subscription_program",
  instructions: [
    {
      name: "createPlan",
      accounts: [
        {
          name: "planAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "planTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mintAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: {
            defined: "CreatePlanData",
          },
        },
      ],
    },
    {
      name: "createSubscription",
      accounts: [
        {
          name: "subscriptionAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "planAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "planTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: {
            defined: "CreateSubscriptionData",
          },
        },
      ],
    },
    {
      name: "chargeSubscription",
      accounts: [
        {
          name: "subscriptionAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "planAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "planTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "subscriberTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "ownerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "deployerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "cancelSubscription",
      accounts: [
        {
          name: "subscriptionAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "planAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "uncancelSubscription",
      accounts: [
        {
          name: "subscriptionAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "planAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "closeSubscription",
      accounts: [
        {
          name: "subscriptionAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "planAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "planTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "planOwnerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "deployerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "plan",
      type: {
        kind: "struct",
        fields: [
          {
            name: "code",
            type: "string",
          },
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "price",
            type: "u64",
          },
          {
            name: "tokenMint",
            type: "publicKey",
          },
          {
            name: "termInSeconds",
            type: "u64",
          },
          {
            name: "activeSubscriptions",
            type: "u32",
          },
        ],
      },
    },
    {
      name: "subscription",
      type: {
        kind: "struct",
        fields: [
          {
            name: "planAccount",
            type: "publicKey",
          },
          {
            name: "payerTokenAccount",
            type: "publicKey",
          },
          {
            name: "nextTermDate",
            type: "i64",
          },
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "state",
            type: {
              defined: "SubscriptionState",
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "CreatePlanData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "code",
            type: "string",
          },
          {
            name: "price",
            type: "u64",
          },
          {
            name: "termInSeconds",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "CreateSubscriptionData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "delegationAmount",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "SubscriptionState",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Active",
          },
          {
            name: "PendingCancellation",
          },
          {
            name: "PastDue",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "SubscriptionNotReady",
      msg: "Subscription is not ready to be credited",
    },
  ],
};
