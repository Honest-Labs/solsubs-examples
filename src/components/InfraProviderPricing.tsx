import {
  cancelSubscription,
  closeSubscription,
  getPlanPdaAccountSync,
  getSubscriptionPdaAccountSync,
  openLinkToExplorer,
  splTokens,
  uncancelSubscription,
  usePlanAccountMap,
  useProvider,
  useSubscriptions,
  useTokenAccountBalance,
} from "../library/util";
import { PublicKey } from "@solana/web3.js";
import { SubscribeButton } from "../library/SubscribeButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

const planCreatorAddress = new PublicKey(
  "2Yj5CpWrcn1AVd165iVE9LhzkgJPmikp6YKjkdDPKc7b"
);

const planConfigs = [
  {
    planCode: "exampleinfrahackerweeklyusdc",
    title: "Hacker",
    credits: "30M",
    additional: [
      "150 RPC requests per second",
      "20 Enhanced Solana API req/s",
      "General Support",
      "15 webhooks",
    ],
  },
  {
    planCode: "exampleinfrastartupweeklyusdc",
    title: "Startup",
    credits: "150M",
    additional: [
      "300 RPC requests per second",
      "100 Enhanced Solana API req/s",
      "Priority Support",
      "50 webhooks",
    ],
  },
  {
    planCode: "exampleinfraenterpriseweeklyusdc",
    title: "Enterprise",
    credits: "400M",
    additional: [
      "Unlimited RPC requests per second",
      "Unlimited Enhanced Solana API req/s",
      "Priority Support",
      "Unlimited webhooks",
    ],
  },
];

export const InfraProviderPricing = () => {
  const planAccountMap = usePlanAccountMap(
    planConfigs.map((config) => config.planCode),
    planCreatorAddress,
    "https://api.devnet.solana.com"
  );
  const {
    subscriptions,
    refetch: refetchSubscriptions,
    loading,
  } = useSubscriptions(
    planConfigs.map((config) => config.planCode),
    planCreatorAddress,
    "https://api.devnet.solana.com"
  );
  const wallet = useWallet();
  const provider = useProvider("https://api.devnet.solana.com");
  const subscription = subscriptions[0]!;
  const splToken = splTokens.find(
    (token) =>
      token.value ===
      planAccountMap[planConfigs[0].planCode]?.tokenMint.toString()
  );
  const { balance, refetch } = useTokenAccountBalance(
    "https://api.devnet.solana.com",
    splToken?.value ? new PublicKey(splToken?.value) : undefined
  );

  if (loading && wallet.connected) {
    return (
      <div className="w-full h-full m-auto mt-24">
        <div className="loading loading-spinner text-primary w-36 h-36"></div>
      </div>
    );
  }

  if (subscription) {
    const plan = planAccountMap[subscription.planCode];
    const planConfig = planConfigs.find((c) => c.planCode === plan.code);
    const splToken = splTokens.find(
      (token) => token.value === plan?.tokenMint.toString()
    );
    const priceNormalized = plan.price / 10 ** (splToken?.decimals || 0);
    const nextTermDate = new Date(subscription.nextTermDate * 1000);
    const config = planConfigs.find((c) => c.planCode === plan.code)!;
    const subscriptionAccountAddress = getSubscriptionPdaAccountSync(
      getPlanPdaAccountSync(plan.code, plan.owner),
      plan.owner
    ).toString();
    return (
      <div className="px-8 py-12 rounded-lg text-xl border-solid border-2 border-white flex flex-col items-center gap-4 min-w-[300px] w-[60%] m-auto mt-6 text-white">
        <h2 className="text-white text-2xl font-bold">
          You are currently Subscribed to the {planConfig?.title} Plan
        </h2>
        <div className="flex flex-col gap-4 text-left">
          <div className="items-center flex flex-row gap-2 justify-center text-2xl text-white">
            <p>Term Price: </p>
            <p>${priceNormalized}</p>
            <img src={splToken?.icon} className="w-6 h-6" />
            <p>
              /{" "}
              {plan?.termInSeconds?.toNumber() === 60 * 60 * 24 * 7
                ? "week"
                : "mo"}
            </p>
          </div>
          <div className="text-primary text-xl">
            Total Credits: {config.credits}
          </div>
          <ul className="list-disc text-left bold text-white text-lg gap-4 flex flex-col">
            {config.additional.map((item) => (
              <li className="list-item">{item}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-left">
          <div className="flex flex-row gap-4">
            <p>Term end Date:</p>
            <p>{nextTermDate.toLocaleDateString()}</p>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <p>Status:</p>
            {subscription.state.active && (
              <div className="badge badge-success">Active</div>
            )}
            {subscription.state.pendingCancellation && (
              <div className="badge badge-warning">Pending Cancellation</div>
            )}
            {subscription.state.pastDue && (
              <div className="badge badge-error">Past Due</div>
            )}
          </div>
          <div
            onClick={() => openLinkToExplorer(subscriptionAccountAddress)}
            className="flex flex-row gap-2 cursor-pointer"
          >
            Subscription Account: {subscriptionAccountAddress.slice(0, 4)}****
            {subscriptionAccountAddress.slice(-4)}
            <img
              className="w-6 h-6 cursor-pointer self-center"
              src="https://solana.fm/favicon.ico"
            />
          </div>
        </div>
        <div className="w-full flex flex-row flex-wrap justify-evenly gap-8">
          {(subscription.state.active ||
            subscription.state.pendingCancellation) && (
            <div className="flex flex-col gap-2 flex-1">
              <button
                className="btn btn-error mt-12"
                onClick={async () => {
                  await closeSubscription(
                    provider?.provider!,
                    plan.code,
                    plan.owner,
                    wallet
                  );
                  await new Promise((res) => setTimeout(res, 3000));
                  refetchSubscriptions();
                }}
              >
                Close Subscription
              </button>
              <p className="text-gray-400 text-sm w-full">
                Your subscription will close IMMEDIATELY and you will be
                refunded for the remainder of your term.
              </p>
            </div>
          )}
          {subscription.state.active && (
            <div className="flex flex-col gap-2 flex-1">
              <button
                className="btn btn-warning mt-12"
                onClick={async () => {
                  await cancelSubscription(
                    provider?.provider!,
                    plan.code,
                    plan.owner,
                    wallet
                  );
                  await new Promise((res) => setTimeout(res, 3000));
                  refetchSubscriptions();
                }}
              >
                Cancel Subscription
              </button>
              <p className="text-gray-400 text-sm w-full">
                Your subscription will close at the end of your current term.
              </p>
            </div>
          )}
          {subscription.state.pendingCancellation && (
            <div className="flex flex-col gap-2 flex-1">
              <button
                className="btn btn-warning mt-12"
                onClick={async () => {
                  await uncancelSubscription(
                    provider?.provider!,
                    plan.code,
                    plan.owner,
                    wallet
                  );
                  await new Promise((res) => setTimeout(res, 3000));
                  refetchSubscriptions();
                }}
              >
                UnCancel Subscription
              </button>
              <p className="text-gray-400 text-sm w-full">
                Your subscription will resume as normal and will not close.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full mt-4">
      <h2 className="text-white text-3xl font-bold">
        Solana RPC Infrastructure Pricing
      </h2>
      {balance === 0 && wallet.publicKey && (
        <button
          className="btn mt-6 mb-6 btn-primary"
          onClick={async () => {
            const ret = await fetch(
              `https://trpc-ioqkl6ubja-uk.a.run.app/airdrop/${splToken?.value!}/${wallet.publicKey?.toString()!}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: "POST",
                body: JSON.stringify({}),
              }
            );
            await ret.json();
            await new Promise((res) => setTimeout(res, 5000));
            refetch();
          }}
        >
          Airdrop ${splToken?.label}{" "}
          <img src={splToken?.icon} className="w-6 h-6" />
        </button>
      )}
      <div className="flex flex-row w-full p-6 m-auto justify-evenly gap-8 flex-wrap">
        {planConfigs.map((config) => {
          const price = planAccountMap[config.planCode]?.price.toNumber() || 0;
          const planAccount = planAccountMap[config.planCode];
          const splToken = splTokens.find(
            (token) => token.value === planAccount?.tokenMint.toString()
          );
          const priceNormalized = price / 10 ** (splToken?.decimals || 0);
          return (
            <div className="px-8 py-12 rounded-lg border-solid border-2 border-white flex flex-col gap-4 min-w-[300px] w-[30%] h-[650px] relative">
              <p className="text-white text-3xl mb-6">{config.title}</p>
              <div className="items-center flex flex-row gap-2 justify-center text-2xl text-white">
                <p>${priceNormalized}</p>
                <img src={splToken?.icon} className="w-6 h-6" />
                <p>
                  /{" "}
                  {planAccount?.termInSeconds?.toNumber() === 60 * 60 * 24 * 7
                    ? "week"
                    : "mo"}
                </p>
              </div>
              <div className="text-primary text-xl">
                {config.credits} Credits
              </div>
              <div className="bg-slate-200 h-[1px] w-full mt-12 mb-12"></div>
              <ul className="list-disc text-left bold text-white text-lg gap-4 flex flex-col">
                {config.additional.map((item) => (
                  <li className="list-item">{item}</li>
                ))}
              </ul>
              <SubscribeButton
                className="absolute bottom-8 self-center"
                text="Subscribe Now"
                url="https://api.devnet.solana.com"
                planCode={config.planCode}
                planCreatorAddress={planCreatorAddress}
                onCreate={async () => {
                  await new Promise((res) => setTimeout(res, 4000));
                  refetchSubscriptions();
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
