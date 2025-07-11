"use client";

import { Button } from "@/components/ui/button";
import { TOAST_CONFIG } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = {
  name: string;
  email: string;
  problem: string;
  suggestion: string;
};

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch("https://formspree.io/f/xyzjrvzw", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Thank you! Your message has been sent.", {
          ...TOAST_CONFIG.success,
        });
        reset();
      } else {
        throw new Error("Error:", await response.json());
      }
    } catch (error) {
      toast.success("Oops! Something went wrong. Please try again later.", {
        ...TOAST_CONFIG.error,
      });
    }
  }

  return (
    <main className=" max-w-lg mx-auto mt-10">
      <img
        src="/logo.png"
        alt="fit-it-on-logo"
        className="w-auto h-12 mx-auto"
      />
      <div className="border-2 max-w-lg mx-auto p-6 bg-white rounded-md shadow-lg mt-12">
        <h1 className="text-3xl font-bold mb-4 text-center">Contact Us</h1>
        <p className="mb-6 text-center text-gray-600">
          Have a problem? Something went wrong? Or a suggestion to improve our
          service? We’d love to hear from you!
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Name */}
          <label className="block mb-2 font-semibold" htmlFor="name">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register("name", { required: "Name is required" })}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-0 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mb-3">{errors.name.message}</p>
          )}

          {/* Email */}
          <label className="block mb-2 font-semibold" htmlFor="email">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-0 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mb-3">{errors.email.message}</p>
          )}

          {/* Problem */}
          <label className="block mb-2 font-semibold" htmlFor="problem">
            Describe the Problem <span className="text-red-600">*</span>
          </label>
          <textarea
            id="problem"
            {...register("problem", {
              required: "Please describe your problem",
              minLength: { value: 10, message: "Minimum 10 characters" },
            })}
            rows={4}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-0 ${
              errors.problem ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Tell us what happened..."
          />
          {errors.problem && (
            <p className="text-red-600 text-sm mb-3">
              {errors.problem.message}
            </p>
          )}

          {/* Suggestion */}
          <label className="block mb-2 font-semibold" htmlFor="suggestion">
            Suggestion to Improve (Optional)
          </label>
          <textarea
            id="suggestion"
            {...register("suggestion")}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            placeholder="Have ideas to make us better? Share here."
          />

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2 rounded-md  transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Send Message"}
          </Button>
        </form>
      </div>
    </main>
  );
}
