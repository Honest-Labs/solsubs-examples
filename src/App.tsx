import "./App.css";
import { InfraProviderPricing } from "./components/InfraProviderPricing";
import { Wallet } from "./context/WalletProvider";

function App() {
  return (
    <Wallet>
      <div className="w-full h-full">
        <p className="bold font-xl text-error text-center">
          This is an Example on Solana Devnet for testing and education purposes
        </p>
        <InfraProviderPricing />
      </div>
    </Wallet>
  );
}

export default App;
