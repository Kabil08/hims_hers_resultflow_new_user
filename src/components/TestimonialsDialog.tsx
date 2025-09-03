import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCallback, useEffect } from "react";

interface TestimonialsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStartJourney?: () => void; // New prop for handling journey start
}

const testimonials = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/dbtapyfau/image/upload/v1756909348/FQknySPVsAEDtME_pibrig.png",
    name: "John D.",
    age: 32,
    text: "I was skeptical at first, but after 3 months of using the Complete Hair Kit, I've seen remarkable regrowth. My confidence is back!",
    rating: 5,
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/dbtapyfau/image/upload/v1756909348/FQknySPVsAEDtME_pibrig.png",
    name: "Michael R.",
    age: 28,
    text: "The subscription plan made it so convenient. No more worrying about running out of products. Plus, the results are amazing!",
    rating: 5,
  },
  {
    id: 3,
    image:
      "https://res.cloudinary.com/dbtapyfau/image/upload/v1756909435/11847651-16195813371035986_origin_cszf0i.png",
    name: "David S.",
    age: 35,
    text: "The personalized treatment plan and expert support made all the difference. Best decision I've made for my hair!",
    rating: 5,
  },
  {
    id: 4,
    image:
      "https://res.cloudinary.com/dbtapyfau/image/upload/v1756909348/FQknySPVsAEDtME_pibrig.png",
    name: "Robert K.",
    age: 30,
    text: "Started seeing results within weeks. The AI-powered recommendations were spot on for my needs.",
    rating: 5,
  },
];

const TestimonialsDialog = ({
  isOpen,
  onClose,
  onStartJourney,
}: TestimonialsDialogProps) => {
  const handleStartJourney = useCallback(() => {
    console.log("Starting journey from testimonials"); // Debug log
    if (onStartJourney) {
      onStartJourney();
    }
  }, [onStartJourney]);

  const handleClose = useCallback(() => {
    console.log("Closing testimonials dialog"); // Debug log
    onClose();
  }, [onClose]);

  // Only log on actual state changes
  useEffect(() => {
    console.log("TestimonialsDialog state:", isOpen);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-6 bg-white">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold text-hims-brown">
              Real Results, Real Stories
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 text-hims-brown hover:text-hims-brown/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-hims-brown/60 mt-2">
            Join thousands of satisfied customers who've transformed their lives
            with our products
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-hims-beige rounded-lg p-4 border border-hims-brown/10"
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-hims-brown">
                    {testimonial.name}, {testimonial.age}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-hims-brown/80">
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center">
          <Button
            className="w-full md:w-auto bg-hims-brown hover:bg-hims-brown-dark text-white"
            size="lg"
            onClick={handleStartJourney}
          >
            Start Your Journey Today
          </Button>
          <p className="text-sm text-hims-brown/60 mt-2">
            ✨ Special offer: Get 20% off on your first order
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialsDialog;
