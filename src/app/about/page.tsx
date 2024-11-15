export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">About Us</h1>
      
      <div className="prose prose-slate max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            We are dedicated to revolutionizing the way people interact with blockchain technology, 
            making it more accessible and user-friendly for everyone.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <p className="text-gray-600 mb-6">
            Our platform provides seamless integration between traditional systems and blockchain 
            technology, offering secure and efficient solutions for businesses and individuals alike.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-3">
            <li>Innovation in blockchain technology</li>
            <li>Security and transparency in all operations</li>
            <li>User-centric design and accessibility</li>
            <li>Community-driven development</li>
          </ul>
        </section>
      </div>
    </div>
  );
} 