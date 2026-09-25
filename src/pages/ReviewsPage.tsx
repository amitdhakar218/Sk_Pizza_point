import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReviewsPage: React.FC = () => {
  const { reviews, addReview } = useApp();
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const approvedReviews = reviews.filter((r) => r.isApproved);
  const averageRating =
    approvedReviews.length > 0
      ? (approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length).toFixed(1)
      : '5.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addReview(customerName || 'Valued Guest', rating, comment);
    setComment('');
    setCustomerName('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
            <span>Customer Feedback & Ratings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E1915]">
            Loved by Pizza & Burger Foodies
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B4F]">
            Read verified experiences from our valued guests or share your dining feedback.
          </p>

          {/* Average Rating Score Card */}
          {approvedReviews.length > 0 && (
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-amber-200 shadow-sm mt-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="font-black text-lg text-[#1E1915]">{averageRating} / 5</span>
              <span className="text-xs text-[#6B5B4F]">({approvedReviews.length} reviews)</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Customer Reviews List */}
          <div className="lg:col-span-7 space-y-3.5">
            <h2 className="text-lg font-black text-[#1E1915] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span>Customer Experiences ({approvedReviews.length})</span>
            </h2>

            {approvedReviews.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-amber-200 text-center space-y-2">
                <p className="text-xs sm:text-sm text-[#6B5B4F]">
                  No reviews submitted yet. Be the first to share your thoughts about SK Pizza Point!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {approvedReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-3xl bg-white border border-amber-200/70 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs">
                          {rev.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs sm:text-sm text-[#1E1915]">{rev.customerName}</h4>
                          <span className="text-[10px] text-[#8A7B70]">
                            {new Date(rev.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#45382E] leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Submit a Review Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-amber-200/80 shadow-md space-y-4">
            <h3 className="font-black text-base text-[#1E1915] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Leave Your Rating</span>
            </h3>

            {submitted ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1.5">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-black text-sm text-emerald-950">Thank You!</h4>
                <p className="text-xs text-emerald-800">
                  Your feedback has been saved and published. We appreciate you choosing SK Pizza Point!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Star Rating selector */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                    Your Star Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-amber-500 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= (hoverRating || rating) ? 'fill-amber-500' : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-900 ml-2">
                      {hoverRating || rating} of 5
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul S."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Comment */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                    Your Review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="How was the crust, cheese, taste, and delivery timing?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Review</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
