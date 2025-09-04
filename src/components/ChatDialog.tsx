import { useState, useEffect, useCallback } from "react";
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Check,
  CheckSquare,
  Square,
} from "lucide-react";
import Markdown from "markdown-to-jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Message,
  ProductRecommendation,
  CartItem,
  Product,
} from "@/types/chat";
import { mockRecommendations } from "@/data/mockData";
import SmartCartForHims from "./SmartCartForHims";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserPreferences = {
  category?: "hair" | "skin";
  concerns?: string[];
  hasAnsweredInitialQuestions: boolean;
};

interface Option {
  id: string;
  label: string;
  value: string;
}

const hairConcerns: Option[] = [
  { id: "1", label: "Hair thinning or loss", value: "thinning" },
  { id: "2", label: "Receding hairline", value: "receding" },
  { id: "3", label: "Slow hair growth", value: "slow_growth" },
  { id: "4", label: "Scalp issues", value: "scalp" },
];

const skinConcerns: Option[] = [
  { id: "1", label: "Acne or breakouts", value: "acne" },
  { id: "2", label: "Signs of aging", value: "aging" },
  { id: "3", label: "Uneven skin tone", value: "uneven" },
  { id: "4", label: "Dark spots", value: "dark_spots" },
];

const ChatDialog = ({ isOpen, onClose }: ChatDialogProps) => {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Welcome to Hims! I'm your personal wellness advisor. I can help you find the right solutions for hair care and skin concerns. What would you like to focus on improving today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSmartCart, setShowSmartCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    hasAnsweredInitialQuestions: false,
  });
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(true);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );

  // Handle closing the chat dialog
  const handleCloseChat = useCallback(() => {
    console.log("Closing chat dialog"); // Debug log
    if (isOpen) {
      onClose();
    }
  }, [onClose, isOpen]);

  // Handle sheet close from clicking outside or pressing escape
  const handleSheetClose = useCallback(
    (open: boolean) => {
      if (!open && isOpen) {
        // Only handle close if currently open
        handleCloseChat();
      }
    },
    [handleCloseChat, isOpen]
  );

  // Monitor state changes
  useEffect(() => {
    if (isOpen) {
      console.log("Chat dialog opened"); // Debug log
    } else {
      console.log("Chat dialog closed"); // Debug log
    }
  }, [isOpen]);

  const handleOptionSelect = (option: string) => {
    if (!userPreferences.category) {
      // Handle category selection
      const category = option === "hair" ? "hair" : "skin";
      setUserPreferences((prev) => ({ ...prev, category }));

      // Add user's selection as a message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content:
          option === "hair" ? "Hair care solutions" : "Skin care treatments",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Add AI's follow-up question
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          category === "hair"
            ? "Let's find your perfect hair care solution. Which of these concerns would you like to address?"
            : "Let's create your personalized skincare routine. Which areas would you like to improve?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setShowOptions(true);
    } else if (!userPreferences.hasAnsweredInitialQuestions) {
      // Handle concern selection
      setSelectedConcerns((prev) => {
        const newConcerns = prev.includes(option)
          ? prev.filter((c) => c !== option)
          : [...prev, option];
        return newConcerns;
      });
    }
  };

  const handleConfirmConcerns = () => {
    if (selectedConcerns.length === 0) return;

    const concerns = selectedConcerns.map((concern) => {
      const options =
        userPreferences.category === "hair" ? hairConcerns : skinConcerns;
      return options.find((opt) => opt.value === concern)?.label || concern;
    });

    // Add user's concerns as a message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: concerns.join(", "),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setUserPreferences((prev) => ({
      ...prev,
      concerns: selectedConcerns,
      hasAnsweredInitialQuestions: true,
    }));

    // Add AI's response with recommendations
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content:
        userPreferences.category === "hair"
          ? "Perfect! I've selected these clinically-proven hair treatments specifically for your needs. These are the same solutions that have helped thousands of men achieve thicker, healthier hair:"
          : "Based on your skin concerns, I've curated these dermatologist-recommended treatments. These are our most effective solutions for achieving healthier, better-looking skin:",
      timestamp: new Date(),
      recommendations: [
        userPreferences.category === "hair"
          ? mockRecommendations.hair
          : mockRecommendations.skin,
      ],
    };
    setMessages((prev) => [...prev, assistantMessage]);

    // Add follow-up suggestion and immediately show options for the other category
    setTimeout(() => {
      const newCategory = userPreferences.category === "hair" ? "skin" : "hair";

      const followUpMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "assistant",
        content:
          userPreferences.category === "hair"
            ? "Complete your self-care routine! 👨‍⚕️\n\nWhile you're enhancing your hair care, many of our customers also achieve great results with our dermatologist-recommended skincare treatments. Ready to discover personalized solutions for clearer, healthier skin?\n\nWhich skin concerns would you like to address?"
            : "Enhance your wellness journey! 👨‍⚕️\n\nWhile we're improving your skin, did you know that many of our customers also benefit from our scientifically-proven hair care treatments? Let's ensure you're looking and feeling your best.\n\nWhich hair concerns would you like to address?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, followUpMessage]);
      setUserPreferences((prev) => ({
        ...prev,
        category: newCategory,
        hasAnsweredInitialQuestions: false,
      }));
      setSelectedConcerns([]);
      setShowOptions(true);
    }, 2000);

    setShowOptions(false);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Process user input
    setTimeout(() => {
      const response = processUserInput(inputValue.trim());
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        recommendations: response.recommendations,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const processUserInput = (
    userMessage: string
  ): { content: string; recommendations?: ProductRecommendation[] } => {
    const lowerMessage = userMessage.toLowerCase();

    // Handle follow-up questions about how products work
    if (lowerMessage.includes("how") || lowerMessage.includes("work")) {
      return {
        content:
          userPreferences.category === "hair"
            ? "Our hair care treatments work through a combination of:\n\n• DHT blocking to prevent further hair loss\n• Growth stimulation to promote new hair growth\n• Nutrient supplementation for overall hair health\n\nWould you like to try any of our recommended products?"
            : "Our skin care treatments work through:\n\n• Targeted active ingredients\n• Clinically proven formulations\n• Gentle yet effective approach\n\nWould you like to try any of our recommended products?",
      };
    }

    // Default response
    return {
      content:
        "I'm here to help you achieve your wellness goals! Feel free to ask about:\n\n• How our treatments are scientifically formulated\n• Expected timeline for results\n• Usage and application tips\n• Success stories and clinical results\n• Combining treatments for optimal results",
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (products: Product[]) => {
    setSelectedProducts((prev) => {
      const allSelected = products.every((p) => prev.has(p.id));
      if (allSelected) {
        return new Set();
      } else {
        return new Set(products.map((p) => p.id));
      }
    });
  };

  const handleAddSelectedToCart = (products: Product[]) => {
    const selectedItems = products.filter((p) => selectedProducts.has(p.id));
    selectedItems.forEach((product) => {
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === product.id);
        if (existingItem) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    });
    setSelectedProducts(new Set());
    setShowSmartCart(true);
  };

  const renderRecommendation = (recommendation: ProductRecommendation) => (
    <div className="mt-2 p-4 bg-white rounded-lg border border-hims-brown/20">
      <h3 className="font-semibold text-hims-brown flex items-center gap-2">
        <Sparkles className="h-4 w-4" />
        {recommendation.title}
      </h3>
      <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>

      {/* Select All Button */}
      <div className="mt-4 mb-2">
        <Button
          variant="outline"
          size="sm"
          className="text-hims-brown hover:bg-hims-beige flex items-center gap-2"
          onClick={() => handleSelectAll(recommendation.products)}
        >
          {recommendation.products.every((p) => selectedProducts.has(p.id)) ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
          Select All Products
        </Button>
      </div>

      <div className="mt-2 space-y-4">
        {recommendation.products.map((product) => (
          <div
            key={product.id}
            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
              selectedProducts.has(product.id)
                ? "bg-hims-beige/50"
                : "hover:bg-hims-beige/20"
            }`}
            onClick={() => handleProductSelect(product.id)}
          >
            <div className="flex items-center justify-center">
              {selectedProducts.has(product.id) ? (
                <CheckSquare className="h-5 w-5 text-hims-brown" />
              ) : (
                <Square className="h-5 w-5 text-hims-brown" />
              )}
            </div>
            <div className="w-20 h-20 bg-hims-beige rounded-lg overflow-hidden shrink-0">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">
                ${product.price.toFixed(2)}/mo
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Selected to Cart Button */}
      {selectedProducts.size > 0 && (
        <div className="mt-4">
          <Button
            className="w-full bg-hims-brown hover:bg-hims-brown-dark text-white flex items-center justify-center gap-2"
            onClick={() => handleAddSelectedToCart(recommendation.products)}
          >
            <Check className="h-4 w-4" />
            Add {selectedProducts.size} Selected{" "}
            {selectedProducts.size === 1 ? "Item" : "Items"} to Cart
          </Button>
        </div>
      )}

      {recommendation.discount && (
        <p className="mt-4 text-sm text-green-600 flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Save {recommendation.discount}% (${recommendation.savings?.toFixed(2)}
          )
        </p>
      )}
    </div>
  );

  const renderOptions = () => {
    if (!showOptions) return null;

    if (!userPreferences.category) {
      return (
        <div className="p-4 space-y-2">
          <Button
            className="w-full bg-hims-brown hover:bg-hims-brown-dark text-white"
            onClick={() => handleOptionSelect("hair")}
          >
            Hair care solutions
          </Button>
          <Button
            className="w-full bg-hims-brown hover:bg-hims-brown-dark text-white"
            onClick={() => handleOptionSelect("skin")}
          >
            Skin care treatments
          </Button>
        </div>
      );
    }

    const options =
      userPreferences.category === "hair" ? hairConcerns : skinConcerns;

    return (
      <div className="p-4 space-y-2">
        <div className="grid grid-cols-1 gap-2">
          {options.map((option) => (
            <Button
              key={option.id}
              variant={
                selectedConcerns.includes(option.value) ? "default" : "outline"
              }
              className={`w-full ${
                selectedConcerns.includes(option.value)
                  ? "bg-hims-brown text-white"
                  : "text-hims-brown hover:bg-hims-beige"
              }`}
              onClick={() => handleOptionSelect(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        {selectedConcerns.length > 0 && (
          <Button
            className="w-full bg-hims-brown hover:bg-hims-brown-dark text-white mt-4"
            onClick={handleConfirmConcerns}
          >
            Confirm Selection
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleSheetClose}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={`${
            isMobile
              ? "h-[85vh] border-t rounded-t-[10px] p-0 flex flex-col"
              : "w-full md:w-[50vw] lg:w-[45vw] p-0 border-l-0 sm:border-l bg-hims-beige flex flex-col"
          }`}
        >
          <SheetHeader className="p-4 border-b bg-hims-brown sticky top-0 z-50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <SheetTitle className="text-xl font-semibold text-white">
                    Care Assistant
                  </SheetTitle>
                  <SheetDescription className="text-sm text-hims-beige/80">
                    Powered by ResultFlow.ai
                  </SheetDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseChat}
                className="h-10 w-10 text-white hover:text-white/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex items-start gap-3 ${
                      message.type === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.type === "user"
                          ? "bg-hims-brown"
                          : "bg-hims-beige border border-hims-brown"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Bot className="h-5 w-5 text-hims-brown" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.type === "user"
                          ? "bg-hims-brown text-white"
                          : "bg-white border border-hims-brown/20"
                      }`}
                    >
                      <Markdown
                        options={{
                          forceBlock: true,
                          overrides: {
                            p: {
                              component: "p",
                              props: {
                                className: "whitespace-pre-wrap",
                              },
                            },
                            strong: {
                              component: "strong",
                              props: {
                                className: "font-semibold",
                              },
                            },
                          },
                        }}
                      >
                        {message.content}
                      </Markdown>
                    </div>
                  </div>
                  {message.recommendations?.map((recommendation, index) => (
                    <div key={index} className="ml-11 mt-2">
                      {renderRecommendation(recommendation)}
                    </div>
                  ))}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-hims-brown/60">
                  <Bot className="h-5 w-5" />
                  <span>Typing...</span>
                </div>
              )}
            </div>
            {renderOptions()}
          </div>

          <div className="p-4 border-t bg-white sticky bottom-0 flex-shrink-0 mt-auto">
            <div className="flex items-center justify-center mb-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-hims-brown hover:bg-hims-beige flex items-center gap-2"
              >
                📞 Talk to expert
              </Button>
            </div>

            {/* Show input when:
                1. Options are not being shown OR
                2. Initial questions have been answered OR
                3. User has selected a category and concerns */}
            {(!showOptions ||
              userPreferences.hasAnsweredInitialQuestions ||
              (userPreferences.category &&
                (userPreferences.concerns || []).length > 0)) && (
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="bg-hims-brown hover:bg-hims-brown-dark"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <SmartCartForHims
        isOpen={showSmartCart}
        onClose={() => setShowSmartCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* TestimonialsDialog removed */}
    </>
  );
};

export default ChatDialog;
