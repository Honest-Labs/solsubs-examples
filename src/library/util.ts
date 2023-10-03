import { Connection, PublicKey } from "@solana/web3.js";
import {
  AnchorProvider,
  BN,
  Idl,
  Program,
  utils,
  web3,
} from "@project-serum/anchor";
import { SubscriptionProgram } from "./program-types";
import {
  useWallet,
  WalletContextState,
  AnchorWallet,
} from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

export const SOLSUBS_PROGRAM_ID = new PublicKey(
  "6qMvvisbUX3Co1sZa7DkyCXF8FcsTjzKSQHcaDoqSLbw"
);

export const PROGRAM_DEPLOYER = new PublicKey(
  "8mw8QFoqRffuYtwVDw4QD6eEfg1wEpYB24oL44toeZxy"
);

// TODO: add prod tokens;
export const splTokens = [
  {
    label: "USDC",
    value: "Hn5zWLAdzFmP6uiJySdSqiPwYdSJgzCvsWLMVuCbkGzB",
    decimals: 9,
    icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=026",
    color: "#2774CA",
  },
  {
    label: "DUST",
    value: "8zr1SVsbYy12jA88WxAEh5kB24538vtKEUDw5Z1FcGNr",
    decimals: 9,
    icon: "https://dustprotocol.com/favicon.svg",
    color: "#00EDFF",
  },
];

export const useProvider = (url: string) => {
  const wallet = useWallet();
  const connection = new Connection(url, "confirmed");
  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return {} as AnchorWallet;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as AnchorWallet;
  }, [wallet]);

  if (anchorWallet) {
    const provider = new AnchorProvider(connection, anchorWallet, {
      commitment: "confirmed",
    });
    return { provider, wallet: anchorWallet };
  }
};

let _idl: Idl;

export const getProgram = async (provider: AnchorProvider) => {
  if (!_idl) {
    _idl = (await Program.fetchIdl(SOLSUBS_PROGRAM_ID, provider))!;
  }
  return new Program(
    _idl,
    SOLSUBS_PROGRAM_ID,
    provider
  ) as unknown as Program<SubscriptionProgram>;
};

export const getPlanPdaAccountSync = (planCode: string, creator: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(utils.bytes.utf8.encode("plan")),
      creator.toBuffer(),
      Buffer.from(utils.bytes.utf8.encode(planCode)),
    ],
    SOLSUBS_PROGRAM_ID
  )[0];
};

export const getPlanAccount = async (
  planCode: string,
  creator: PublicKey,
  provider: AnchorProvider
) => {
  const program = await getProgram(provider);

  return program.account.plan.fetch(getPlanPdaAccountSync(planCode, creator));
};

export const getSubscriptionPdaAccountSync = (
  planAccount: PublicKey,
  subscriptionCreator: PublicKey
) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(utils.bytes.utf8.encode("subscription")),
      subscriptionCreator.toBuffer(),
      planAccount.toBuffer(),
    ],
    SOLSUBS_PROGRAM_ID
  )[0];
};

export const getSubscriptionAccount = async (
  planAccount: PublicKey,
  subscriptionCreator: PublicKey,
  provider: AnchorProvider
) => {
  const program = await getProgram(provider);

  return program.account.subscription.fetch(
    getSubscriptionPdaAccountSync(planAccount, subscriptionCreator)
  );
};

export const openLinkToExplorer = (
  account: string,
  ENV = "dev",
  isTx = false
) => {
  window.open(
    `https://solana.fm/${isTx ? "tx" : "address"}/${account}${
      !isTx ? "/anchor-account" : ""
    }?cluster=${ENV === "prod" ? "mainnet-qn1" : "devnet-qn1"}`
  );
};

export const useSubscriptions = (
  planCodes: string[],
  planCreator: PublicKey,
  url: string
) => {
  const wallet = useWallet();
  const provider = useProvider(url);
  const [subscriptions, setSubscriptions] = useState<
    (Awaited<ReturnType<typeof getSubscriptionAccount>> & {
      planCode: string;
    })[]
  >([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (wallet.publicKey && subscriptions.length === 0 && loading) {
      (async () => {
        const temp = [] as typeof subscriptions;
        for (const code of planCodes) {
          try {
            const info = await getSubscriptionAccount(
              getPlanPdaAccountSync(code, planCreator),
              wallet.publicKey!,
              provider?.provider!
            );
            temp.push({ ...info, planCode: code });
          } catch (e) {
            console.log(e);
            // do nothing;
          }
        }
        setLoading(false);
        setSubscriptions([...temp]);
      })();
    }
  }, [wallet, subscriptions]);

  return {
    subscriptions,
    refetch: () => {
      setLoading(true);
      setSubscriptions([]);
    },
    loading,
  };
};

export const usePlanAccountMap = (
  planCodes: string[],
  planCreatorAddress: PublicKey,
  url: string
) => {
  const provider = useProvider(url);
  const [planMap, setPlanMap] = useState<{
    [code: string]: Awaited<ReturnType<typeof getPlanAccount>>;
  }>();

  useEffect(() => {
    if (provider?.provider && !planMap) {
      (async () => {
        const temp = {} as any;
        for (const code of planCodes) {
          temp[code] = await getPlanAccount(
            code,
            planCreatorAddress,
            provider?.provider!
          );
        }
        setPlanMap(temp);
      })();
    }
  }, [provider]);

  return planMap || {};
};

export const useTokenAccountBalance = (url: string, splToken?: PublicKey) => {
  const provider = useProvider(url);
  const wallet = useWallet();
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    (async () => {
      if (splToken && wallet.publicKey && balance === undefined) {
        try {
          const balance =
            await provider?.provider?.connection?.getTokenAccountBalance(
              getAssociatedTokenAddressSync(splToken, wallet.publicKey)
            );
          setBalance(balance?.value.uiAmount || 0);
        } catch (e) {
          setBalance(0);
        }
      }
    })();
  }, [splToken, wallet.publicKey, balance]);

  return { balance, refetch: () => setBalance(undefined) };
};

export const createSubscription = async (
  provider: AnchorProvider,
  planCode: string,
  planCreatorAddress: PublicKey,
  wallet: WalletContextState
) => {
  const program = await getProgram(provider);
  const [planAccount] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(utils.bytes.utf8.encode("plan")),
      planCreatorAddress.toBuffer(),
      Buffer.from(utils.bytes.utf8.encode(planCode)),
    ],
    program.programId
  );
  const [subscriptionAccount] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(utils.bytes.utf8.encode("subscription")),
      wallet.publicKey!.toBuffer(),
      planAccount.toBuffer(),
    ],
    program.programId
  );
  const plan = await getPlanAccount(planCode, planCreatorAddress, provider);
  const payerTokenAccount = getAssociatedTokenAddressSync(
    plan.tokenMint,
    wallet.publicKey!,
    true
  );
  const planTokenAccount = getAssociatedTokenAddressSync(
    plan.tokenMint,
    planAccount,
    true
  );
  const createSubscriptionTx = await program.methods
    .createSubscription({
      delegationAmount: new BN(100 * plan.price.toNumber()),
    })
    .accounts({
      payer: wallet.publicKey!,
      planAccount: planAccount,
      subscriptionAccount: subscriptionAccount,
      payerTokenAccount,
      planTokenAccount,
    })
    .transaction();
  return wallet.sendTransaction(createSubscriptionTx, provider.connection);
};

export const cancelSubscription = async (
  provider: AnchorProvider,
  planCode: string,
  planCreatorAddress: PublicKey,
  wallet: WalletContextState
) => {
  const program = await getProgram(provider);
  const [planAccount] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(utils.bytes.utf8.encode("plan")),
      planCreatorAddress.toBuffer(),
      Buffer.from(utils.bytes.utf8.encode(planCode)),
    ],
    program.programId
  );
  const [subscriptionAccount] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(utils.bytes.utf8.encode("subscription")),
      wallet.publicKey!.toBuffer(),
      planAccount.toBuffer(),
    ],
    program.programId
  );
  const cancelSubscriptionTx = await program.methods
    .cancelSubscription()
    .accounts({
      payer: wallet.publicKey!,
      planAccount,
      subscriptionAccount,
    })
    .transaction();

  return wallet.sendTransaction(cancelSubscriptionTx, provider.connection);
};

export const uncancelSubscription = async (
  provider: AnchorProvider,
  planCode: string,
  planCreatorAddress: PublicKey,
  wallet: WalletContextState
) => {
  const program = await getProgram(provider);
  const [planAccount] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(utils.bytes.utf8.encode("plan")),
      planCreatorAddress.toBuffer(),
      Buffer.from(utils.bytes.utf8.encode(planCode)),
    ],
    program.programId
  );
  const [subscriptionAccount] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(utils.bytes.utf8.encode("subscription")),
      wallet.publicKey!.toBuffer(),
      planAccount.toBuffer(),
    ],
    program.programId
  );
  const uncancelSubscriptionTx = await program.methods
    .uncancelSubscription()
    .accounts({
      payer: wallet.publicKey!,
      planAccount,
      subscriptionAccount,
    })
    .transaction();

  return wallet.sendTransaction(uncancelSubscriptionTx, provider.connection);
};

export const closeSubscription = async (
  provider: AnchorProvider,
  planCode: string,
  planCreatorAddress: PublicKey,
  wallet: WalletContextState
) => {
  const program = await getProgram(provider);
  const [planAccount] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(utils.bytes.utf8.encode("plan")),
      planCreatorAddress.toBuffer(),
      Buffer.from(utils.bytes.utf8.encode(planCode)),
    ],
    program.programId
  );
  const [subscriptionAccount] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(utils.bytes.utf8.encode("subscription")),
      wallet.publicKey!.toBuffer(),
      planAccount.toBuffer(),
    ],
    program.programId
  );
  const plan = await getPlanAccount(planCode, planCreatorAddress, provider);
  const planTokenAccount = getAssociatedTokenAddressSync(
    plan.tokenMint,
    planAccount,
    true
  );
  const subscriberTokenAccount = getAssociatedTokenAddressSync(
    plan.tokenMint,
    wallet.publicKey!,
    true
  );
  const deployerTokenAccount = getAssociatedTokenAddressSync(
    plan.tokenMint,
    PROGRAM_DEPLOYER,
    true
  );
  const planOwnerTokenAccount = getAssociatedTokenAddressSync(
    plan.tokenMint,
    plan.owner,
    true
  );
  const closeSubscriptionTx = await program.methods
    .closeSubscription()
    .accounts({
      payer: wallet.publicKey!,
      planAccount,
      subscriptionAccount,
      planTokenAccount,
      deployerTokenAccount,
      planOwnerTokenAccount,
      payerTokenAccount: subscriberTokenAccount,
    })
    .transaction();

  return wallet.sendTransaction(closeSubscriptionTx, provider.connection);
};
