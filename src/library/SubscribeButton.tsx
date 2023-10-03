import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { FC, useEffect, useState } from "react";
import { web3 } from "@coral-xyz/anchor";
import { createSubscription, useProvider } from "./util";

export interface SubscribeButtonProps {
  className?: string;
  text?: string;
  url: string;
  planCode: string;
  planCreatorAddress: web3.PublicKey;
  onCreate: () => Promise<void>;
}

export const SubscribeButton: FC<SubscribeButtonProps> = ({
  className,
  text,
  planCode,
  planCreatorAddress,
  url,
  onCreate,
}) => {
  const wallet = useWallet();
  const { setVisible: setModalVisible, visible } = useWalletModal();
  const [waitForConnected, setWaitForConnected] = useState(false);
  const provider = useProvider(url);

  useEffect(() => {
    if (!visible && waitForConnected && wallet.connected) {
      (async () => {
        await createSubscription(
          provider?.provider!,
          planCode,
          planCreatorAddress,
          wallet
        );
        await onCreate();
      })();
    }
  }, [visible, waitForConnected]);

  return (
    <button
      className={`btn btn-primary ${className}`}
      onClick={async () => {
        if (!wallet?.connected) {
          setWaitForConnected(true);
          setModalVisible(true);
        } else {
          await createSubscription(
            provider?.provider!,
            planCode,
            planCreatorAddress,
            wallet
          );
          await onCreate();
        }
      }}
    >
      {text || "Subscribe Now"}
    </button>
  );
};
