  import Link from 'next/link';
  
     <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold">Free</h2>
          <p className="text-gray-500">Limited access to basic voices</p>
          <p className="mt-4 text-3xl font-bold">$0</p>
        </div>
        <div className="border p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold">Pro</h2>
          <p className="text-gray-500">Unlimited voices + priority API usage</p>
          <p className="mt-4 text-3xl font-bold">$9/mo</p>
          <Link href="/api/stripe/checkout" className="mt-4 block bg-blue-600 text-white text-center py-2 rounded">Subscribe</Link>
        </div>
      </div>
    </div>