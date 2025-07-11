import Link from "next/link";


export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 text-center text-sm text-gray-600 border-1 border-t-gray-400">
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms-of-use" className="hover:underline">
            Terms of Use
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} FitItOn. All rights reserved.</p>
      </div>
    </footer>
  );
}
