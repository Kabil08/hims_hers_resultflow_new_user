import { X, Minus, Plus, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { CartItem } from "@/types/chat";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import TestimonialsDialog from "./TestimonialsDialog";

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

const SmartCartForHims = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
}: SmartCartForHimsProps) => {
  const isMobile = useIsMobile();
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);

  // Reset states when dialog is opened
  useEffect(() => {
    if (isOpen) {
      setIsCheckoutComplete(false);
      setShowTestimonials(false);
    }
  }, [isOpen]);

  const handleCloseDialog = useCallback(() => {
    onClose();
    // Only show testimonials if user hasn't completed the cart action
    if (!isCheckoutComplete) {
      setTimeout(() => {
        setShowTestimonials(true);
      }, 300);
    }
  }, [onClose, isCheckoutComplete]);

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
    handleCheckout();
  };

  const renderSuccessContent = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="animate-bounce-slow">
        <PartyPopper className="h-16 w-16 text-hims-brown" />
      </div>
      <h2 className="text-2xl font-semibold text-hims-brown">
        Your product has been moved to cart! 🎉
      </h2>
      <p className="text-hims-brown/60 max-w-sm">
        Your items have been successfully added to your cart. You can now
        proceed with checkout from your cart.
      </p>
      <Button
        className="mt-4 bg-hims-brown hover:bg-hims-brown-dark text-white"
        onClick={() => {
          setIsCheckoutComplete(false);
          onClose(); // Direct close without testimonials
        }}
      >
        Close
      </Button>
    </div>
  );

  const renderHeader = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-hims-brown">
              Your Smart Cart
            </h2>
          </div>
          <p className="text-sm text-hims-brown/60">Powered by ResultFlow.ai</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCloseDialog}
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

  const renderContent = () => (
    <>
      <div className="overflow-y-auto flex-1">
        {isCheckoutComplete ? (
          renderSuccessContent()
        ) : (
          <div className="p-4 space-y-4">
            {renderCartItems()}

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
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                className="flex-1 h-12 bg-hims-brown hover:bg-hims-brown-dark text-white"
                onClick={handleProceed}
              >
                Move to Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={isOpen} onOpenChange={handleCloseDialog}>
          <DrawerContent className="h-[85vh] bg-white relative">
            {" "}
            {/* Added relative positioning */}
            <DrawerHeader className="border-b border-hims-beige bg-hims-beige">
              {renderHeader()}
            </DrawerHeader>
            {renderContent()}
          </DrawerContent>
        </Drawer>

        <TestimonialsDialog
          isOpen={showTestimonials}
          onClose={() => setShowTestimonials(false)}
          onStartJourney={() => {
            setShowTestimonials(false);
            // Add any additional journey restart logic here if needed
          }}
        />
      </>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px] p-0 relative">
          {" "}
          {/* Added relative positioning */}
          <DialogHeader className="p-4 border-b bg-hims-beige">
            {renderHeader()}
          </DialogHeader>
          <div className="flex flex-col max-h-[80vh]">{renderContent()}</div>
        </DialogContent>
      </Dialog>

      <TestimonialsDialog
        isOpen={showTestimonials}
        onClose={() => setShowTestimonials(false)}
        onStartJourney={() => {
          setShowTestimonials(false);
          // Add any additional journey restart logic here if needed
        }}
      />
    </>
  );
};

export default SmartCartForHims;
