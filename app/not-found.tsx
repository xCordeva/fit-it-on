import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center bg-white px-4">
      <Image
        src={"/logo.png"}
        alt="fititon=logo"
        height={100}
        width={100}
        className="h-15 w-auto mb-10"
      ></Image>
      <h1 className="text-6xl md:text-8xl font-extrabold text-gray-800">404</h1>
      <p className="mt-4 text-xl md:text-2xl text-gray-600">
        Oops! Looks like you’ve lost your way.
      </p>
      <p className="mt-2 text-md text-gray-500">
        The page you’re looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="mt-6 px-6 py-3 bg-primary text-white rounded hover:bg-primary/90 transition"
      >
        Back to Home Page
      </a>
    </main>
  );
}
