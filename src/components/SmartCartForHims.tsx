import { X, Minus, Plus, Sparkles, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { CartItem } from "@/types/chat";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Input } from "@/components/ui/input";

interface ConfettiOptions {
  spread?: number;
  startVelocity?: number;
  decay?: number;
  scalar?: number;
}

interface SmartCartForHimsProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
}

interface AddressForm {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface CardOffer {
  cardType: string;
  logo: string;
  benefits: string[];
  discount: number;
}

const cardOffers: CardOffer[] = [
  {
    cardType: "Bank of America",
    logo: "https://res.cloudinary.com/dbtapyfau/image/upload/v1756766546/boa-logo.png",
    benefits: [
      "6% off on all purchases",
      "Additional 5% on subscriptions",
      "Free express shipping",
    ],
    discount: 11,
  },
  {
    cardType: "Chase",
    logo: "https://res.cloudinary.com/dbtapyfau/image/upload/v1756766546/chase-logo.png",
    benefits: [
      "5% cashback on first purchase",
      "3% off on subscriptions",
      "Priority delivery",
    ],
    discount: 8,
  },
  {
    cardType: "Citi",
    logo: "https://res.cloudinary.com/dbtapyfau/image/upload/v1756766546/citi-logo.png",
    benefits: [
      "4% off on all purchases",
      "Double rewards points",
      "Extended return period",
    ],
    discount: 4,
  },
];

const SmartCartForHims = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
}: SmartCartForHimsProps) => {
  const isMobile = useIsMobile();
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "cart" | "address" | "payment"
  >("cart");
  const [addressForm, setAddressForm] = useState<AddressForm>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [currentCardOffer, setCurrentCardOffer] = useState<CardOffer | null>(
    null
  );

  // Reset states when dialog is opened
  useEffect(() => {
    if (isOpen) {
      setIsCheckoutComplete(false);
      setCurrentStep("cart");
      setAddressForm({
        street: "",
        city: "",
        state: "",
        zipCode: "",
      });
      setPaymentForm({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
      });
    }
  }, [isOpen]);

  const triggerConfetti = () => {
    // Fire multiple confetti bursts
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
    };

    function fire(particleRatio: number, opts: ConfettiOptions) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handleCheckout = () => {
    setIsCheckoutComplete(true);
    setTimeout(triggerConfetti, 100);
  };

  const handleProceed = () => {
    if (currentStep === "cart") {
      setCurrentStep("address");
    } else if (currentStep === "address") {
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      handleCheckout();
    }
  };

  const renderSuccessContent = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="animate-bounce-slow">
        <PartyPopper className="h-16 w-16 text-hims-brown" />
      </div>
      <h2 className="text-2xl font-semibold text-hims-brown">
        Thank you for your purchase! 🎉
      </h2>
      <p className="text-hims-brown/60 max-w-sm">
        Your order has been successfully placed. We'll send you an email with
        your order details and tracking information.
      </p>
      <Button
        className="mt-4 bg-hims-brown hover:bg-hims-brown-dark text-white"
        onClick={() => {
          setIsCheckoutComplete(false);
          onClose();
        }}
      >
        Close
      </Button>
    </div>
  );

  const renderHeader = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-hims-brown rounded-full flex items-center justify-center overflow-hidden">
          <img
            src="https://res.cloudinary.com/dbtapyfau/image/upload/v1756903994/ResultFlow.ai_Logo_xixmca.jpg"
            alt="ResultFlow AI"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-hims-brown">
              {currentStep === "cart"
                ? "ResultFlow Smart Cart"
                : currentStep === "address"
                ? "Delivery Address"
                : "Payment Details"}
            </h2>
            <div className="bg-hims-brown text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Enterprise AI
            </div>
          </div>
          <p className="text-sm text-hims-brown/60">
            ResultFlow AI - Enterprise Agentic AI
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="text-hims-brown hover:text-hims-brown/80"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderCartItems = () => (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="p-4 bg-hims-beige rounded-lg border border-hims-beige-dark"
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-hims-brown">{item.name}</h3>
              <p className="text-sm text-hims-brown/60">
                ${item.price.toFixed(2)}/mo
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-hims-beige text-hims-brown"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium w-6 text-center text-hims-brown">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-hims-beige text-hims-brown"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAddressForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-hims-brown">
          Street Address
        </label>
        <Input
          value={addressForm.street}
          onChange={(e) =>
            setAddressForm((prev) => ({ ...prev, street: e.target.value }))
          }
          placeholder="Enter your street address"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-hims-brown">City</label>
        <Input
          value={addressForm.city}
          onChange={(e) =>
            setAddressForm((prev) => ({ ...prev, city: e.target.value }))
          }
          placeholder="Enter your city"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-hims-brown">State</label>
          <Input
            value={addressForm.state}
            onChange={(e) =>
              setAddressForm((prev) => ({ ...prev, state: e.target.value }))
            }
            placeholder="Enter state"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-hims-brown">
            ZIP Code
          </label>
          <Input
            value={addressForm.zipCode}
            onChange={(e) =>
              setAddressForm((prev) => ({ ...prev, zipCode: e.target.value }))
            }
            placeholder="Enter ZIP code"
          />
        </div>
      </div>
    </div>
  );

  const detectCardType = (cardNumber: string) => {
    // Remove spaces and dashes
    const number = cardNumber.replace(/[\s-]/g, "");

    if (number.startsWith("4")) {
      return "Bank of America";
    } else if (number.startsWith("5")) {
      return "Chase";
    } else if (number.startsWith("3")) {
      return "Citi";
    }
    return null;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPaymentForm((prev) => ({ ...prev, cardNumber: value }));

    const cardType = detectCardType(value);
    const offer = cardOffers.find((o) => o.cardType === cardType);
    setCurrentCardOffer(offer || null);
  };

  const renderPaymentForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-hims-brown">
          Cardholder Name
        </label>
        <Input
          value={paymentForm.cardholderName}
          onChange={(e) =>
            setPaymentForm((prev) => ({
              ...prev,
              cardholderName: e.target.value,
            }))
          }
          placeholder="Enter cardholder name"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-hims-brown">
          Card Number
        </label>
        <Input
          value={paymentForm.cardNumber}
          onChange={handleCardNumberChange}
          placeholder="Enter card number"
          maxLength={19}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-hims-brown">
            Expiry Date
          </label>
          <Input
            value={paymentForm.expiryDate}
            onChange={(e) =>
              setPaymentForm((prev) => ({
                ...prev,
                expiryDate: e.target.value,
              }))
            }
            placeholder="MM/YY"
            maxLength={5}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-hims-brown">CVV</label>
          <Input
            value={paymentForm.cvv}
            onChange={(e) =>
              setPaymentForm((prev) => ({ ...prev, cvv: e.target.value }))
            }
            placeholder="Enter CVV"
            type="password"
            maxLength={4}
          />
        </div>
      </div>

      {/* AI Card Offer Section */}
      {currentCardOffer && (
        <div className="mt-6 p-4 bg-hims-beige rounded-lg border border-hims-brown/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-hims-brown" />
            <h3 className="font-medium text-hims-brown">
              Special {currentCardOffer.cardType} Offer!
            </h3>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-green-600">
                {currentCardOffer.discount}% Total Savings
              </span>
              {/* <img src={currentCardOffer.logo} alt={currentCardOffer.cardType} className="h-8" /> */}
            </div>
            <div className="space-y-2">
              {currentCardOffer.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-hims-brown"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-sm text-hims-brown/60 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI-powered recommendation based on your card
          </p>
        </div>
      )}
    </div>
  );

  const renderContent = () => (
    <>
      <div className="overflow-y-auto flex-1">
        {isCheckoutComplete ? (
          renderSuccessContent()
        ) : (
          <div className="p-4 space-y-4">
            {currentStep === "cart" && renderCartItems()}
            {currentStep === "address" && renderAddressForm()}
            {currentStep === "payment" && renderPaymentForm()}

            {/* Talk to Expert Section */}
            <div className="bg-white rounded-lg border border-hims-brown/20">
              <div className="flex items-center justify-between p-4">
                <span className="text-hims-brown text-lg">
                  Need help with your order?
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-hims-brown hover:bg-hims-beige flex items-center gap-2"
                >
                  <span className="flex items-center gap-1">
                    📞 Talk to expert
                  </span>
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 border-hims-brown text-hims-brown hover:bg-hims-beige"
                onClick={() =>
                  currentStep !== "cart" ? setCurrentStep("cart") : onClose()
                }
              >
                {currentStep !== "cart" ? "Back" : "Cancel"}
              </Button>
              <Button
                size="lg"
                className="flex-1 h-12 bg-hims-brown hover:bg-hims-brown-dark text-white"
                onClick={handleProceed}
              >
                {currentStep === "cart"
                  ? "Add Delivery Address"
                  : currentStep === "address"
                  ? "Add Payment Details"
                  : "Complete Purchase"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-[85vh] bg-white relative">
          {" "}
          {/* Added relative positioning */}
          <DrawerHeader className="border-b border-hims-beige bg-hims-beige">
            {renderHeader()}
          </DrawerHeader>
          {renderContent()}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 relative">
        {" "}
        {/* Added relative positioning */}
        <DialogHeader className="p-4 border-b bg-hims-beige">
          {renderHeader()}
        </DialogHeader>
        <div className="flex flex-col max-h-[80vh]">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default SmartCartForHims;
